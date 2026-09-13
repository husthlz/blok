'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    __live2dWidgetMounted?: boolean;
    L2Dwidget?: {
      init: (config: Record<string, unknown>) => void;
    };
  }
}

/** live2d-widget 的类型：既可能是 ESM 也可能被 webpack 包成 CJS 的 default */
type Live2DModule = {
  default?: unknown;
  L2Dwidget?: unknown;
};

/**
 * live2d-widget 在初始化过程中会执行 `document.head.innerHTML += '<style>…'`。
 * `innerHTML +=` 会先把 <head> 里所有节点销毁、再按 HTML 重新解析，
 * 于是 React 托管的 title / meta / style 等节点全部变成游离节点；
 * 之后路由切换时 React 删除这些旧 head 节点就会抛
 * `Cannot read properties of null (reading 'removeChild')`，
 * 表现为 URL 变了但视图不更新、页面卡死。
 *
 * App Router 下 <head> 由 React 接管，所以这里接管 head 的 innerHTML 写入：
 * 库那次「整体重写」会被忽略（该样式只给对话框气泡用，
 * 而 defaultConfig.dialog.enable 默认为 false，我们也没有开启对话框）。
 *
 * 该写入发生在 init() 阶段而非模块求值阶段，因此守卫装上后不再主动撤销。
 */
function guardHeadFromRewrite() {
  if (typeof document === 'undefined') return;
  const head = document.head;
  const desc = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (!desc?.get || !desc.set) return;
  Object.defineProperty(head, 'innerHTML', {
    configurable: true,
    get() {
      return desc.get!.call(this);
    },
    set() {
      // 故意忽略：阻止第三方库重写整个 <head>
    },
  });
}

// 在页面右下角挂载一个 Live2D 看板娘（Cubism 2 模型 katou_01）
export default function Live2DWidget({ basePath = '' }: { basePath?: string }) {
  /**
   * live2d-widget 会把自己的容器直接 appendChild 到 document.body。
   * App Router 下 React 接管了 <body> 的子节点，body 中一旦存在这种「非 React 创建的兄弟节点」，
   * 路由切换时 React 卸载旧页面就会抛 `Cannot read properties of null (reading 'removeChild')`，
   * 表现为 URL 变了但视图不更新、页面卡死。
   * 这里提前订阅 create-container 事件，容器一创建就搬进 React 自己渲染的这个空 div 内。
   */
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 防止重复初始化导致出现多个看板娘（StrictMode 下 effect 会执行两次）
    if (window.__live2dWidgetMounted) return;
    window.__live2dWidgetMounted = true;

    // 不使用 cancelled 标志：StrictMode 的清理会把 cancelled 置真，
    // 导致随后 resolve 的异步 import 永远不再 init（开发模式下看板娘不出现）。

    // 关键：在 import / init 之前接管 <head>.innerHTML 写入，
    // 否则 live2d-widget 在初始化阶段用 innerHTML += 整体重写 <head>，
    // 会让 React 托管的 title/meta 节点失效，进而在路由切换时崩溃。
    guardHeadFromRewrite();

    (async () => {
      try {
        type Widget = {
          init: (config: Record<string, unknown>) => void;
          on?: (name: string, handler: (...args: unknown[]) => void) => void;
        };
        const mod = (await import('live2d-widget')) as Live2DModule;
        // live2d-widget 是 CJS 包：webpack 会把 module.exports 整个挂到 default 上，
        // 所以 default 是「导出对象」（内含 L2Dwidget 字段）而不是实例本身，
        // 实例在 mod.L2Dwidget / mod.default.L2Dwidget 上。这里按 init 是否存在来挑选。
        const candidates: unknown[] = [
          mod.L2Dwidget,
          mod.default,
          (mod.default as { L2Dwidget?: unknown } | undefined)?.L2Dwidget,
          window.L2Dwidget,
        ];
        const L2Dwidget = candidates.find(
          (c): c is Widget =>
            !!c && typeof (c as Widget).init === 'function',
        );
        if (!L2Dwidget) {
          console.error('[Live2DWidget] 未找到可用的 L2Dwidget 实例');
          return;
        }

        // 容器创建后立刻搬进 React 托管的挂载点，避免它停留在 <body> 下
        L2Dwidget.on?.('create-container', (...args: unknown[]) => {
          const el = args[0];
          if (hostRef.current && el instanceof Node) {
            hostRef.current.appendChild(el);
          }
        });

        L2Dwidget.init({
          model: {
            // 直接指向本地模型入口，不依赖外部 API
            jsonPath: `${basePath}/model/katou_01/katou_01.model.json`,
          },
          display: {
            position: 'right',
            width: 135,
            height: 300,
            hOffset: 20,
            vOffset: -20,
          },
          mobile: {
            show: true,
            scale: 0.6,
          },
          react: {
            opacityDefault: 0.85,
            opacityOnHover: 0.25,
          },
        });
      } catch (err) {
        // 初始化失败时重置标志，便于后续重试
        window.__live2dWidgetMounted = false;
        console.error('[Live2DWidget] 初始化失败：', err);
      }
    })();
  }, [basePath]);

  return <div ref={hostRef} aria-hidden />;
}

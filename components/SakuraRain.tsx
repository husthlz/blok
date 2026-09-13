'use client';

import { CSSProperties, useEffect, useState } from 'react';

interface Petal {
  left: number;
  size: number;
  fall: number;
  delay: number;
  sway: number;
  drift: number;
  hue: number;
}

// 真实樱花花瓣造型（顶端带 V 形缺口）+ 一条主叶脉
const PETAL_PATH =
  'M50 92 C 22 80 12 48 32 22 C 38 14 46 14 50 26 C 54 14 62 14 68 22 C 88 48 78 80 50 92 Z';
const VEIN_PATH = 'M50 88 C 48 62 49 42 50 27';

/**
 * 首页樱花雨背景：花瓣从右上方向左下方随风飘落（pure CSS 动画，不拦截交互）。
 * 仅作装饰，设置了 prefers-reduced-motion 时由 CSS 隐藏。
 * 花瓣参数在挂载后用客户端随机生成，避免 SSR/CSR 的 hydration mismatch。
 */
export default function SakuraRain({ count = 42 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, () => ({
        left: 25 + Math.random() * 75, // 偏右生成
        size: 9 + Math.random() * 11,
        fall: 5 + Math.random() * 4, // 5~9s，频率更高
        delay: -Math.random() * 9,
        sway: 2 + Math.random() * 2,
        drift: 25 + Math.random() * 30, // 向左下飘落的水平位移（vw）
        hue: Math.random() * 24,
      })),
    );
  }, [count]);

  return (
    <div className="sakura-layer" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="sakura-petal"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.fall}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}vw`,
              filter: `hue-rotate(${p.hue}deg)`,
            } as CSSProperties
          }
        >
          <i style={{ animationDuration: `${p.sway}s` }}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`pg-${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff0f6" />
                  <stop offset="55%" stopColor="#ffc2dd" />
                  <stop offset="100%" stopColor="#ff9ec4" />
                </linearGradient>
              </defs>
              <path d={PETAL_PATH} fill={`url(#pg-${i})`} />
              <path
                d={VEIN_PATH}
                fill="none"
                stroke="#f48fb1"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.35"
              />
            </svg>
          </i>
        </span>
      ))}
    </div>
  );
}

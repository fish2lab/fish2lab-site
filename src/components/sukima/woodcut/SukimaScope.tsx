'use client';

import { useLayoutEffect, type ReactNode } from 'react';

/**
 * 制品区的页面在 <html> 上挂 data-sukima。woodcut.css 的每条规则都挂在这个标记下面，
 * 主站的页面因此完全碰不到那套纸色、墨线和自带的字体。
 *
 * 装在 src/app/sukima/layout.tsx 里：进制品区挂上，layout 卸载时摘掉——从制品区点回
 * 主站，中间不会有一帧用错样式。SSR 出来的首帧由 layout 里那段内联脚本负责。
 */
export default function SukimaScope(): ReactNode {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-sukima', '');
    return () => document.documentElement.removeAttribute('data-sukima');
  }, []);
  return null;
}

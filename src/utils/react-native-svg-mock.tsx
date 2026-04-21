import React from 'react';

const SvgMock = ({ children, width, height, viewBox, style }) => (
  <svg width={width} height={height} viewBox={viewBox} style={style}>{children}</svg>
);

export const Circle = ({ cx, cy, r, fill, stroke, strokeWidth }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

export const Path = ({ d, fill, stroke, strokeWidth }) => (
  <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

export const Rect = ({ x, y, width, height, fill, stroke, strokeWidth }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

export default SvgMock;

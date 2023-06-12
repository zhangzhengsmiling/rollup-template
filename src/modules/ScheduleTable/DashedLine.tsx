// import React, { useCallback, useState } from 'react'
import * as React from 'react';
const { useCallback, useState } = React;

const DashedLine = ({ visible, y, x1, x2 }: { visible: boolean; y: number; x1: number; x2: number }) => {
  return (
    <g style={{ display: visible ? 'block' : 'none' }}>
      <line x1="0" x2={x1} y1={y} y2={y} stroke="rgba(0, 0, 0, 0.24)" strokeDasharray="5 5" />
      <line x1={x2} x2="100%" y1={y} y2={y} stroke="rgba(0, 0, 0, 0.24)" strokeDasharray="5 5" />
    </g>
  );
};

export const useDashedLineState = () => {
  const [state, setState] = useState({
    visible: false,
    y: 0,
    x1: 0,
    x2: 0,
  });

  const show = useCallback((x1: number, x2: number, y: number) => {
    setState({
      visible: true,
      x1,
      x2,
      y,
    });
  }, []);

  const hide = useCallback(() => {
    setState({
      visible: false,
      x1: 0,
      x2: 0,
      y: 0,
    });
  }, []);

  return {
    state,
    show,
    hide,
  };
};

export default React.memo(DashedLine);

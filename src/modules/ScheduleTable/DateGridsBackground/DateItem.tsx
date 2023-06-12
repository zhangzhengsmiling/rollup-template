import React from 'react';
import { DateType } from './types';
import { SCHEDULE_TABLE_HEADER_HEIGHT, BORDER_STYLE } from '../constants/constants';

const OFFSET_TEXT = 20;
const CIRCLE = {
  OFFSET: 5,
  RADIUS: 12,
};

export const HighLightDate = ({ x }: { x: number }) => {
  return (
    <g>
      <line x1={x} x2={x} y1={SCHEDULE_TABLE_HEADER_HEIGHT} y2="100%" stroke="#8FCBFF" />
      <circle cx={x} cy={SCHEDULE_TABLE_HEADER_HEIGHT - OFFSET_TEXT - CIRCLE.OFFSET} r={CIRCLE.RADIUS} />
    </g>
  );
};

export const CommonDate = ({
  offsetOfLine,
  offsetOfText,
  date,
}: {
  offsetOfLine: number
  offsetOfText: number
  date: DateType
}) => {
  return (
    <g>
      <text
        x={offsetOfText}
        fill="rgba(0, 0, 0, 0.84)"
        y={SCHEDULE_TABLE_HEADER_HEIGHT - OFFSET_TEXT}
        textAnchor="middle"
      >
        {date.day}
      </text>
      <line x1={offsetOfLine} x2={offsetOfLine} y1={SCHEDULE_TABLE_HEADER_HEIGHT} y2="100%" stroke={BORDER_STYLE} />
    </g>
  );
};

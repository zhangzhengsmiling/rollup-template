import React from 'react';
import { RenderDataType } from './types';
import {
  SCHEDULE_HEIGHT,
  SCHEDULE_TABLE_HEADER_HEIGHT,
  SCHEDULE_ROW_GAP,
  LEFT_WIDTH,
  BORDER_STYLE,
  GRID_PADDING,
} from './constants/constants';
import styles from './styles.module.less';
import { strokeColor, fillColor, textColor, countSum, getTextByType } from './utils';

const measureTextByDefaultStyle = (text: string) => {
  const elDiv = document.createElement('div');
  elDiv.style.display = 'inline-block';
  elDiv.innerText = text;
  document.body.append(elDiv);
  const h = getComputedStyle(elDiv)['width'];
  document.body.removeChild(elDiv);
  const textWidth = parseInt(h);
  return textWidth;
};

const ScheduleItem = ({
  x,
  y,
  width,
  height,
  type,
  text,
  onMouseOver,
  onMouseOut,
  onClick,
}: {
  x: number
  y: number
  width: number
  height: number
  type: number
  text: string
  onMouseOver: (x1: number, x2: number, y: number) => void
  onMouseOut: () => void
  onClick?: () => void
}) => {
  const textWidth = measureTextByDefaultStyle(text);
  return (
    <g className={styles.scheduleItem}>
      <g
        onMouseOver={() => {
          onMouseOver(x + GRID_PADDING, x + GRID_PADDING + width - GRID_PADDING * 2, y + SCHEDULE_HEIGHT / 2);
        }}
        onMouseOut={onMouseOut}
        onClick={onClick}
        transform={`translate(${x + GRID_PADDING}, ${y})`}
      >
        <rect
          className={styles.rect}
          rx={4}
          ry={4}
          width={width - GRID_PADDING * 2}
          height={height}
          stroke={strokeColor(type)}
          fill={fillColor(type)}
        />
        <g>
          <text fill="rgba(0, 0, 0, 0.84)" x={16} y={SCHEDULE_HEIGHT / 2 + 5}>
            {text}
          </text>
          <text fill={textColor(type)} x={textWidth + 16 + 10} y={SCHEDULE_HEIGHT / 2 + 5}>
            {getTextByType(type)}
          </text>
        </g>
      </g>
    </g>
  );
};

const scheduleRender = ({
  onMouseOver,
  onMouseOut,
  onClick,
}: {
  onMouseOver: (x1: number, x2: number, y: number) => void
  onMouseOut: () => void
  onClick?: (v: any) => void
}) => (data: RenderDataType, index: number, target: RenderDataType[]) => {
  const offsetY =
    countSum(target.slice(0, index).map((item: any) => item.scheduleList)) * (SCHEDULE_HEIGHT + SCHEDULE_ROW_GAP) +
    SCHEDULE_TABLE_HEADER_HEIGHT +
    SCHEDULE_ROW_GAP * 3 * index;

  const gridHeight = data.scheduleList.length * (SCHEDULE_ROW_GAP + SCHEDULE_HEIGHT) + SCHEDULE_ROW_GAP * 3;
  return {
    header: (
      <g transform={`translate(0, ${offsetY})`} key={index}>
        <text x={LEFT_WIDTH / 2} textAnchor="middle" y={gridHeight / 2} fill="rgba(0, 0, 0, .84)" baselineShift="-50%">
          {data.header}
        </text>
        <line x1="0" x2="100%" y1={gridHeight} y2={gridHeight} stroke={BORDER_STYLE} />
      </g>
    ),
    schedule: (
      <g transform={`translate(0, ${offsetY})`} key={index}>
        {data.scheduleList.map((list, index) => (
          <g key={index}>
            {list.map((item) => {
              return (
                <ScheduleItem
                  key={item.ext.id}
                  x={item.x}
                  width={item.width}
                  type={item.ext.state}
                  height={SCHEDULE_HEIGHT}
                  y={index * (SCHEDULE_HEIGHT + SCHEDULE_ROW_GAP) + SCHEDULE_ROW_GAP * 2}
                  text={`${item.ext.merchantId}：${item.ext.merchantName}`}
                  onMouseOut={onMouseOut}
                  onMouseOver={(x1, x2, y) => onMouseOver(x1, x2, y + offsetY - SCHEDULE_TABLE_HEADER_HEIGHT)}
                  onClick={() => onClick?.(item.ext)}
                />
              );
            })}
          </g>
        ))}
        <line x1={0} x2="100%" y1={gridHeight} y2={gridHeight} stroke={BORDER_STYLE} />
      </g>
    ),
  };
};

export default scheduleRender;

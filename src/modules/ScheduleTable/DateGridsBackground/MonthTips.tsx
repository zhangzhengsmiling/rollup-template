import React from 'react';
import moment from 'moment';
import { DateType } from './types';
import { GRID_WIDTH } from '../constants/constants';
import { daysCross } from '../utils';
import { dateToString } from './utils';

const BG_HEADER_TEXT_STYLE = {
  fill: 'rgba(0, 0, 0, .84)',
  fontFamily: 'PingFang SC-Semibold, PingFang SC',
  fontSize: 20,
  fontWeight: 600,
};

export const StickyMonthTips = ({ scroll, beginDate }: { scroll: number; beginDate: DateType }) => {
  if (!beginDate) return null;
  const scrollDays = Math.floor(scroll / GRID_WIDTH);
  const scrollDate = moment(dateToString(beginDate)).add(scrollDays, 'days');
  return (
    <g>
      <rect x={scroll} y={16} fill="#fff" width={130} height={24} />
      <text x={scroll + 16} y={32} {...BG_HEADER_TEXT_STYLE}>
        {scrollDate.format('YYYY年MM月')}
      </text>
    </g>
  );
};

export const MonthTips = ({ dateList }: { dateList: DateType[] }) => {
  return (
    <g>
      {dateList.map((date, index) => {
        if (date.day === 1) {
          const days = daysCross(dateToString(dateList[0]), dateToString(date)) - 1;
          const offset = days * GRID_WIDTH;
          return (
            <text key={index} x={offset + 16} y={32} {...BG_HEADER_TEXT_STYLE}>
              {moment(dateToString(date)).format('YYYY年MM月')}
            </text>
          );
        } else {
          return null;
        }
      })}
    </g>
  );
};

import React from 'react';
import { GRID_WIDTH, BORDER_STYLE, SCHEDULE_TABLE_HEADER_HEIGHT } from '../constants/constants';
import styles from '../styles.module.less';
import cls from 'classnames';
import { DateType } from './types';
import { HighLightDate, CommonDate } from './DateItem';
import { MonthTips, StickyMonthTips } from './MonthTips';
import { dateToString, isDateEqual } from './utils';
import moment from 'moment';

const DataGridsBackground = ({
  dateList,
  highlightDate,
  scroll,
}: {
  dateList: DateType[]
  highlightDate: string
  scroll: number
}) => {
  return (
    <g className={styles.dateGridsBackground}>
      {/* 头部 两条横线渲染 */}
      <g>
        <line x1="0" y1="1" x2="100%" y2="1" stroke={BORDER_STYLE} />
        <line
          x1="0"
          y1={SCHEDULE_TABLE_HEADER_HEIGHT}
          x2="100%"
          y2={SCHEDULE_TABLE_HEADER_HEIGHT}
          stroke={BORDER_STYLE}
        />
      </g>
      {/* 日期渲染 */}
      {dateList.map((date, index) => {
        const eq = isDateEqual(highlightDate, dateToString(date));
        const textOffsetX = (index + 0.5) * GRID_WIDTH;
        return (
          <g
            key={index}
            className={cls({
              [styles.highlight]: eq,
            })}
          >
            {/* 周末高亮 */}
            {[6, 0].includes(moment(dateToString(date)).day()) && (
              <rect
                x={index * GRID_WIDTH}
                y={SCHEDULE_TABLE_HEADER_HEIGHT}
                width={GRID_WIDTH}
                height="100%"
                fill="rgba(0, 0, 0, 0.02)"
              />
            )}
            {/* 高亮日期渲染边框背景 */}
            {eq && <HighLightDate x={textOffsetX} />}
            {/* 一般日期渲染 */}
            <CommonDate date={date} offsetOfLine={index * GRID_WIDTH} offsetOfText={textOffsetX} />
          </g>
        );
      })}
      {/* 头部月份渲染 */}
      <MonthTips dateList={dateList} />
      {/* 贴边滚动跟随，月份渲染 */}
      <StickyMonthTips scroll={scroll} beginDate={dateList[0]} />
    </g>
  );
};

export default DataGridsBackground;

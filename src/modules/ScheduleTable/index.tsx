import * as React from 'react';
import styles from './styles.module.less';
import {
  GRID_WIDTH,
  SCHEDULE_TABLE_HEADER_HEIGHT,
  SCHEDULE_HEIGHT,
  SCHEDULE_ROW_GAP,
  BORDER_STYLE,
  LEFT_WIDTH,
} from './constants/constants';
import { schedule, range, mapRenderData, countSum, daysCross, combine, rangeOf } from './utils';
import DashedLine, { useDashedLineState } from './DashedLine';
import DateGridsBackground from './DateGridsBackground';
import scheduleRender from './scheduleRender';
import { ScheduleAdvInfo, ScheduleItem } from './types';
import moment from 'moment';
import { ScheduleItemType } from './types';
const { useCallback, useEffect, useMemo, useRef, useState } = React;

window.React = React;
console.log(React.version, 'line 18...');

const useScroll = () => {
  const [scroll, setScroll] = useState(0);
  const onScroll: React.UIEventHandler = useCallback((e) => {
    if (e.currentTarget === null) return;
    setScroll(e.currentTarget['scrollLeft']);
  }, []);
  return {
    scroll,
    onScroll,
  };
};

const dateOfMonthOfYear = (timestamp: number) => {
  return moment(timestamp).format('YYYY-MM-DD');
};

const getScrollLengthByDate = (date: string, beginDate: string) => {
  return (daysCross(beginDate, date) - 5) * GRID_WIDTH;
};

interface ScheduleTableProps {
  data: ScheduleAdvInfo[]
  onItemClick?: (value: any) => void
}

const parser = (item: ScheduleItem): ScheduleItemType => {
  return {
    id: item.id,
    beginDate: dateOfMonthOfYear(item.startDate),
    endDate: dateOfMonthOfYear(item.endDate),
    ext: item,
  };
};

const ScheduleTable = ({ data, onItemClick }: ScheduleTableProps) => {
  const dashLine = useDashedLineState();
  const { scroll, onScroll } = useScroll();
  const highlightDate = moment().format('YYYY-MM-DD');

  // 解析出所有的时间，拍平成一维数组
  const timesOfAll = data
    .reduce((temp, scheduleAdvInfo) => [...temp, ...scheduleAdvInfo.scheduledList], [] as any[])
    .reduce((temp, current) => [...temp, current.startDate, current.endDate], []);

  const ranges = rangeOf<number>((v) => v)(timesOfAll);
  const beginDate = dateOfMonthOfYear(ranges.min);
  const endDate = dateOfMonthOfYear(ranges.max);
  const dates = range(beginDate, endDate);

  const list = data
    .map(
      combine(
        schedule,
        (item) => item.advCount,
        (item) => item.scheduledList.map(parser),
      ),
    )
    .map(mapRenderData(GRID_WIDTH, beginDate));

  const results = useMemo(() => {
    const ds = data.map((item) => {
      const scheduleList = schedule(item.advCount)(item.scheduledList.map(parser));

      return {
        header: item.advSiteName,
        scheduleList: mapRenderData(GRID_WIDTH, beginDate)(scheduleList),
      };
    });
    return ds.map(
      scheduleRender({
        onMouseOver: dashLine.show,
        onMouseOut: dashLine.hide,
        onClick: onItemClick,
      }),
    );
  }, [dashLine.show, dashLine.hide, beginDate, data, onItemClick]);

  const rowCount = countSum(list);
  const height =
    rowCount * (SCHEDULE_HEIGHT + SCHEDULE_ROW_GAP) + SCHEDULE_TABLE_HEADER_HEIGHT + SCHEDULE_ROW_GAP * 3 * list.length;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scroll(getScrollLengthByDate(highlightDate, beginDate), 0);
  }, [beginDate, highlightDate]);

  return (
    // +5px 是为滚动条高度预留buffer
    <div className={styles.scheduleTable} style={{ height: height + 6 }}>
      <div className={styles.left}>
        {/* 左侧渲染 */}
        <svg style={{ width: '100%', height }}>
          <line x1="0" y1="1" x2="100%" y2="1" stroke={BORDER_STYLE} />
          <text
            x={LEFT_WIDTH / 2}
            y={SCHEDULE_TABLE_HEADER_HEIGHT / 2}
            fill="rgba(0, 0,0, .84)"
            fontSize={14}
            fontFamily="PingFang SC-Medium, PingFang SC"
            fontWeight={500}
            textAnchor="middle"
            baselineShift="-50%"
          >
            广告位置
          </text>
          <line
            x1="0"
            y1={SCHEDULE_TABLE_HEADER_HEIGHT}
            x2="100%"
            y2={SCHEDULE_TABLE_HEADER_HEIGHT}
            stroke={BORDER_STYLE}
          />
          <line x1="calc(100%)" y1="0" x2="calc(100%)" y2="100%" stroke={BORDER_STYLE} />
          {results.map((item: { header: React.ReactNode }) => item.header)}
        </svg>
      </div>
      {/* 右侧渲染 */}
      <div className={styles.right} ref={ref} onScroll={onScroll}>
        <svg style={{ width: dates.length * GRID_WIDTH, height }}>
          <DateGridsBackground scroll={scroll} dateList={dates} highlightDate={highlightDate} />
          {results.map((item: { schedule: React.ReactNode }) => item.schedule)}
          <g transform={`translate(0, ${SCHEDULE_TABLE_HEADER_HEIGHT})`}>
            <DashedLine {...dashLine.state} />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ScheduleTable;

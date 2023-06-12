import moment from 'moment';
import { ScheduleItemType } from './types';

/**
 * 计算startDate与endDate之间的日期间隔
 */
export const daysCross = (beginDate: string, endDate: string) => {
  return moment.duration(moment(endDate).diff(moment(beginDate))).asDays() + 1; // 包含起始和终止日期
};

export const lastOf = <T>(array: T[]) => {
  if (array.length === 0) return null;
  return array[array.length - 1];
};

export const daysOfYear = (year: number) => {
  const isLeap = moment(`${year}-01-01`).isLeapYear();
  return isLeap ? 366 : 365;
};

export const daysOfMonth = (year: number, month: number) => {
  const isLeap = moment(`${year}-01-01`).isLeapYear();
  const daysOfFeb = isLeap ? 29 : 28;
  const days31 = [1, 3, 5, 7, 8, 10, 12];
  const days30 = [4, 6, 9, 11];
  switch (true) {
    case days31.includes(month):
      return 31;
    case days30.includes(month):
      return 30;
    default:
      return daysOfFeb;
  }
};

/**
 * 排期构建
 * @param length 广告位容纳商家数
 * @param data
 * @returns
 */
export const schedule = (length: number) => (data: ScheduleItemType[]): ScheduleItemType[][] => {
  const results = new Array(length).fill('').map((_) => [] as ScheduleItemType[]);
  const input = [...data];
  while (input.length) {
    const item = input.shift() as ScheduleItemType;
    for (let i = 0; i < results.length; i++) {
      const resultArray = results[i];
      const lastOfArray = lastOf(resultArray);
      if (lastOfArray === null) {
        resultArray.push(item);
        break;
      }
      if (moment(lastOfArray.endDate) < moment(item.beginDate)) {
        resultArray.push(item);
        break;
      }
    }
  }
  return results;
};

export const range = (begin: string, end: string) => {
  const days = daysCross(begin, end);
  return new Array(days).fill('').map((_, index) => {
    const date = moment(begin).add(index, 'days');
    const year = date.year();
    const month = date.month() + 1;
    const day = date.date();
    return {
      year,
      month,
      day,
    };
  });
};

const SCHEDULE_STATE_ENUM: {
  [key: number]: { stroke: string; fill: string; text: string; label: string }
} = {
  1: {
    // 描边
    stroke: '#E0E0E0',
    // 填充色彩
    fill: '#F5F5F5',
    // 状态文案颜色
    text: 'rgba(0, 0, 0, .4)',
    // 状态文案
    label: '已投放',
  },
  2: {
    stroke: '#B4EDCE',
    fill: '#E6FAEE',
    text: '#16BA77',
    label: '投放中',
  },
  3: {
    stroke: '#FFE2B8',
    fill: '#FFF6E6',
    text: '#F77E14',
    label: '创意已设置',
  },
  4: {
    stroke: '#FFE4E0',
    fill: '#FFF2F0',
    text: '#F53B3B',
    label: '创意未设置',
  },
};

// 绘制颜色枚举
export const strokeColor = (type: number): string => {
  return SCHEDULE_STATE_ENUM[type].stroke;
};

export const fillColor = (type: number) => {
  return SCHEDULE_STATE_ENUM[type].fill;
};

export const textColor = (type: number) => {
  return SCHEDULE_STATE_ENUM[type].text;
};

export const getTextByType = (type: number) => {
  return SCHEDULE_STATE_ENUM[type].label;
};

// 向构建完成的排期里添加渲染属性，宽度，位置以及颜色
export const mapRenderData = (gridWidth: number, startTime: string) => (data: ScheduleItemType[][]) => {
  return data.map((list) => {
    return list.map((scheduleItem) => {
      return {
        ext: scheduleItem.ext,
        x: (daysCross(startTime, scheduleItem.beginDate) - 1) * gridWidth,
        width: daysCross(scheduleItem.beginDate, scheduleItem.endDate) * gridWidth,
      };
    });
  });
};
/**
 * 计算二维数组项数累加值
 * @param array 二维数组
 * @returns
 */
export const countSum = (array: Array<any>[]) => {
  return array.reduce((temp, current) => temp + current.length, 0);
};

/**
 * 对于item参数，分别调用paramsParser1和paramParser2转化后，传给majorFn调用
 */
export const combine = <InputType, P, Q, RetType>(
  majorFn: (v1: P) => (v2: Q) => RetType,
  paramParser1: (v: InputType) => P,
  paramParser2: (v: InputType) => Q,
) => (item: InputType) => {
  return majorFn(paramParser1(item))(paramParser2(item));
};

export const rangeOf = <T>(comparator: (v: T) => number) => (list: T[]) => {
  let maxItem = list[0];
  let minItem = list[0];
  let max = comparator(maxItem);
  let min = comparator(minItem);

  list.forEach((item) => {
    const value = comparator(item);
    if (max < value) {
      maxItem = item;
      max = value;
    }
    if (min > value) {
      minItem = item;
      min = value;
    }
  });
  return {
    max,
    min,
  };
};

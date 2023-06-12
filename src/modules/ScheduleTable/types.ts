export interface ScheduleItemType {
  id: number
  beginDate: string
  endDate: string
  ext?: any
}

export interface RenderDataType {
  header: string
  scheduleList: {
    x: number
    width: number
    ext?: any
  }[][]
}

export interface CreativityVO {
  id: number
  merchantId: number
  creativityName: string
  contentId: number
  contentCoverpath: string
  contentCoverhorizontalpath: string
  contentVideo: string
  contentTitle: string
  horizontalPicturePath: string
  verticalPicturePath: string
  smallPicturePath: string
  videoPath: string
  videoContent: string
}

export interface ObjType {
  [x: string]: any
}

// 计划详情
export interface ResPlanDetail extends ObjType {
  id: number // 计划id
  orderItemId: number // 订单项id
  merchantId: number // 商家id
  merchantName: string // 商家名称
  deliveryCycle: number // 投放周数
  putWay: string // 投放方式
  area: string // 投放区域
  planName: string // 计划名称
  pageLocationDesc: string // 广告位置
  pageTypeName: string // 产品类型名称
  pageType: number // 产品类型
  ideaList: CreativityVO[]
}

// 排期详情
export interface ResScheduleDetail {
  id: number
  planId: number
  merchantId: number
  cid: number
  areaId: number
  putCityId: number
  adId: number
  adName: string
  propertyId: number
  startDate: number
  endDate: number
  pageType: number
  pageLocation: number
  state: number
  updatedAt: number
  createdAt: string
  deleted: string
}

type integer = number

// 单个排期项信息（单周）
export interface ScheduleItem {
  id: number
  planId: number
  merchantId: number
  merchantName: string
  cid: integer
  areaId: integer
  putCityId: integer
  adId: integer
  adName: string
  propertyId: integer
  startDate: number
  endDate: number
  pageType: integer
  pageLocation: integer
  state: integer
  updatedAt: number
  createdAt: number
  dataFlag: integer
  deleted: boolean
}

export interface ScheduleAdvInfo {
  advSiteId: number
  advSiteName: string
  advCount: number // 广告坑位能放的广告数量
  scheduledList: ScheduleItem[]
}

export interface PutWayType {
  week: number
  desc: string
}

export interface ScheduleOrderType {
  orderId: number
  orderItemId: number
  pageType: string
  putWayList: PutWayType[]
}
export interface ScheduleMerchantType {
  merchantId: number
  merchantName: string
  orderList: ScheduleOrderType[]
}

export interface CityType {
  areaName: string
  bindingCities: number
  cid: number
  cityLine: number
  coreArea: number
  id: number
  kind: string
  level: number
  parentId: number
  pinyin: string
  shortName: string
  shortPy: string
  childrenShop: CityType[]
}

export interface PutPage {
  value: number
  type: number
  label: string
}


export interface NavItem {
  key: string;
  bg: string;
  title: string;
  desc: string;
  icon: string;
  url: string;
  putPage: number;
  type: number;
}


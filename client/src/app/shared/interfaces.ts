export interface User {
    email: string,
    password: string
}

export interface Message {
    message: string
  }
  
export interface Welldoer {
    name: string
    imageSrc?: string
    user?: string
    createdOn?: string
    _id?: string
}

export interface Good {
    description: string
    lifetimeDays: number
    user?: string
    welldoer: string
    _id?: string
  }

  export interface Thank {
    createdOn?: Date
    user?: string
    list: ThankGood[]
    _id?: string
  }
  
  export interface ThankGood {
    welldoer_id: string
    welldoer_name: string
    welldoer_img?: string
    good_id: string
    good_description: string
    thanked: number
    _id?: string
  }
  
  export interface Filter {
    start?: Date
    end?: Date
  }

  export interface OverviewPage {
    completedTask: OverviewPageItem 
    sayedThanks: OverviewPageItem 
  }

  export interface OverviewPageItem {
    percent: number
    compare: number
    yesterday: number
    middle: number
    isHigher: boolean
  }

  export interface AnalyticsPage {
    average: number
    chart: AnalyticsChartItem[]
  }
  
  export interface AnalyticsChartItem {
    ratio: number
    thanks: number
    label: string
  }
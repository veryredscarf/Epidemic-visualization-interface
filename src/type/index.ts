interface InData{
  areaTree:any[],
  chinaDayList:any[],
  chinaTotal:object,
  china:any[],
  hbData:object,
  type:number ,  // 表示tab的选中
  mapType:number,
  lineType:number,
  lastUpdateTime:string ,
  showList:any[],  // 表示世界组件中list数据
  isScroll:boolean // 用于表示页面加载完毕之后显示加载完毕页面
}

// 导出带有一个type表示导出的是一个类型，而不是其他的数据（对象等）

export type {  
  InData
}
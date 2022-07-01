// 采用接口与实例分开的方式，在type文件夹中定义接口数据格式

// 在pageJS文件夹中，引入接口，并且通过继承接口 来创建类，最后导出类
// 在业务逻辑页面采用实例化类的办法来实现

import type { InData } from "../type/index";
import axios from "axios";

import * as echarts from 'echarts';

import chinaJson from "../assets/china.json"

// 获取echarts的定义配置选项的类型
type EchartsOption = echarts.EChartsCoreOption

class InitData implements InData{
  areaTree:any[] = [];
  chinaDayList:any[] = [];
  chinaTotal: object = {};
  china:any[]=[];
  hbData:object= {};
  type:number = 1;
  mapType:number =1;
  lineType:number= 1;
  lastUpdateTime: string="";
  showList:any [] = [];
  isScroll:boolean=true 
}

// 定义用于分页的函数
const getList = (list:any[]) =>{
  const newArr:Array<any[]>[] = []; // arr是一个二维数组
  for(let index = 0;index<list.length;index+=30){
    newArr.push(list.slice(index,index+30))
  }
  return newArr
}


// 大纲：使用echarts首先需要配置echarts的基本配置，选取自己目标渲染的图形，然后进行渲染配置，
// 此处为了使得业务逻辑代码更加清晰，于是把配置信息抽出来进行定义


// 定义用在onmounted中的业务逻辑函数
const  InDataFun = async (data:InData) => {

// 定义echarts基本的数据内容
  // 获取元素并且echarts挂载元素，同时配置选项
  var mapDom :Element | null= document.getElementById("map")
  var mapDom2 :Element | null= document.getElementById("map2")

// 定义echarts基本的配置信息
  var mapOption:EchartsOption = {
    title:{ // 标题内容
      // text:'中国疫情图', //title大标题，subtext小标题
      subtext:"单击省份查看数据"

    },
    tooltip:{ // 提示框组件
      trigger:'item', //触发类型，数据图形触发，主要在散点图，饼状图等，无类目轴的图表中使用，有两个值item和axis
      formatter:"现有确诊病例</br>{b}:{c}",
      
      // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式

      // 模板变量有{a},{b},{c},{d},{e},分别表示系列名，数据名，数据值等，在trigger为axis时，会有多个系列数据，此时可以通过
  
      // 在折线（区域）图中，柱状（条形）图，k线图中 ，{a}表示系列名称，{b}类目值，{c}数值，{d}无
 
      // 在散点（气泡）图：{a}代表系列名称，{b}数据名称,{c}数值数组，{d}无
  
      // 在地图：{a}（系列名称），{b}区域名称，{c}合并数据，{d}无

      // 在饼图，仪表盘，漏斗图，{a}系列名称，{b数据项名称}，{c}数据，{d}百分比

    }
  } 



// 定义echarts渲染（除了数据的）配置,
var series = {
      // 渲染的配置
  type:"map", // 类型
  map:'china', 
  colorBy:'series',// 按照系统分配调色盘中的同一系列中的所有数据都是用相同的颜色；
  zoom:1.2,// 当前视角的缩放比例
  top:80,// 组件离容器上端的距离
  label:{ // 显示的文字
    show:true,
    color:'#333',
    fontSize:10
  },

}
// 使用echarts的registerMpa方法注册可用的地图，只在 geo 组件或者 map 图表类型中使用。
/**
 * 直接传输json方法由于不符合参数类型，可以采用方法1:给数据类型断言为any
 * 方法2：使用echarts.getJson()的方式
 * $.get('map/china_geo.json', function (geoJson) {
    echarts.registerMap('china', {geoJSON: geoJson});
    var chart = echarts.init(document.getElementById('main'));
    chart.setOption({
        series: [{
            type: 'map',
            map: 'china',
            ...
        }]
    });
});
 */



  // 使用echarts.init()函数完成页面元素绑定到echarts表中
  let myMap =  echarts.init(mapDom as HTMLElement)  // 由于mapDom的值可能取到空值或者html元素，所以加as断言，当元素为HTML元素时
  let myMap2 =  echarts.init(mapDom2 as HTMLElement)  // 由于mapDom的值可能取到空值或者html元素，所以加as断言，当元素为HTML元素时

  // 并且使用echarts自带的loading函数，在数据没有获取之前显示
  echarts.registerMap("china",(chinaJson as any))
  myMap.showLoading()




  let res = await axios('/api/ug/api/wuhan/app/data/list-total ')  // 注意此时直接获取数据会出现跨域得问题，可以在vite.config.ts中进行代理
 
    console.log(res);
    // data.areaTree = res.data.data.areaTree;
    // 对areaTree进行解构，形成二维数组，方便后面优化列表渲染数据，避免一次性全局渲染
    // 结构 [[1-30],[31-60],[61-90]]
    data.areaTree = getList(res.data.data.areaTree)
    data.showList = data.areaTree[0] // 用于渲染世界组件默认第一个列表的数据

    data.chinaDayList = res.data.data.chinaDayList;
    data.chinaTotal = res.data.data.chinaTotal; 
    data.china = res.data.data.areaTree.find((item:any) => item.id=='0').children;  // 由于中国的疫情数据需要从areaTree种获取，并且中国的数据ID位为0，利用es6的语法来筛选id为0的中国
    data.hbData = data.china.find((v:any)=> v.id === '420000') // 由于湖北的疫情数据需要从中国的数据获取，并且湖北的标志是id是邮编，利用es6的语法来筛选邮编为420000的湖北
    

    // 定义放到echarts中的数据
    let mapData :any[] =[]
    data.china.map((item:any) => {
      
      mapData.push({
        name:item.name,
        value:item.total.confirm - item.total.dead - item.total.heal || 0 
      })
    })
    // 在获取数据之后，关闭loading
    myMap.hideLoading()
    myMap.setOption({
      ...mapOption,
      series:{
        ...series,
        data:mapData, // 渲染数据源
      }
    })  // 接受参数由一个mapOption（定义的配置信息）和一个是渲染的数据组合而成的对象参数
    
    myMap2.setOption({...mapOption,series:{
      ...series, // 对渲染配置进行解构
      data:mapData, // 渲染数据源

    }})  // 接受参数由一个mapOption（定义的配置信息）和一个是渲染的数据组合而成的对象参数
    



}

export {
  InitData,
  InDataFun
}
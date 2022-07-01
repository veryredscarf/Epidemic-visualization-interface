<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
// import axios from 'axios'
// import type {InData} from "../type/index"  
import {InitData,InDataFun} from "../pageJS/index"

import List from '../components/List.vue'
import ScollCom from './ScollCom.vue';


  const data = reactive(new InitData())

  onMounted(()=>{
    InDataFun(data)

  })
  const { chinaTotal,hbData,mapType,china,areaTree,isScroll} = toRefs(data) 
     // 对data对象进行解构，把响应式的data对象转换成正常对象，并且其中结果对象的每个 property 都是指向原始对象相应 property 的 ref。
  // 并且利用es6的数据结构的方式，对对象进行结构，并不影响响应式

  const tabChange = (type:number) => {
    data.type = type
  }
  const mapTypeChange =(type:number)=>{
    data.mapType = type
  } 

  let page:number = 0

// 定义监听子组件调用函数
  const getList = () =>{
// 增加一个边界处理，在数据是有限的，如果数据被处理完毕之后，不再往数组中填充数据
if(page===data.areaTree.length-1){
  data.isScroll = false  // 设置为false，用于子组件取反，显示没有更多数据
  return
}
    // 子组件触发时，加载下一页时，应该保留上一页的数据，并且添加下一页的数据
    page++;
    data.showList.push(...data.areaTree[page])   // 由于data.areaTree[page]表示一个数组应该进行数组结构
  }

const  refreshList =(fun:Function)=>{
  InDataFun(data).then(()=>{
    // 并且由于此时数据刷新之后，应该把page也给重置一下
    page= 0
      data.isScroll = true  // 并且设置false，用于子组件中不显示没有更多数据dom，相当于重置数据的概念
    fun()
  })
}





</script>

<template>
  <div class="box">
    <div class="top-box">
      <img class="bgImg" src="../assets/bg.jpeg" alt="背景图片">
      <div class="title-box">
        <h1>科学防护 共度难关</h1>
        <h2>肺炎疫情实时动态播报</h2>
      </div>

      <div class="cover-cards">
        <div class="cover-tab">
          <!-- 自己写的  适用于含有class比较时-->
          <!-- <div :class="data.type==1?'active':''" @click="tabChange(1)">全国疫情数据(含港澳台)</div> -->  
          <!-- 老师教的的  更符合此时，只有一个class -->
          <div :class="{active:data.type===1}" @click="tabChange(1)">全国疫情数据(含港澳台)</div>
          <div  :class="data.type==2?'active':''" @click="tabChange(2)">湖北疫情数据</div>
        </div>

<!-- 添加v-if判断此时数据是否发生变化，由于onmonted时间是在页面渲染之后执行的钩子函数，此时数据还没有请求回来，加一个判断，处理数据是否返回 -->     
     <div class="cover-info" v-show="data.type===1">    
        <div >
          <h4 class="title">境外输入</h4>
          <p class="number" style="color:rgb(114, 34, 16)" >{{chinaTotal.total?.input }}</p>
         <p class="tip">
            <span>较昨日</span><span class="tipSpan">+{{chinaTotal.today?.input}}</span>
          </p>
        </div>
        <div >
          <h4 class="title">无症状感染者</h4>
          <p class="number" style="color:rgb(242, 167, 122)" >{{chinaTotal.extData?.noSymptom }}</p>
         <p class="tip">
            <span>较昨日</span><span class="tipSpan" style=" color:rgb(242, 167, 122)">+{{chinaTotal.extData?.incrNoSymptom}}</span>
          </p>
        </div>
        <div >
          <h4 class="title">现有确诊</h4>
          <p class="number" style="color:rgb(121, 41, 53)">{{
          chinaTotal.total?.confirm -
          chinaTotal.total?.dead -
          chinaTotal.total?.heal 
          
          }}</p>
          <p class="tip">
            <span>较昨日</span><span style="color:rgb(106, 71, 70)">+{{chinaTotal.today?.storeConfirm}}</span>
          </p>
        </div>
        <div >
          <h4 class="title">累计确诊</h4>
          <p class="number" style="color:rgb(231, 92, 65)">{{chinaTotal.total?.confirm }}</p>
         <p class="tip">
            <span>较昨日</span><span style="color:rgb(231, 92, 65)">+{{chinaTotal.today?.confirm}}</span>
          </p>
        </div>
        <div >
          <h4 class="title">累计死亡</h4>
          <p class="number" style="color:black">{{chinaTotal.total?.dead }}</p>
         <p class="tip">
            <span>较昨日</span><span>+{{chinaTotal.today?.dead}}</span>
          </p>
        </div>
        <div >
          <h4 class="title">累计治愈</h4>
          <p class="number" style="color:rgb(71, 163, 125)">{{chinaTotal.total?.heal }}</p>
         <p class="tip">
            <span>较昨日</span><span style="color:rgb(71, 163, 125)">+{{chinaTotal.today?.heal}}</span>
          </p>
        </div>
      </div>

     <div class="cover-info" v-show="data.type===2">    
        <div >
          <h4 class="title">累计确诊</h4>
          <p class="number" style="color:rgb(231, 92, 65)">{{hbData.total?.confirm }}</p>
         <p class="tip">
            <span>较昨日</span><span style="color:rgb(231, 92, 65)">+{{hbData.today?.confirm}}</span>
          </p>
        </div>
        <div >
          <h4 class="title">累计死亡</h4>
          <p class="number" style="color:black">{{hbData.total?.dead }}</p>
         <p class="tip">
            <span>较昨日</span><span>+{{hbData.today?.dead}}</span>
          </p>
        </div>
        <div >
          <h4 class="title">累计治愈</h4>
          <p class="number" style="color:rgb(71, 163, 125)">{{hbData.total?.heal }}</p>
         <p class="tip">
            <span>较昨日</span><span style="color:rgb(71, 163, 125)">+{{hbData.today?.heal}}</span>
          </p>
        </div>
      </div>



      </div>
    </div>

    <!-- echarts图表绘制 -->
    <div class="data-map content" >
      <h3>中国疫情</h3>
      <div class="map-box">
        <div
          :class="mapType ==1?'to-left':'to-right'"
          id="map"
        ></div>
        <div
          :class="mapType ==1?'to-left':'to-right'"
          id="map2"
        ></div>
      </div>
      <div class="map-btn">
        <div @click="mapTypeChange(1)" :class="{active:mapType==1}">
          现有确诊
        </div>
        <div @click="mapTypeChange(2)" :class="{active:mapType==2}">
          累计确诊
        </div>
      </div>

    </div>
    
<!-- 绘制中国数据列表 -->
    <div class="data-list content">
      <!--  -->
      <h3>中国病例</h3>
      <List v-if="china.length" :showChildren="china.length>0" :list="china"></List>
    </div>

<!-- 绘制世界数据列表 -->
    <div  v-if="areaTree.length" class="data-list content">
      <!--  --> 
      <h3>世界病例</h3>
      <ScollCom :distance="100" :isScroll="isScroll" @getList="getList" @refreshList="refreshList">
        <List :showChildren="areaTree.length>0" :list="data.showList"></List>
      </ScollCom>

    </div>
  </div>
</template>

<style lang="scss" scoped>

@keyframes toRight {
  from {
    left: 0.1rem;
  }
  to{
    left:calc(0px - 100vw + 0.1rem)
  }
}
@keyframes toLeft {
  from {
    left:calc(0px - 100vw + 0.1rem)
  }
  to{
    left: 0.1rem;
  }
}


.bgImg{
  width: 100%;
}
.top-box{
  position: relative;
  // .bgImg{

  //   z-index: -1;
  // }
  .title-box{
    position: absolute;
    top: 20px;
    left: 1rem;
    z-index: 2;
    color: white;
  }
  .cover-cards{
    position: absolute;
    top: 140px;
    left: 1rem;
    background: #fff;
    border-radius: 20px;
    width: calc(100% - 2rem);
    overflow: hidden;
    // box-shadow: 0 2px 20px rgb(0.1, 0.1, 0.1);
    box-shadow: 0 2px 20px rgb(0 0 0 / 10%);
  
    >div{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-flow: wrap;
      margin-bottom: 10px;
      &.cover-tab{
        >div{
          width: 50%;
          background-color: #efefef;
          text-align: center;
          height: 40px;
          line-height: 40px;
          &.active{
            background-color: #fff;
          }
        }
      }
      &.cover-info{
        // display: none;
        >div{
          width: 33%;
          text-align: center;
          margin-bottom: 10px;
        }
        .title{
          font-size: 12px;
          font-weight: 600;
        }
        .number{
          height: 28px;
          font-size: 18px;
          font-weight: 600;
          line-height: 28px;
        }
        .ticp{
          font-size: 12px;
        }
      }
    }
  }
}

.data-map,
.data-list {
  margin-top: 200px;
  overflow: hidden;
  h3{
    border-left: 8px solid #e10000;
    padding-left:1rem ;
  }
}
.map-box{
  display: flex;
  width: 200%;
}


#line,
#line1
#line2 {
  height: 400px;
  width: 100%;
}
#map,
#map2 {
  height: 350px;
  width: 50%;
  animation-fill-mode: forwards;
}
.to-left {
  animation: toLeft 1s;
}
.to-right {
  animation: toRight 1s;
}

.map-btn,
.line-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  >div {
    width: 45%;
    height: 40px;
    line-height: 40px;
    border:1px solid #d2d2d2;
    box-shadow: 0 5px 7px 1px rgb(0 0 0 /5%);
    border-radius: 5px;
    text-align: center;
    &.active{
      border-color: #ce4733;
      background-color: #fef7f7;
      color: #ce2c1e;
    }
  }
}

.line-btn {
  >div{
    width: 30%;
    height: 55px;
    line-height: 25px;
    padding-top:5px ;
  }
}

.data-list{
  margin-top: 20px;
}


.list-box{
  margin: 20px 0 0 0 ;
  h3{
    border-left: 8px solid #e10000;
    padding-left:1rem ;
  }
}


</style>

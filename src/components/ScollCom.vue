<script setup lang="ts">
import { reactive, toRefs } from "@vue/reactivity";
import { getCurrentInstance } from "vue";



const data = reactive({
  scrollEl:null, // 手指拉取的元素
  startText:'释放可刷新',
  scrollTop:0,
  startY:0,
  translateY:0,
  touchEndTitleShow:false,  // 手指离开屏幕时title显示
  touchStartTitleShow:false  // // 手指按下屏幕时title显示
})


const props = defineProps({
  distance:Number, // 表示设置距离底部的距离
  isScroll:Boolean,
  endText:{
    type:String,
    default:'没有更多了'
  }
})

let {
  scrollEl,
  startText,
  scrollTop,
  startY,
  translateY,
  touchEndTitleShow,
  touchStartTitleShow
  } = toRefs(data)

const $emits =  defineEmits(["getList",'refreshList'])  // 在setup中的全局函数，定义一个数组包含自定义事件名,并返回一个对象

const scrollEvent = (e:any)=>{  
  data.scrollTop = e.srcElement.scrollTop;  
  if(!props.isScroll) return
  if(data.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - (props.distance as number)){
    $emits("getList")
    console.log("加载下一页");
  }
}

// 手指触摸屏幕事件
const touchstart = (e:any)=>{
  let y = e.targetTouches[0].pageY  // 获取手指按下的位置
  data.startY = y
}
// 手指移动
const touchmove = (e:any)=>{
  let y = e.targetTouches[0].pageY
  // 如果当前移动距离大于起始位置，表示正在往下移，并且要判断是否页面是否是再顶部
  if(y>data.startY&&data.scrollTop ==0){
    data.touchStartTitleShow = true

    // 为了产生下拉之后出现的弹窗感，于是我们需要给列表设置一个在定位上的下移，实际中间并无添加dom元素
    // 列表下移的距离可以设置移动距离/2，避免用户大幅度拉伸
    data.translateY = (y - data.startY) / 2
  }else{
    data.touchStartTitleShow = false
  }
}


let timeer = setTimeout(()=>{}) // 定义一个定时器，避免用户频繁刷新则使用节流的做法
// 松手事件
const touchend = (e:any)=>{

//  松开时监听的应该是changedTouches属性
  let y = e.changedTouches[0].pageY  // 记录松开的距离

  
  if(y>data.startY){
    data.translateY = 0
    data.touchStartTitleShow = false 
    data.touchEndTitleShow = true 
    // 并且发送一个刷新事件，提醒父组件传来获取最新数据，并且执行一个回调函数,注意该回调函数是在父组件监听时调用
    clearTimeout(timeer)
    timeer = setTimeout(()=>{
      // $emits("refreshList",()=>{
      //   console.log(data);
      //   data.touchEndTitleShow = false   // 此处之所以能回调函数中操作data
      // })
      $emits('refreshList',function(){
      })
    },200)

  // 在发出事件之后，也把之前定义的data.startY获取的初始值给关闭
    data.startY = 0

  }
}


</script>

<template>
  <div class="box">

<!-- ref在获取元素时首先是根据key值，如果ref属性为动态属性时，则是获取key变量代表的元素 -->
<!-- 在template渲染成dom树，ref不会被渲染在dom元素上，是一个vue内部属性，为了能绑定用值和data中的属性做一个绑定，
    发现dom元素上上有一个ref属性时，且ref值为一个字符串时，会根据字符串 从 setup中申明的响应式对象中去寻找，如果找到了与字符串
    一致的key时，在渲染完dom元素之后，会把这个dom元素的指针给到data中与该ref的key值一摸一样的属性的对象上，也就是把节点对象赋给scrollEl
    表示在scrollEl会在当前onmounted之后，才会有真实的dom引用结果
-->


    <div ref="scrollEl" class="scrollEl"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @scroll="scrollEvent"
    :style="{top:`${translateY}`}"
    >
      <div class="loadingBox" v-if="touchStartTitleShow">释放刷新</div>
      <div class="loadingBox" v-if="touchEndTitleShow">加载中</div>


      <!-- 高级语法，使用插槽代替组件嵌套的方法 -->
      <slot></slot>

      <div class="end-text" v-if="!isScroll">{{endText}}</div>
    </div>
  </div>
</template>



<style lang="scss" scoped>

.box{
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 90vh;
  .loadingBox{
    padding: 20px;
    text-align: center;
  }
}

.scrollEl{
  height:90vh;
  width: 100%;
  overflow-y: auto;
  transition: all 0s ease 0s;
  position: absolute;
  right: 0;

  .end-text{
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #999;
  }
}

</style>
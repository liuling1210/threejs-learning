<template>
  <el-container id="app">
    <!--侧栏-->
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="[0]">
        <el-submenu v-for="(item,i) in aside" :index="item.cate" :key="i">
          <template slot="title">{{item.cate}}</template>
          <el-menu-item-group>
            <el-menu-item v-for="(subItem,j) in item.items " :index="subItem.com" :key="j">
              <a href="#" @click="clickSideItem(subItem.title, subItem.com)">{{subItem.title}}</a>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-input
          disabled
          v-text="currentTitle"
          style="text-align: left; font-size: 20px;width: 70%;"
        ></el-input>
        <el-dropdown>
          <i class="el-icon-view" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <!--展示 main-->
      <el-main :is="filterComponent"></el-main>
    </el-container>
  </el-container>
</template>
<script>
import C1HelloWorld from "./components/cesium/C1HelloWorld";
import T1HelloWorld from "./components/three/T1HelloWorld";
import T2HelloWorld from "./components/three/T2HelloWorld";
import T3Animation from "./components/three/T3Animation";
import T4Light from "./components/three/T4Light";
import T5Grid from "./components/three/T5Grid";
import T6Geometry from "./components/three/T6Geometry";
import T7Word from "./components/three/T7Word";
import T8LightEffect from "./components/three/T8LightEffect";
import W1HelloWorld from "./components/webgl/W1HelloWorld";
import W2Square from "./components/webgl/W2Square";
import W3ShaderColor from "./components/webgl/W3ShaderColor";
import W4Animate from "./components/webgl/W4Animate";
import W5Cube from "./components/webgl/W5Cube";
export default {
  name: "App",
  components: {
    C1HelloWorld,
    T1HelloWorld,
    T2HelloWorld,
    T3Animation,
    T4Light,
    T5Grid,
    T6Geometry,
    T7Word,
    T8LightEffect,
    W1HelloWorld,
    W2Square,
    W3ShaderColor,
    W4Animate,
    W5Cube
  },
  data() {
    return {
      aside: [
        {
          cate: "webgl",
          items: [
            { title: "1.webgl程序", com: "W1HelloWorld" },
            { title: "2.webgl 图形", com: "w2-square" },
            { title: "3.webgl给顶点着色", com: "w3-shader-color" },
            { title: "4.webgl循环渲染和空间变化", com: "w4-animate" },
            { title: "5.webgl立方体", com: "w5-cube" }
          ]
        },
        {
          cate: "three",
          items: [
            { title: "1.three1 helloworld", com: "t1-hello-world" },
            { title: "2.three2 绿方块", com: "t2-hello-world" },
            { title: "3.three3 胡萝卜", com: "T3Animation" },
            { title: "4.three4 灯", com: "T4Light" },
            { title: "5.three5 网格", com: "T5Grid" },
            { title: "6.three6 几何", com: "T6Geometry" },
            { title: "7.three7 字", com: "T7Word" },
            { title: '8.three8 光影效果', com: "T8LightEffect" },
          ]
        },
        {
          cate: "cesium",
          items: [
            { title: "1.cesium", com: "c1-hello-world" }
            // {title: '2.cesium',route: '1'}
          ]
        }
      ],
      currentTitle: "",
      filterComponent: ""
    };
  },
  methods: {
    clickSideItem(title, com) {
      this.currentTitle = title;
      this.filterComponent = com;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

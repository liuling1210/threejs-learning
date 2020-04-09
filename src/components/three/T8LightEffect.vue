<template>
  <div ref="canvas-frame" id="canvas-frame"></div>
</template>

<script>
import * as THREE from "three";
import * as TrackballControls from "../export/TrackballControls";
// import * as Stats from "../export/Stats";

export default {
  name: "T8LightEffect",
  data() {
    return {
      renderer: null,
      width: null,
      height: null,
      camera: null,
      scene: null,
      light: null,
      canvasFrame: null,
      stats: null,
      controls: null
    };
  },
  methods: {
    // 渲染器
    initRender() {
      this.canvasFrame = document.getElementById("canvas-frame");
      console.log("112233");
      this.width = this.canvasFrame.clientWidth;
      this.height = this.canvasFrame.clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      // 设置canvas尺寸
      this.renderer.setSize(this.width, this.height);
      // // 设置背景
      // this.renderer.setClearColor(0xffffff, 1.0);
      // 阴影类型有四种，BasicShadowMap，PCFShadowMap，PCFSoftShadowMap，VSMShadowMap
      // BasicShadowMap 提供未经过滤的阴影贴图，速度较快，但质量较低
      // PCFShadowMap 使用百分比，更接近过滤（PCF）算法的过滤阴影贴图（默认）
      // PCFSoftShadowMap 使用具有更好的柔和阴影的百分比-更近距离过滤（PCF），推荐在使用低分辨率阴影贴图时使用
      // VSMShadowMap 使用方差阴影贴图（VSM），使用时，阴影接收器也会投射阴影
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // 添加到dom
      document
        .getElementById("canvas-frame")
        .appendChild(this.renderer.domElement);
    },

    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.width / this.height,
        1,
        1000
      );
      this.camera.position.set(0, 40, 100);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },

    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      console.log("scene", this.scene);
    },

    // 光源
    initLight() {
      // 添加环境光
      this.scene.add(new THREE.AmbientLight(0x444444));

      // 添加平衡光
      this.light = new THREE.SpotLight(0xffffff); // 聚光灯，沿着圆锥体从一个点沿一个方向发射，该圆锥体的尺寸和它接收到的光越远，其尺寸就越大。
      this.light.position.set(60, 30, 0);

      this.light.castShadow = true;

      // 添加进场景
      this.scene.add(this.light);
    },

    // 模型
    initModel() {
      // 球体
      console.log("模型");
      const that = this;
      var sphereGeometry = new THREE.SphereGeometry(5, 20, 20);
      var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.y = 5;

      //告诉球需要投射阴影
      sphere.castShadow = true;

      that.scene.add(sphere);

      // 辅助工具
      var helper = new THREE.AxisHelper(10);
      that.scene.add(helper);

      // 立方体
      var cubeGeometry = new THREE.CubeGeometry(10, 10, 8);
      var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });

      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = 25;
      cube.position.y = 5;
      cube.position.z = -5;

      //告诉立方体需要投射阴影
      cube.castShadow = true;

      that.scene.add(cube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -0;

      //告诉底部平面需要接收阴影
      plane.receiveShadow = true;

      that.scene.add(plane);
    },

    // // 初始化性能插件
    // initStats() {
    //   console.log('initStats');
    //   this.stats = new Stats();
    //   document.body.appendChild(this.stats.dom);
    // },

    initControls() {
      console.log("TrackballControls", TrackballControls);
      this.controls = new THREE.TrackballControls(this.camera);
      //旋转速度
      this.controls.rotateSpeed = 5;
      //变焦速度
      this.controls.zoomSpeed = 3;
      //平移速度
      this.controls.panSpeed = 0.8;
      //是否不变焦
      this.controls.noZoom = false;
      //是否不平移
      this.controls.noPan = false;
      //是否开启移动惯性
      this.controls.staticMoving = false;
      //动态阻尼系数 就是灵敏度
      this.controls.dynamicDampingFactor = 0.3;
      //未知，占时先保留
      //this.controls.keys = [ 65, 83, 68 ];
      this.controls.addEventListener("change", this.render);
    },

    render() {
      this.renderer.render(this.scene, this.camera);
    },

    // 窗口变动触发的函数
    onWindowResize() {
      var frame = this.canvasFrame;
      this.camera.aspect = frame.innerWidth / frame.innerHeight;
      this.camera.updateProjectionMatrix();
      this.controls.handleResize();
      this.render();
      this.renderer.setSize(frame.innerWidth, frame.innerHeight);
    },
    animate() {
      this.render();
      // 更新控制器
      this.controls.update();

      // // 更新性能插件
      // this.stats.update();
      requestAnimationFrame(this.animate);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initModel();
      this.initControls();
      // this.initStats();
      this.animate();
      // this.canvasFrame.onresize = this.onWindowResize();
      //   this.canvasFrame.addEventListener("resize", this.onWindowResize(), false);
    });
  }
};
</script>

<style scoped>
#canvas-frame {
  border: none;
  cursor: pointer;
  width: 1125px;
  height: 600px;
  background-color: #eeeeee;
}
</style>




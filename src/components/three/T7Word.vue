<template>
  <div ref="canvas-frame" id="canvas-frame"></div>
</template>

<script>
import * as THREE from "three";
import * as Stats from "../export/Stats";
import * as OrbitControls from "../export/OrbitControls";
// import * as THREE from "./geometry.jpg";

export default {
  name: "T7Word",
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
      console.log('112233');
      this.width = this.canvasFrame.clientWidth;
      this.height = this.canvasFrame.clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });   
      // 设置canvas尺寸
      this.renderer.setSize(this.width, this.height);
      // 设置背景
      this.renderer.setClearColor(0xffffff, 1.0);
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
        2000
      );
      this.camera.position.set(0, 0, 400);
    },

    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      console.log('scene', this.scene);
    },

    // 光源
    initLight() {
      // 添加环境光
      this.scene.add(new THREE.AmbientLight(0x404040));

      // 添加平衡光
      this.light = new THREE.DirectionalLight(0xffffff);
      this.light.position.set(1, 1, 1);

      // 添加进场景
      this.scene.add(this.light);
    },

    // 模型
    initModel() {
      console.log('scene?' , this.scene);
      const that = this;
      var font;
      var loader = new THREE.FontLoader();
      loader.load("/json/word.json", function(res) {
        font = new THREE.TextBufferGeometry('Hello three.js!', {
          font: res,
          size: 100,
          height: 60
        });

        font.center();
        var map = new THREE.TextureLoader().load("/img/geometry.jpg");
        var material = new THREE.MeshLambertMaterial({
          map: map,
          side: THREE.DoubleSide
        });

        var fontModel = new THREE.Mesh(font, material);
        that.scene.add(fontModel);
      })
    },

    // // 初始化性能插件
    // initStats() {
    //   console.log('initStats');
    //   this.stats = new Stats();
    //   document.body.appendChild(this.stats.dom);
    // },

    // 用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
    initControls() {
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );

      // 如果使用animate方法时，将此函数删除
      //controls.addEventListener( 'change', render );
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      this.controls.enableDamping = true;
      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      //this.controls.dampingFactor = 0.25;
      //是否可以缩放
      this.controls.enableZoom = true;
      //是否自动旋转
      this.controls.autoRotate = false;
      //设置相机距离原点的最远距离
      this.controls.minDistance = 200;
      //设置相机距离原点的最远距离
      this.controls.maxDistance = 600;
      //是否开启右键拖拽
      this.controls.enablePan = true;
    },

    render() {
      this.renderer.render(this.scene, this.camera);
    },

    // 窗口变动触发的函数
    onWindowResize() {
      var frame = this.canvasFrame;
      this.camera.aspect = frame.innerWidth / frame.innerHeight;
      this.camera.updateProjectionMatrix();
      this.render();
      this.renderer.setSize(frame.innerWidth, frame.innerHeight);
    },
    animate() {
      // 更新控制器
      this.controls.update();
      this.render();

      // 更新性能插件
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




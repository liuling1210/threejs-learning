<template>
  <div ref="canvas-frame" id="canvas-frame"></div>
</template>

<script>
import * as THREE from "three";
// import * as THREE from "./geometry.jpg";

export default {
  name: "T6Geometry",
  data() {
    return {
      renderer: null,
      width: null,
      height: null,
      camera: null,
      scene: null,
      light: null,
      canvasFrame: null
    };
  },
  methods: {
    // 渲染器
    initRender() {
      this.canvasFrame = document.getElementById("canvas-frame");
      this.width = this.canvasFrame.clientWidth;
      this.height = this.canvasFrame.clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      // 设置canvas尺寸
      this.renderer.setSize(this.width, this.height);
      // 设置背景
      this.renderer.setClearColor(0xffffff, 1.0);
      // 设置设备像素比
      this.renderer.setPixelRatio(this.canvasFrame.devicePixelRatio);
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
      this.camera.position.y = 400;
    },

    // 场景
    initScene() {
      this.scene = new THREE.Scene();
    },

    // 光源
    initLight() {
      // 添加环境光
      this.scene.add(new THREE.AmbientLight(0x404040));

      // 添加平衡光
      this.light = new THREE.DirectionalLight(0xffffff);
      this.light.position.set(0, 1, 0);

      // 添加进场景
      this.scene.add(this.light);
    },

    // 模型
    initModel() {
      // 通过加载图片生成纹理
      var map = new THREE.TextureLoader().load('http://172.16.126.50:8082/geometry.jpg');
      // 定义纹理在水平和垂直方向简单的重复到无限大
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      // 定义纹理的各向异性
      map.anisotropy = 16;

      // 定义MeshLambert网孔材质
      var material = new THREE.MeshLambertMaterial({
        map: map,
        side: THREE.DoubleSide
      });

      // 球形网格（半径长度，水平块的密度，垂直块密度）
      var object1 = new THREE.Mesh(
        new THREE.SphereGeometry(75, 20, 10),
        material
      );
      object1.position.set(-400, 0, 200);
      this.scene.add(object1);

      //二十面体 （图形大小半径，大于零将不是二十面体，越大越圆滑）
      var object2 = new THREE.Mesh(new THREE.IcosahedronGeometry(75, 0), material);
      object2.position.set(-200, 0, 200);
      this.scene.add(object2);

      //八面体（图形大小半径，大于零将不是八面体，越大越圆滑）
      var object3 = new THREE.Mesh(new THREE.OctahedronGeometry(75, 0), material);
      object3.position.set(0, 0, 200);
      this.scene.add(object3);

      //四面体（图形大小半径，大于零将不是四面体，越大越圆滑）
      var object4 = new THREE.Mesh(new THREE.TetrahedronGeometry(75, 0), material);
      object4.position.set(200, 0, 200);
      this.scene.add(object4);

      //长方形平面 （x轴宽度，y轴高度，x方向分段数，y方向分段数）
      var object5 = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 1, 1),
        material
      );
      object5.position.set(-400, 0, 0);
      this.scene.add(object5);

      //立方体 （x轴宽度，y轴高度，z轴深度，沿宽面分段数，沿高度面分段数，沿深度面分段数）
      var object6 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100, 1, 1, 1),
        material
      );
      object6.position.set(-200, 0, 0);
      this.scene.add(object6);

      //圆形平面 （半径，顶点密度，绘制起点弧度，绘制弧度）
      var object7 = new THREE.Mesh(
        new THREE.CircleGeometry(50, 20, 0, Math.PI * 2),
        material
      );
      object7.position.set(0, 0, 0);
      this.scene.add(object7);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
      //stats.update();
    },
    render() {
      var timer = Date.now() * 0.0001;

      this.camera.position.x = Math.cos(timer) * 800;
      this.camera.position.z = Math.sin(timer) * 800;

      this.camera.lookAt(this.scene.position);

      for (var i = 0, l = this.scene.children.length; i < l; i++) {
        var object = this.scene.children[i];

        object.rotation.x = timer * 5;
        object.rotation.y = timer * 2.5;
      }

      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initRender();
      this.initCamera();
      this.initScene();
      this.initLight();
      this.initModel();
      this.animate();

      window.addEventListener("resize", this.onWindowResize(), false);
    });
  }
};
</script>

<style scoped>
#canvas-frame {
  border: none;
  cursor: pointer;
  width: 100%;
  height: 600px;
  background-color: #eeeeee;
}
</style>




<template>
  <div ref="canvas-frame" id="canvas-frame"></div>
</template>

<script>
import * as THREE from "three";

export default {
  name: "T4Light",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      geometry: null,
      material: null,
      mesh: null,
      mainLight: null,
      helper: null,
      stlloader: null,
      width: null,
      height: null
    };
  },
  methods: {
    initThree() {
      this.width = document.getElementById("canvas-frame").clientWidth;
      this.height = document.getElementById("canvas-frame").clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(this.width, this.height);
      document
        .getElementById("canvas-frame")
        .appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 1.0);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.width / this.height,
        1,
        10000
      );
      this.camera.position.x = 600;
      this.camera.position.y = 0;
      this.camera.position.z = 600;
      this.camera.up.x = 0;
      this.camera.up.y = 1;
      this.camera.up.z = 0;
      this.camera.lookAt(0, 0, 0);
    },
    initScene() {
      this.scene = new THREE.Scene();
    },
    initLight() {
      //   // 第二个参数是光源强度
      //   this.light = new THREE.DirectionalLight(0xff0000, 0.9);
      //   // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
      //   this.light.position.set(1,0,0,5);
      //   this.scene.add(this.light);

      //   // 环境光
      //   this.light = new THREE.AmbientLight(0x00ff00);
      //   this.light.position.set(100, 100, 200);
      //   this.scene.add(this.light);

      //   // 方向光
      //   this.light = new THREE.DirectionalLight(0xff0000);
      //   this.light.position.set(0, 0, 1);
      //   this.scene.add(this.light);

      // 点光源
      this.light = new THREE.PointLight(0xff0000);
      this.light.position.set(0, 0, 50);
      this.scene.add(this.light);
    },
    initObject() {
      var geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);
      var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      this.scene.add(mesh);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initThree();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initObject();
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
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




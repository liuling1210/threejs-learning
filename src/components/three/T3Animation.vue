<template>
  <div ref="canvas-frame" id="canvas-frame"></div>
</template>

<script>
import * as THREE from "three";

export default {
  name: "T3Animation",
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
      stlloader: null
    };
  },
  methods: {
    initThree() {
      var width = document.getElementById("canvas-frame").clientWidth;
      var height = document.getElementById("canvas-frame").clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(width, height);
      document.getElementById("canvas-frame").appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 1.0);

      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 600;
      this.camera.up.x = 0;
      this.camera.up.y = 1;
      this.camera.up.z = 0;
      this.camera.lookAt(0, 0, 0);
      this.scene = new THREE.Scene();

      var light;

      light = new THREE.AmbientLight(0xff0000);
      light.position.set(100, 100, 200);
      this.scene.add(light);
      light = new THREE.PointLight(0x00ff00);
      light.position.set(0, 0, 300);
      this.scene.add(light);
      (this.mesh = new THREE.Mesh()),
        (this.geometry = new THREE.CylinderGeometry(100, 150, 400));
      var material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
      this.mesh.geometry = this.geometry;
      this.mesh.material = material;
      this.mesh.position = new THREE.Vector3(0, 0, 0);
      this.scene.add(this.mesh);
    },
    animation() {
      // 相机向右移动，物体固定，视觉上物体向左移动
      // this.camera.position.x = this.camera.position.x + 1;
      // 相机固定，物体左移
      this.mesh.position.x-=1;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animation);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initThree();
      this.animation();
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




<template>
  <div ref="container" id="container"></div>
</template>

<script>
import * as THREE from "three";
// import { VertexColors } from "three";
// import {STLLoader}  from 'three/examples/jsm/loaders/STLLoader'
export default {
  name: "T2HelloWorld",
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
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      var renderer = new THREE.WebGLRenderer();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff, 1);
      this.$refs.container.appendChild(renderer.domElement);
      camera.position.z = 1;
      document.body.appendChild(renderer.domElement);
      var geometry = new THREE.CubeGeometry(1, 1, 1);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      camera.position.z = 5;
      function render() {
        requestAnimationFrame(render);
        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;
        renderer.render(scene, camera);
      }
      render();
    },
    init() {
      // console.log("333");
      // this.scene = new THREE.Scene();
      // this.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
      // this.light.position.set(100, 100, 200);
      // this.scene.add(this.light);
      // // var cube;
      // this.geometry = new THREE.Geometry();
      // this.geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
      // this.geometry.vertices.push(new THREE.Vector3(500, 0, 0));
      // for (var i = 0; i <= 20; i++) {
      //   var line = new THREE.Line(
      //     this.geometry,
      //     new THREE.LineBasicMaterial({ color: 0xFFFF00, opacity: 0.2 })
      //   );
      //   line.position.z = i * 50 - 500;
      //   this.scene.add(line);
      //   var line1 = new THREE.Line(
      //     this.geometry,
      //     new THREE.LineBasicMaterial({ color: 0xFFFF00, opacity: 0.2 })
      //   );
      //   line1.position.x = i * 50 - 500;
      //   line1.rotation.y = (90 * Math.PI) / 180;
      //   this.scene.add(line1);
      // }
    }
  },
  mounted() {
    console.log("222");
    this.$nextTick(() => {
      this.initThree();
      this.init();
      // this.initObject();
      //   this.addObject();
      //   this.update();
    });
  }
};
</script>

<style scoped>
#container {
  margin: 0;
  background-color: #eeeeee;
}
</style>




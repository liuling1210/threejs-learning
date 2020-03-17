<template>
  <div ref="canvas-frame" id="canvas-frame"></div>
</template>

<script>
import * as THREE from "three";

export default {
  name: "T5Grid",
  data() {
    return {
      params: null,
      renderer: null,
      width: null,
      height: null,
      camera: null,
      scene: null,
      light: null
    };
  },
  methods: {
    // 渲染器
    initRender() {
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

    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.width / this.height,
        1,
        1000
      );
      this.camera.position.x = 0;
      this.camera.position.y = 900;
      this.camera.position.z = 0;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },

    // 场景
    initScene() {
      this.scene = new THREE.Scene();
    },

    // 光源
    initLight() {
      this.light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
      this.light.position.set(100, 100, 200);
      this.scene.add(this.light); // 添加光源进场景
    },

    // 模型
    initModel() {
      // 每一个轴的长度
      var object = new THREE.AxesHelper(500);
      this.scene.add(object);

      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
      geometry.vertices.push(new THREE.Vector3(500, 0, 0));

      for (var i = 0; i <= 20; i++) {
        var line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: this.randomColor(), opacity: 1 })
        );
        line.position.z = i * 50 - 500;
        this.scene.add(line);

        var line1 = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: this.randomColor(), opacity: 1 })
        );
        line1.position.x = i * 50 - 500;
        line1.rotation.y = (90 * Math.PI) / 180;
        this.scene.add(line1);
      }
      console.log("this.scene", this.scene);
    },

    // 生成随机颜色
    randomColor() {
      var arrHex = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f"
        ],
        strHex = "0x",
        index;
      for (var i = 0; i < 6; i++) {
        index = Math.round(Math.random() * 15);
        strHex += arrHex[index];
      }
      return eval(strHex);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initRender();
      this.initCamera();
      this.initScene();
      this.initLight();
      this.initModel();
      this.renderer.render(this.scene, this.camera);
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




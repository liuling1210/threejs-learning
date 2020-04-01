<template>
  <div ref="canvas-frame" id="canvas-frame"></div>
</template>

<script>
import * as THREE from "three";

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
      console.log(this.width, this.height);
      this.renderer = new THREE.WebGLRenderer({
        // 是否执行抗锯齿
        antialias: true
      });
      // 设置canvas尺寸
      // console.log(this.width, this.height)
      this.renderer.setSize(1000, this.height);
      // 设置背景
      this.renderer.setClearColor(0xffffff, 1.0);
      // 设置设备像素比
      this.renderer.setPixelRatio(this.canvasFrame.devicePixelRatio);
      // 添加到dom

      document
        .getElementById("canvas-frame")
        .appendChild(this.renderer.domElement);
      // setTimeout(() => {
      //   document
      //     .getElementById("canvas-frame")
      //     .appendChild(this.renderer.domElement);
      // }, 5000);
      // this.renderer.setSize(this.width, this.height);
      // document.getElementsByTagName('canvas')[0].width = this.width;
      // document.getElementsByTagName('canvas')[0].height = this.height;
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
      // var map = new THREE.TextureLoader().load('http://172.16.126.50:8082/geometry.jpg');
      var map = new THREE.TextureLoader().load("/img/geometry.jpg");
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
      var object2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(75, 0),
        material
      );
      object2.position.set(-200, 0, 200);
      this.scene.add(object2);

      //八面体（图形大小半径，大于零将不是八面体，越大越圆滑）
      var object3 = new THREE.Mesh(
        new THREE.OctahedronGeometry(75, 0),
        material
      );
      object3.position.set(0, 0, 200);
      this.scene.add(object3);

      //四面体（图形大小半径，大于零将不是四面体，越大越圆滑）
      var object4 = new THREE.Mesh(
        new THREE.TetrahedronGeometry(75, 0),
        material
      );
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

      //空心圆平面（内圆半径，外圆半径，分割面越大越圆滑，垂直外边分割面，开始绘制弧度，绘制弧度）
      var object8 = new THREE.Mesh(
        new THREE.RingGeometry(10, 50, 10, 5, 0, Math.PI * 2),
        material
      );
      object8.position.set(200, 0, 0);
      this.scene.add(object8);

      // 圆柱体（头部圆的半径，底部圆的半径，高度，上下圆顶点个数，上下面切割线条数，上下面切割条数，上下面是否显示，开始弧度，绘制弧度）
      var object9 = new THREE.Mesh(
        new THREE.CylinderGeometry(25, 75, 100, 40, 5),
        material
      );
      object9.position.set(400, 0, 0);
      this.scene.add(object9);

      // 车床模型
      var points = [];
      for (var i = 0; i < 50; i++) {
        points.push(
          new THREE.Vector2(
            Math.sin(i * 0.2) * Math.sin(i * 0.1) * 15 + 50,
            (i - 5) * 2
          )
        );
      }

      // (一个vector2的数组分别代表xy轴，生成圆周段的数目，开始弧度，绘制弧度)
      var object10 = new THREE.Mesh(
        new THREE.LatheGeometry(points, 20),
        material
      );
      object10.position.set(-400, 0, -200);
      this.scene.add(object10);

      // 救生圈 (救生圈半径，管道半径，基于管道横切顶数点，救生圈横切顶点个数)
      var object11 = new THREE.Mesh(
        new THREE.TorusGeometry(50, 20, 20, 20),
        material
      );
      object11.position.set(-200, 0, -200);
      this.scene.add(object11);

      // 环面纽结模型（图形半径，管道半径，基于管道横切定点数，根据图形半径横切定点数，绕旋转对称轴的圈数，环绕面的圆的圈数）
      var object12 = new THREE.Mesh(
        new THREE.TorusKnotGeometry(50, 10, 50, 20),
        material
      );
      object12.position.set(0, 0, -200);
      this.scene.add(object12);

      // 轴辅助（每一个轴的长度）
      var object13 = new THREE.AxesHelper(50);
      object13.position.set(200, 0, -200);
      this.scene.add(object13);

      // 箭头辅助（箭头头部的方向必须是vecteor3, 箭头起点必须是vector3 , 箭头长度，箭头颜色）
      var object14 = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        50,
        0x00ffff
      );
      object14.position.set(400, 0, -200);
      this.scene.add(object14);
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

      this.canvasFrame.addEventListener("resize", this.onWindowResize(), false);
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




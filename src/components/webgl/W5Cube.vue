<template>
    <div id = 'app'>
        <canvas ref= 'canvas' id ='canvs' width="640" height="480"></canvas>
        <el-tooltip :content="isRender" placement="top">
            <el-switch v-model="isRender"  @change="exitRender" inactive-value="渲染" active-value="停止"></el-switch>
        </el-tooltip>
    </div>
</template>

<script>
    import {mat4} from 'gl-matrix'
    export default {
        name: 'W5Cube',
        data(){
            return{
                mes:'三角形',
                vsource:'attribute vec3 aVertexPosition;' +  // 0 写着色器源码
                    'attribute vec4 aVertexColor;'+
                    'uniform mat4 uModelViewMatrix;' +
                    'uniform mat4 uProjectionMatrix;' +
                    'varying lowp vec4 vColor;'+
                    'void main(void) {' +
                    'gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);' + // 将顶点位置与顶点颜色一一对应
                    'vColor = aVertexColor;'+
                    '}' ,
                fsource:'varying lowp vec4 vColor;' +
                    'void main (void) {' +
                    'gl_FragColor = vColor;' +  // 颜色数据
                    '}',
                gl: null,
                shaderProgram: null,
                programInfo: null,
                buffers: null,
                lastTime: 0,
                curRequestAnimationFrame:null,
                isRender:'停止',
                lastRotaion:0.0,
            }
        },
        mounted(){
            this.gl = this.$refs.canvas.getContext('webgl') // -1 获取canvas 元素，并且拿到webgl上下文 A: 获取canvas，便于三维显示
            if(!this.gl){
                alert('canvas 获取webgl上下文失败')
                return
            }
            this.shaderProgram = this.createShaderProgram(this.gl,this.vsource,this.fsource)  // B: 创建shader程序
            // 获取顶点着色器中的输入数据
            this.programInfo = {
                program:this.shaderProgram,
                attribLocations:{
                    vertexPosition: this.gl.getAttribLocation(this.shaderProgram,'aVertexPosition'),
                    vertexColor: this.gl.getAttribLocation(this.shaderProgram,'aVertexColor')
                },
                uniformLocations:{
                    projectionMatrix: this.gl.getUniformLocation(this.shaderProgram,'uProjectionMatrix'),
                    modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram,'uModelViewMatrix'),
                }
            }
            this.buffers = this.initBuffers(this.gl)                        // C: 创建 缓冲区 ，将顶点数据输入到缓冲区
            // this.drawScene(this.gl,this.programInfo,this.buffers)         //D: 从缓冲区拿数据，绘制场景(只是绘制了一次)
            this.render()
        },
        methods:{
            render(now){ //now  requestAnimation的回调时间  秒数
                let deltaTime ;
                now *= 0.001;
                deltaTime = now - this.lastTime;
                this.lastTime = now;
                this.drawScene(this.gl,this.programInfo,this.buffers,deltaTime)
                this.curRequestAnimationFrame = requestAnimationFrame(this.render)
            },
            exitRender(bol){
                if(bol === '渲染') {
                    window.cancelAnimationFrame(this.curRequestAnimationFrame);
                    return
                }
                this.render();

            },
            /**
             * 创建shader程序
             * @param gl
             * @param vsource
             * @param fsource
             * @return {shaderProgram}
             */
            createShaderProgram (gl, vsource, fsource){
                const vertextShader = this.loadShader(gl,gl.VERTEX_SHADER, vsource)
                const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER , fsource)

                const shaderProgram = gl.createProgram()
                gl.attachShader(shaderProgram, vertextShader)
                gl.attachShader(shaderProgram, fragmentShader)
                gl.linkProgram(shaderProgram)
                if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
                    alert('shaderProgram 程序链接失败:' + gl.getProgramInfoLog(shaderProgram))
                    return null
                }
                return shaderProgram
            },
            /**
             * 创建 加载 shader
             * @param gl
             * @param type
             * @param source
             * @return {shader}
             */
            loadShader(gl, type, source) {
                const shader = gl.createShader(type) // 1. gl.createShader().创建一个新的着色器。创建什么类型的shader
                gl.shaderSource(shader, source)     // 2. 将源代码发送到着色器 装载hlsl源程序
                gl.compileShader(shader)   // 3. 一旦着色器获取到源代码，就使用gl.compileShader().进行编译
                if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
                    alert('编译 shader 源码出错：' + gl.getShaderInfoLog(shader))
                    gl.deleteShader(shader)
                    return null
                }
                return shader
            },
            initBuffers(gl){
                // 从js传入的用户自定义数据
                // 顶点位置
                let  positions = [ // 四行，代表四个点位置坐标 顶点位置数据
                    // Front face
                    -1.0, -1.0,  1.0,
                    1.0, -1.0,  1.0,
                    1.0,  1.0,  1.0,
                    -1.0,  1.0,  1.0,

                    // Back face
                    -1.0, -1.0, -1.0,
                    -1.0,  1.0, -1.0,
                    1.0,  1.0, -1.0,
                    1.0, -1.0, -1.0,

                    // Top face
                    -1.0,  1.0, -1.0,
                    -1.0,  1.0,  1.0,
                    1.0,  1.0,  1.0,
                    1.0,  1.0, -1.0,

                    // Bottom face
                    -1.0, -1.0, -1.0,
                    1.0, -1.0, -1.0,
                    1.0, -1.0,  1.0,
                    -1.0, -1.0,  1.0,

                    // Right face
                    1.0, -1.0, -1.0,
                    1.0,  1.0, -1.0,
                    1.0,  1.0,  1.0,
                    1.0, -1.0,  1.0,

                    // Left face
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0,  1.0,
                    -1.0,  1.0,  1.0,
                    -1.0,  1.0, -1.0

                ];
                // 顶点颜色
                const colors = [
                    [1.0,  1.0,  1.0,  1.0],    // Front face: white
                    [1.0,  0.0,  0.0,  1.0],    // Back face: red
                    [0.0,  1.0,  0.0,  1.0],    // Top face: green
                    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
                    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
                    [1.0,  0.0,  1.0,  1.0]     // Left face: purple
                ];
                let generatedColors = [];
                for (let i = 0; i < colors.length; i++) {
                    let c = colors[i];
                    for (let j = 0; j < 4; j++) { // 为什么是4不太懂，随意换个数字，有不同效果
                        generatedColors =generatedColors.concat(c)
                    }

                }
                // 顶点索引
                let cubeVertexIndices = [
                    0,  1,  2,      0,  2,  3,    // front
                    4,  5,  6,      4,  6,  7,    // back
                    8,  9,  10,     8,  10, 11,   // top
                    12, 13, 14,     12, 14, 15,   // bottom
                    16, 17, 18,     16, 18, 19,   // right
                    20, 21, 22,     20, 22, 23    // left
                ];



                // 顶点位置
                let positionBuffer = gl.createBuffer()
                {
                    // 创建对应的数据缓冲区
                    // 绑定数据到对应的缓冲区
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
                    // 向数据缓冲区输入数据
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW)

                }

                // 顶点颜色
                let cubeVerticesColorBuffer = gl.createBuffer();
                {
                    gl.bindBuffer(gl.ARRAY_BUFFER,cubeVerticesColorBuffer)
                    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(generatedColors),gl.STATIC_DRAW)
                }

                // 顶点索引(三角形)
                let cubeVerticesIndexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeVerticesIndexBuffer)
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVertexIndices),gl.STATIC_DRAW)
                return {
                    position: positionBuffer,
                    color:cubeVerticesColorBuffer,
                    indices:cubeVerticesIndexBuffer
                };
            },
            drawScene(gl, programInfo, buffers,deltime){
                gl.clearColor(0.5,0.5,0.5,0.7) // 黑色清除色 无透明度
                gl.clearDepth(1.0)
                gl.enable(gl.DEPTH_TEST)  // 深度测试
                gl.depthFunc(gl.LEQUAL)

                // 清除canvas 上的缓冲数据
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

                // 创建相机的投影矩阵，控制相机的渲染效果
                const fieldOfView = 45 * Math.PI/180
                const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
                const zNear = 0.1
                const zFar = 100.0
                const projectionMatrix = mat4.create()  // 4*4 单位矩阵
                mat4.perspective(projectionMatrix,fieldOfView,aspect, zNear, zFar)  //透视相机

                // 创建模型矩阵
                const modelViewMatrix = mat4.create()  // 4*4 单位矩阵

                // 移动位置
                mat4.translate(modelViewMatrix,modelViewMatrix,[-0.0,0.0,-6.0])
                // 旋转
                mat4.rotate(modelViewMatrix,modelViewMatrix,this.lastRotaion,[1,1,1])


                //绘制顶点位置
                {
                    const numComponents = 3;  // pull out 2 values per iteration
                    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
                    const normalize = false;  // don't normalize
                    const stride = 0;         // how many bytes to get from one set of values to the next
                    const offset = 0;         // how many bytes inside the buffer to start from
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
                    gl.vertexAttribPointer(
                        programInfo.attribLocations.vertexPosition,
                        numComponents,
                        type,
                        normalize,
                        stride,
                        offset);
                    gl.enableVertexAttribArray(
                        programInfo.attribLocations.vertexPosition);
                }

                //绘制顶点颜色
                {
                    const numComponents = 4;
                    const type = gl.FLOAT;
                    const normalize = false;
                    const stride = 0;
                    const offset  =0;
                    gl.bindBuffer(gl.ARRAY_BUFFER,buffers.color);
                    gl.vertexAttribPointer(
                        programInfo.attribLocations.vertexColor,
                        numComponents,
                        type,
                        normalize,
                        stride,
                        offset
                    );
                    gl.enableVertexAttribArray(
                        programInfo.attribLocations.vertexColor);
                }

                gl.useProgram(programInfo.program)
                gl.uniformMatrix4fv(
                    programInfo.uniformLocations.projectionMatrix,
                    false,
                    projectionMatrix
                )
                gl.uniformMatrix4fv(
                    programInfo.uniformLocations.modelViewMatrix,
                    false,
                    modelViewMatrix)

                {// 取数组的方式，决定图元类型
                    const type = gl.UNSIGNED_SHORT;
                    const offset = 0;
                    const vertexCount = 36;       // 顶点个数 ，决定片段着色器的调用次数，一个顶点调用一次片段着色器
                    gl.drawElements(gl.TRIANGLES,vertexCount,type, offset, );
                }
                // 下一帧 更新旋转参数
                if(deltime) this.lastRotaion += deltime;

            },
        }
    }
</script>

<style scoped>

</style>

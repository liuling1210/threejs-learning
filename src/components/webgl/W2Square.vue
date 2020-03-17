<template>
    <div id = 'app'>
        <canvas ref= 'canvas' id ='canvs' width="640" height="480"></canvas>
    </div>
</template>

<script>
    import {mat4} from 'gl-matrix'
    export default {
        name: 'W2Square',
        data(){
            return{
                mes:'正方形',
                vsource:'attribute vec4 aVertexPosition;' +  // 0 写着色器源码
                    'uniform mat4 uModelViewMatrix;' +
                    'uniform mat4 uProjectionMatrix;' +
                    'void main() {' +
                    'gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;' +
                    '}' ,
                fsource:'void main () {' +
                    'gl_FragColor = vec4(1.0, 0.0, 1.0 ,1.0);' +  // 颜色数据
                    '}',
                gl: null,
                shaderProgram: null,
                programInfo: null,
                buffers: null,
            }
        },
        mounted(){
            window.gl = this.gl = this.$refs.canvas.getContext('webgl') // -1 获取canvas 元素，并且拿到webgl上下文 A: 获取canvas，便于三维显示
            if(!this.gl){
                alert('canvas 获取webgl上下文失败')
                return
            }
            this.shaderProgram = this.createShaderProgram(this.gl,this.vsource,this.fsource)  // B: 创建shader程序
            // 获取顶点着色器的输入数据
            this.programInfo = {
                program:this.shaderProgram,
                attribLocations:{
                    vertexPosition: this.gl.getAttribLocation(this.shaderProgram,'aVertexPosition'),
                },
                uniformLocations:{
                    projectionMatrix: this.gl.getUniformLocation(this.shaderProgram,'uProjectionMatrix'),
                    modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram,'uModelViewMatrix'),
                }
            }
            this.buffers = this.initBuffers(this.gl)                        // C: 创建 缓冲区 ，将顶点数据输入到缓冲区
            this.drawScene(this.gl,this.programInfo,this.buffers)         //D: 从缓冲区拿数据，绘制场景
        },
        methods:{
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
                // 绘制场景本质 gl 的成员函数 createBuffer() 得到了缓冲对象并存储在顶点缓冲器。然后调用 bindBuffer() 函数绑定上下文。
                let squareVerticesBuffer = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)

                let  vertices = [ // 四行，代表四个点位置坐标 顶点位置数据
                    1.0,  1.0,
                    -1.0, 1.0,
                    1.0,  -1.0,
                ]
                // 重点是weblgl 是浮点型数据
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW) //  WebGL 浮点型类型的数组，并将其传到 gl 对象的  bufferData() 方法来建立对象的顶点。
                return {
                    position: squareVerticesBuffer,
                };
            },
            drawScene(gl, programInfo, buffers){
                gl.clearColor(0.0,0.0,0.0,1.0) // 黑色清除色 无透明度
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

                {
                    const numComponents = 2;  // pull out 2 values per iteration
                    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
                    const normalize = false;  // don't normalize
                    const stride = 0;         // how many bytes to get from one set of values to the next
                                              // 0 = use type and numComponents above
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
                    const offset = 0;
                    const vertexCount = 3;
                    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
                }



            },
        }
    }
</script>

<style scoped>

    canvas{
        border: 2px dashed purple;}
</style>

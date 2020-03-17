<template>
    <div >
        <canvas id="container" width="600px" height="600px" style="border: 2px dashed darkred;"> 你的浏览器不支持canvas</canvas>
    </div>
</template>

<script>
    export default {
        name: 'W1HelloWorld',
        methods:{

        },
        data(){
            return {
            }
        },
        created(){
        },
        mounted(){
            const canvas = document.querySelector('#container')
            const gl = canvas.getContext('webgl') // 调用一个getContext 的函数并传递给它一个"webgl"字符串来获取WebGLRenderingContext
            if(!gl){
                alert('拿不到wegbl上下文')
                return
            }
            gl.clearColor(0,255,255,1.0)
            gl.clear(gl.COLOR_BUFFER_BIT)
        },
    }
</script>

<style scoped>

</style>

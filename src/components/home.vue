<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
    export default {
        name: "home",
        methods:{
            logout(){
            //  清空token
                window.sessionStorage.clear();
            //  跳到login页面
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped>

</style>
<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>恒利德内部管理系统</div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!--左侧导航栏-->
            <!--折叠时宽度减少到64px-->
            <el-aside :width="isCollapse ? '64px':'200px'"  >
                <!--增加折叠功能-->
                <div class="toggle-button" @click="toggleMenu">|||</div>
                <!--侧边栏菜单区，unique-opened表示只能展开一个item，其他的都叠起来-->
                <!--collapse-transition设置成false，关闭动画，要不太丑-->
                <!--自带router属性，true就可以根据index跳转了，所以把index改一下-->
                <!--不用原来的id了，改成path方式‘/home’这种-->
                <!--使用:default-active="activePath"保证点击的菜单高亮-->
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"  unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        :default-active="activePath">
                    <!--一级菜单-->
                    <!--利用v-for将menulist的数据进行循环渲染-->
                    <!--index不能一样，否则一起动作，所以用item.id动态绑定-->
                    <!--但是index不能是数字，所以要加空格形成字符串-->
                    <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                        <!--一级菜单模板区-->
                        <template slot="title">
                            <!--图标-->
                            <i class="el-icon-location"></i>
                            <!--文本,item里的authName属性是名称-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <!--二级菜单先获取item，从item里循环即可-->
                        <!--结合路由，index必须和路径path一致，才能跳转-->
                        <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children"
                          :key="subitem.id" @click="activeStatus('/'+subitem.path)">
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-menu"></i>
                                <!--文本,item里的authName属性是名称-->
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右侧主体内容区域-->
            <el-main>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>

            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "home",
        data(){
            return{
                //这个array存放从后台传来的左侧导航栏数据
                menulist:[],
                //开始侧边栏不折叠
                isCollapse:false,
                //activePath保存着任意时刻哪个菜单处于激活
                activePath:''
            }
        },
        //增加created阶段回调，保证一加载就获取左侧导航栏数据
        created() {
            this.getMenuList()
        },
        methods: {
            logout() {
                //  清空token
                window.sessionStorage.clear();
                //  跳到login页面
                this.$router.push('/login')
            },
            //    增加获取左侧导航栏数据的方法
            async getMenuList() {
                //ES6解构赋值方法，将获取数据包中的data赋值给res
                const { data: res} = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menulist= res.data
            },
            //侧边栏收回方法
            toggleMenu(){
                this.isCollapse=! this.isCollapse
            },
            //将所点击的菜单地址存入session，并将值赋给data中的activePath,为了后期使用
            activeStatus(activePath){
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath=activePath
            }

        }
    }
</script>

<style scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        /*让文本和退出按钮在两侧*/
        justify-content: space-between;
        /*让退出按钮居中*/
        align-items: center;
        color: #fff;
        font-size: 20px;
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #eaedf1;
    }
    /*必须加这个，否则边框对不起，很丑*/
    .el-menu{
        border-right: none;
    }
    /*折叠功能框样式,letter-spacing对字体间距做调整
      cursor指的是光标在其上面时，鼠标啥样子，pointer是小手
    */
    .toggle-button{
        background-color: #4a506c;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        letter-spacing: 5px;
        cursor: pointer;
    }
</style>
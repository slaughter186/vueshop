<template>
    <div class="login_container">
        <div class="login_box">
            <div class="logo_box">
                <img src="@/assets/logo1.png" alt="">
            </div>
            <!--ref给表单添加引用-->
            <el-form label-width="80px" class="login_form"
                     :model="LoginForm" :rules="LoginFormRules" ref="LoginFormRef">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="LoginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input type="password" v-model="LoginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <!--增加表单预验证，只用通过才能提交-->
                    <el-button type="primary" @click="valid">登陆</el-button>
                    <!--增加重置方法，将input里内容都清空-->
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                LoginForm: {
                    username: 'admin',
                    password: '123456'
                },
                LoginFormRules: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            //使用this.refs.ref名字.resetFields方法重置
            reset() {
                this.$refs.LoginFormRef.resetFields();
            },
            //表单预验证使用，this.refs.ref名字.validate方法
            valid() {
                this.$refs.LoginFormRef.validate(async valid => {
                        if (!valid)  return ;
                        const result = await  this.$http.post('login',this.LoginForm)
                        if(result.data.meta.status !== 200){
                            return this.$message.error('登陆失败')
                        }else{
                             this.$message.success('登陆成功')
                             //将token放入session
                            window.sessionStorage.setItem('token',result.data.data.token)
                            const tokenstring = window.sessionStorage.getItem('token')
                            //网页跳转到内部home页面
                            this.$router.push('/home')
                        }
                    }
                )
            }
        }

    }
</script>

<style scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        background-color: #fff;
        width: 450px;
        height: 300px;
        border-radius: 10px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }

    .logo_box {
        width: 220px;
        height: 80px;
        border: 10px solid #eee;
        border-radius: 20%;
        padding: 0;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .logo_box img {
        width: 100%;
        height: 100%;
        border-radius: 15%;
        position: relative;
        top: -2px
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;

    }

    .btns {
        display: flex;
        justify-content: right;
    }
</style>
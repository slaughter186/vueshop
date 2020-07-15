<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--el-row和el-col组合进行总体布局，gutter指的每个col的水平间距-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!--v-model绑定数据，就是query.clearable就是后面有个小×，可以清空，同时再次发起getUserList请求-->
                    <el-input place-holder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--列表区，border是有边框，stripe是隔行变色-->
            <el-table :data="userlist" border stripe>
                <!--定义索引列，很简单-->
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <!--状态要渲染成开关样子-->
                <!--状态内部要加switch，用到具名插槽-->
                <!--通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据-->
                <el-table-column label="状态">
                    <!--slot-scope是获得这一行数据的所有值，{{ scope.row.mg_state}}得出状态true/false-->
                    <template slot-scope="scope">
                        <!--用switch开关表示布尔值-->
                        <!--使用@change动作，回调状态改变函数-->
                        <el-switch
                                v-model="scope.row.mg_state" @change="userStatusChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <!--"操作"不需要从后台数据取数据，只需要渲染title,设置宽度180px，否则按钮放不开-->
                <el-table-column label="操作" width="180px">
                    <!--仍然使用作用域插槽，放三个button，分别是修改，删除和更改权限-->
                    <template slot-scope="scope">
                        <!--用的都是el自带的属性-->
                        <!--鼠标在button上的提示，使用el的文字提示tooltip,编辑设的1秒钟后自动消失-->
                        <el-tooltip class="item" effect="dark" content="修改用户" placement="top" :hide-after=1000>
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="showEditUser(scope.row)"></el-button>
                        </el-tooltip>
                        <!--删除0.5秒钟后出现-->
                        <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :open-delay=500>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="delUser(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!--变更鼠标一离开就消失-->
                        <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区-->
            <!--@size-change是下拉框动作，@current-change是点小字母的动作-->
            <!--：current-page 动态绑定当前页，本例中就是pagenum-->
            <!--：page-sizes 显示size-change框里显示每次显示的条数-->
            <!--：page-size 显示每页显示条数-->
            <!--layout 表示布局-->
            <!--：total 表示总条数-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!--对话框dialog区，显示属性默认是false-->
        <!--增加关闭前重置数据功能-->
        <el-dialog
                title="增加用户"
                :visible.sync="dialogVisible"
                width="50%"
                @close="resetData()"
        >
            <!--dialog主体区，添加form，和login页面一样-->
            <!--ref是表格索引，：model双向绑定表单里的data数据，是个json，：rules绑定验证规则-->
            <el-form ref="addUserFormRef" :model="addUser" :rules="addUserRules" label-width="100px">
                <!--prop绑定验证规则条目-->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUser.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUser.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="电邮" prop="email">
                    <el-input v-model="addUser.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addUser.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--dialog底部区-->
            <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="addUserClick">确 定</el-button>
             </span>
        </el-dialog>
        <!--修改用户diglog-->
        <el-dialog
                title="修改用户"
                :visible.sync="editdialogVisible"
                width="50%"
                @close="reseteditData"
        >

            <el-form ref="editUserFormRef" :model="editUser" :rules="addUserRules" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="editUser.username" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="电邮" prop="email">
                    <el-input v-model="editUser.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editUser.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--dialog底部区-->
            <span slot="footer" class="dialog-footer">
             <el-button @click="editdialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="editUserClick">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            //验证邮箱的正确性
            var checkEmail = (rule, value, callback) => {
                //验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    //验证通过，合法邮箱
                    return callback();
                } else {
                    callback(new Error('请输入合法邮箱！'))
                }
            };
            //验证手机号的正确性
            var checkMobile = (rule, value, callback) => {
                //验证手机的正则表达式
                const regMobile = /^(0|86|17951|12593)?(1[3-9])[0-9]{9}$/
                if (regMobile.test(value)) {
                    //验证通过，合法邮箱
                    return callback();
                } else {
                    callback(new Error('请输入合法手机号！'))
                }
            };
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                //设置存放用户列表的data和总数的data
                userlist: [],
                total: 0,
                dialogVisible: false,
                editdialogVisible: false,
                addUser: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addUserRules: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                },
                editUser: {
                    // username: '',
                    // email: '',
                    // mobile: ''
                },
            }
        },
        created() {
            this.getUserList();
        },

        methods: {
            //必须异步，并且携带参数
            async getUserList() {
                //根据api接口，axios查询用户必须带参数
                const {data: res} = await this.$http.get('users', {params: this.queryInfo})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户列表失败')
                }
                this.userlist = res.data.users
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                // 这个事件的参数是下拉框里每页显示的条数，所以数据显示要和下拉动作
                //  同时动作，把参数传给pagesize,然后重新执行getUserList
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            // 这个事件的参数是选择第几页显示，所以数据显示要和点击
            //  同时动作，把参数传给pagenum,然后重新执行getUserList
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            async userStatusChange(userinfo) {
                const {data: res} = await this.$http.put(`user/${userinfo.id}/state/${userinfo.mg_state}`)
                if (res.meta.status !== 200) {
                    //如果失败，前端图形要复原功能
                    userinfo.mg_state = !userinfo.mg_state
                    this.$message.error('修改状态失败')
                    console.log(res)
                } else {
                    this.$message.success('修改状态成功')
                }
            },
            //关闭前重置数据
            resetData() {
                this.$refs.addUserFormRef.resetFields()
            },
            //增加用户
            addUserClick() {
                this.$refs.addUserFormRef.validate(async (valid) => {
                    //预验证
                    if (!valid) {
                        this.$message.error('数据填写有问题，请核实后填写')
                    }
                    //异步传输
                    const {data: res} = await this.$http.post('users', this.addUser)
                    //根据api说明，返回201是成功
                    if (res.meta.status !== 201) {
                        this.$message.error('数据提交失败')
                    } else {
                        this.$message.success('数据提交成功')
                        //关闭dialog
                        this.dialogVisible = false
                        //重新刷新列表
                        this.getUserList()
                    }
                })
            },
            //  打开修改用户对话框
            async showEditUser(userinfo) {
                const {data: res} = await this.$http.get(`users/${userinfo.id}`)
                console.log(res.data)
                if (res.meta.status !== 200) {
                    return this.$message.error('提取用户失败')
                }
                this.editUser = res.data
                this.editdialogVisible = true

            },
            //编辑表单的重置
            reseteditData() {
                this.$refs.editUserFormRef.resetFields()
            },
            //修改用户
            editUserClick() {
                this.$refs.editUserFormRef.validate(async (valid) => {
                    //预验证
                    if (!valid) {
                        this.$message.error('数据填写有问题，请核实后填写')
                    }
                    //异步传输
                    const {data: res} = await this.$http.put(`users/${this.editUser.id}`, this.editUser)
                    //根据api说明，返回200是成功
                    if (res.meta.status !== 200) {
                        this.$message.error('数据修改失败')
                    } else {
                        this.$message.success('数据修改成功')
                        //关闭dialog
                        this.editdialogVisible = false
                        //重新刷新列表
                        this.getUserList()
                    }
                })
            },
            //删除用户,使用el中的框架
            delUser(userid) {
                this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
                ).then(async () => {
                    const {data:res}=await this.$http.delete(`users/${userid}`)
                    if(res.meta.status !== 200){
                        return this.$message.error('删除用户失败')
                    }
                    this.getUserList()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .el-breadcrumb {
        margin-bottom: 16px;
    }

    .el-table {
        margin-top: 16px;
    }

    .el-pagination {
        margin-top: 15px;
    }
</style>
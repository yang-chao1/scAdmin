<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>

      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @clear="getUserList" clearable v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">
            添加用户
          </el-button>
        </el-col>
      </el-row>


      <el-table :data="userList" border style="width: 100%;">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEdit(scope.row.id)" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeUser(scope.row.id)" size="mini"></el-button>
            <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top-start">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="fpei(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>


      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--对话框 -->
    <el-dialog
      title="提示" @close="gb"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <el-form :model="addForm" status-icon
               :rules="addFormrules"
               ref="addFormref" label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户对话框 -->
    <el-dialog
      title="修改用户" @close="editFormClose"
      :visible.sync="edit"
      width="50%"
    >
      <el-form :model="editForm" status-icon
               :rules="addFormrules"
               ref="editFormref" label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配角色"
      :visible.sync="setRole"
      width="50%"
      @close="colseRole"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRole = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        //email 校验规则
        // var checkEmail=(rule,value,callback)=>{
        //     const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        //     if(regEmail.test(value)){
        //         return callback()
        //     }else{
        //         callback(new Error('请输入合法邮箱'))
        //     }


        // };
        var checkMobile=(rule,value,callback)=>{
            const regMobile=/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

            if(regMobile.test(value)){
                return callback()
            }else{
                callback(new Error('请输入正确手机号'))
            }


        };

        return{

            //获取用户的列表的参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2

            },
            userList:[],
            total:0,
            //控制对话框的隐藏
            addDialogVisible:false,

            //控制修改对话框的隐藏
            edit:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''

            },
            addFormrules:{
                username:[
                    {required:true,message:'请输入用户名',
                        trigger:'blur'
                    },{min:3,max:10,message:'用户名的长度在3~10', trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',
                        trigger:'blur'
                    },{min:3,max:10,message:'用户名的长度在3~10', trigger:'blur'}
                ],
                email:[
                    {required:true,message:'请输入邮箱',
                        trigger:'blur'
                    },{min:3,message:'用户名的长度在3~10', trigger:'blur'},
                    // {validator:checkEmail,trigger:'blur'}
                    { type: 'email', message: '请输入正确的邮箱地址', trigger:'blur' }
                ],
                mobile:[
                    {required:true,message:'请输入手机号',
                        trigger:'blur'
                    },
                    {validator:checkMobile,trigger:'blur'}
                ],
            },
            editForm:{},
            setRole:false,
            userInfo:{},
            rolesList:[],
            selectedRoleId:'',
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        async  getUserList(){
            const {data:res}=   await  this.$http.get('users',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error("获取用户列表失败");
            }else{
                this.userList=res.data.users;
                this.total=res.data.total
            }


        },
        //监听pagesize 改变的事件
        handleSizeChange(newSize){
        //   console.log(newSize)
            this.queryInfo.pagesize=newSize;
            this.getUserList()
        },
        //监听 页码值 改变的事件
        handleCurrentChange(newPage){
            //  console.log(newPage)
            this.queryInfo.pagenum=newPage;
            this.getUserList()
        },
        async userStateChanged(userinfo){
            //     console.log(userinfo)
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status!==200){
                userinfo.mg_state=!userinfo.mg_state
                return this.$message.error('更新用户失败')
            }else{
                this.$message.success('更新用户成功')
            }


        },
        //关闭表单
        gb(){
            this.$refs.addFormref.resetFields()
        },
        //关闭修改表单
        editFormClose(){
            this.$refs.editFormref.resetFields()
        },

        addUser(){
            this.$refs.addFormref.validate(async valid=>{
                if(!valid) return
                const {data:res}=   await this.$http.post('users',this.addForm)
                console.log(res)
                if(res.meta.status!==201){
                    this.$message.error('添加用户失败')
                    return
                }
                this.$message.success('添加用户成功')
                this.addDialogVisible=false
                this.getUserList()

            })
        },
        async showEdit(id){
            const {data:res}=  await this.$http.get('users/'+id)
            if(res.meta.status!==200){
                this.$message.error('查询用户失败')
            }else{
                this.editForm=res.data
            }

            this.edit=true
        },


        editUser(){
            this.$refs.editFormref.validate(async valid=>{
                console.log(this.editForm)
                if(!valid) return
                const {data:res}=   await this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email,mobile:this.editForm.mobile
                })
                console.log(res)
                if(res.meta.status!==200){
                    this.$message.error('更新用户用户失败')
                    return
                }
                this.$message.success('更新用户成功')
                this.edit=false
                this.getUserList()

            })
        },
        async removeUser(id){
            //弹框询问删除

            const cofig=    await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)

            if(cofig!=='confirm'){
                return this.$message.info('已取消删除')
            }
            const {data:res} = await this.$http.delete('users/'+id)
            if(res.meta.status!=200){
                return  this.$message.error('删除用户失败')
            }else{
                this.$message.info('删除成功')
                this.getUserList()
            }


        },
        async fpei(userInfo){
            this.userInfo=userInfo;
            //获取所有角色列表
            const {data:res}= await this.$http.get('roles')
            if(res.meta.status!=200){
                return  this.$message.error('删除角色失败')
            }
            this.rolesList=res.data
            this.setRole=true
        },

        async saveRoleInfo(){
            if(!this.selectedRoleId){
                return this.$message.error('请选择要分配的角色')
            }
            const {data:res}= await this.$http.put(`users/${this.userInfo.id}/role`,
                {rid:this.selectedRoleId})
            if(res.meta.status!=200){
                return  this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            this.getUserList();
            this.setRole=false;

        },
        colseRole(){
            this.selectedRoleId='';
            this.userInfo={}
        },


    }
}
</script>

<style lang="less" scoped>
</style>

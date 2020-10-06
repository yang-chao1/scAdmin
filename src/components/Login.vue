<template>
  <div class="main">
    <div class="login_box">
      <div class="img_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <el-form ref="loginformRef" :model="from" :rules="rules" label-width="0px" class="login_from">
        <el-form-item prop="username">
          <el-input v-model="from.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="from.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">
            登录
          </el-button>

          <el-button type="info" @click="cz">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {incer} from '@/router/index.js'

export default {
    data(){
        return{
            from:{
                username:'admin',
                password:'123456'
            },


            rules: {
                name: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],

            }


            ///
        }
    },
    methods:{
        cz(){
            this.$refs.loginformRef.resetFields();
        },
        login(){
            this.$refs.loginformRef.validate(async valid=>{
                if(!valid) return;
                const {data:data}=await this.$http.post("login",this.from);
                if(data.meta.status!=200) return this.$message.error('密码错误');
                // console.log(data.data.token)
                window.sessionStorage.setItem('token',data.data.token)

                this.$router.push('/home')
            })
        }

    }
}
</script>

<style lang="less" scoped>
.main{
    background: #2b4b6b;
    height: 100%;

    .login_box{
        width: 450px;
        height: 300px;
        background: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
}

.img_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #fff;
    }
}

.btns{
    display: flex;
    justify-content: flex-end;
}
.login_from{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
   box-sizing: border-box;
}
</style>

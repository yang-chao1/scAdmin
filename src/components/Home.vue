<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/fw.png" alt="" />
        <span>后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">
        退出
      </el-button>
    </el-header>
    <el-container>
      <!--左菜单 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCall">
          | | |
        </div>
        <el-menu
          :default-active="activePath"
          router

          class="el-menu-vertical-demo"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
                          :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <tab-com></tab-com>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import tabCom from '@/components/tabs/tabs.vue'
export default {
    components:{
        tabCom
    },
    data(){
        return{
            menulist:[],
            iconsObj:{
                '125':'el-icon-aim',
                '103':'el-icon-medal-1',
                '101':'el-icon-full-screen',
                '102':'el-icon-s-platform',
                '145':'el-icon-s-order',
            },
            isCollapse:false,
            activePath:''
        }
    },
    created(){
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activePath');
    },
    watch:{
        '$route'(to,from){
            this.activePath=to.path

            window.sessionStorage.setItem('activePath',to.path)
        }
    },
    methods:{
        // saveNav(activePath){
        //     this.activePath=activePath
        //     window.sessionStorage.setItem('activePath',activePath)
        // },


        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login")
        },
        async getMenuList(){
            const {data:res}= await this.$http.get('menus')
            if(res.meta.status!==200)return this.$message.error(res.meta.msg)
            this.menulist=res.data;
            //  console.log(this.menulist)
        },
        toggleCall(){
            this.isCollapse=! this.isCollapse
        }
    }
}
</script>

<style lang="scss" scoped>
@import './home.scss'
</style>

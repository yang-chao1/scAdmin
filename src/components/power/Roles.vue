<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>

      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">
            添加角色
          </el-button>
        </el-col>
      </el-row>


      <!-- 角色列表-->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',index===0 ?'bdtop':'','vcenter']" v-for="(item1,index) in scope.row.children" :key="item1.id">
              <!--一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二三级权限 -->
              <el-col :span="19">
                <!-- 通过for 循环 嵌套二级权限-->
                <el-row :class="[index1===0?'':'bdtop','vcenter']" v-for="(item2,index1) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="(item3) in item2.children" :key="item3.id">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column width="300px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">
              编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">
              删除
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSet(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <el-dialog
      title="分配权限"
      :visible.sync="setRight"
      width="50%"
      @close="closeRight"
    >
      <!--树形控件 -->
      <el-tree ref="treeRef" show-checkbox :data="rightsList" :props="treeProps" default-expand-all node-key="id" :default-checked-keys="defKeys"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRight = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            rolesList:[],
            setRight:false,
            //所有权限的数据
            rightsList:[],
            //树形控件的绑定对象
            treeProps:{
                label:'authName',
                children:'children'


            },
            defKeys:[],
            roleId:'',

        }
    },
    created(){
        this.getRolesList()


    },
    methods:{
        async  getRolesList(){
            const {data:res}=  await this.$http.get('roles');
            if(res.meta.status!==200){
                this.$message.error('获取角色列表失败');
            }
            this.rolesList=res.data

        },
        //根据id 删除图标
        async  removeRightById(role,rightId){

            const config=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(config!=='confirm'){
                return this.$message.info('已取消删除')
            }
            const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status!==200){
                this.$message.error('获取权限失败');
            }
            //this.getRolesList
            role.children=res.data
        },
        async showSet(role){
            this.roleId=role.id
            //获取所有权限数据
            const {data:res}=  await this.$http.get('rights/tree')

            if(res.meta.status!==200){
                return this.$message.error('获取权限失败')
            }
            this.rightsList=res.data

            this.getLeafKeys(role,this.defKeys)
            this.setRight=true
        },


        getLeafKeys(node ,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>
                this.getLeafKeys(item,arr))


        },

        closeRight(){
            this.defKeys=[]
        },
        //分配权限
        async allotRights(){
            const keys=[...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()

            ];
            const keysStr= keys.join(',')
            const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysStr})
            if(res.meta.status!==200){
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRolesList();
            this.setRight=false

        },


    },


}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px ;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>

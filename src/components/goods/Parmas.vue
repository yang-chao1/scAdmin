<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意:只允许第三级分类设置相关参数" type="warning" show-icon :closable="false">
      </el-alert>
      <el-row class="opt">
        <el-col>
          <span>选择商品分类:</span>
        </el-col>
      </el-row>
      <el-cascader
        v-model="selectedCateKeys"
        :options="catelist"
        expand-trigger="hover"
        :props="cateProps"
        @change="handleChange"
      ></el-cascader>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDis" @click="dialogVisible=true">
            添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,i) in scope.row.attr_vals"
                        :key="i" @close="handleClose(i,scope.row)"
                >
                  {{ item }}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDis" @click="dialogVisible=true">
            添加属性
          </el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,i) in scope.row.attr_vals"
                        :key="i" @close="handleClose(i,scope.row)"
                >
                  {{ item }}
                </el-tag>

                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="dialogVisible"
      width="50%"
      @clone="addDialogClosed"
    >
      <el-form :model="addForm" status-icon
               :rules="addFormrules"
               ref="addFormref" label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editdialogVisible"
      width="50%"
      @clone="editDialogClosed"
    >
      <el-form :model="editForm" status-icon
               :rules="editFormrules"
               ref="editFormref" label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addParmas} from '@/api/goods.js'
export default {
    data(){
        return{
            catelist:[],
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //级联选择框双向绑定的数组
            selectedCateKeys:[],
            activeName:'many',
            manyTableData:[],
            onlyTableData:[],
            dialogVisible:false,
            editdialogVisible:false,
            addForm:{attr_name:''},
            editForm:{attr_name:''},


            addFormrules:{
                attr_name:[
                    {required:true,message:'请输入用户名',
                        trigger:'blur'
                    }
                ]
            },
            editFormrules:{
                attr_name:[
                    {required:true,message:'请输入用户名',
                        trigger:'blur'
                    }
                ]
            },

        }
    },
    mounted(){
        this.getCateList()
    },
    methods:{
        editDialogClosed(){
            this.$refs.editFormref.resetFields()
        },
        addDialogClosed(){
            this.$refs.addFormref.resetFields()
        },
        async  getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.console.error('获取商品失败');
            }
            this.catelist=res.data
        },

        handleChange(){
            this.getParamsData()
        },
        handleTabClick(){
            this.getParamsData()
        },
        //获取参数的列表数据
        async getParamsData(){
            if(this.selectedCateKeys.length!==3){
                this.selectedCateKeys=[];
                this.manyTableData=[];
                this.onlyTableData=[]
                // this.$message.error('只能选择第三级的')
                return
            }
            // const {data:res}  =await this.$http.get(`categories/${this.cateId}/attributes`,
            //     {params:{sel:this.activeName}})
            const {data:res} = await addParmas(this.cateId,{sel:this.activeName})
            if(res.meta.status!==200){
                return this.$message.console.error('获取商品失败');
            }
            //  console.log(res)
            res.data.forEach(item => {
                item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
                //控制文本框的显示和隐藏
                item.inputVisible=false
                //文本框的输入值
                item.inputValue=''


            });
            if(this.activeName==='many'){
                this.manyTableData=res.data
            }else{
                this.onlyTableData=res.data
            }
        },
        addParams(){
            this.$refs.addFormref.validate(async valid=>{
                if(!valid) return;
                const{data:res}= await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName

                })
                if(res.meta.status!=201){
                    return this.$message.error('添加参数失败')
                }else{
                    this.$message.success('添加参数成功')
                    this.dialogVisible=false;
                    this.$refs.addFormref.resetFields()
                    this.getParamsData()
                }

            })
        },
        async showEdit(attr_id){
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                params:{attr_sel:this.activeName}
            })

            if(res.meta.status!=200){
                return this.$message.error('获取参数失败')
            }

            this.editForm=res.data
            this.editdialogVisible=true
        },
        //修改
        editParams(){
            // console.log(this.editForm.attr_id)
            this.$refs.editFormref.validate(async valid =>{
                if(!valid) return
                const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                    attr_name:this.editForm.attr_name,attr_sel:this.activeName}
                )
                if(res.meta.status!=200){
                    return this.$message.error('修改参数失败')
                }
                this.$message.success('修改参数成功')
                this.getParamsData()
                this.editdialogVisible=false

            })
        },
        async removeParams(attr_id){
            const confirm=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(confirm!=='confirm'){
                return this.$message.info('已取消')
            }
            const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/
      ${attr_id}`)
            if(res.meta.status!=200){
                return this.$message.error('删除参数失败')
            }
            this.$message.success('删除参数成功')
            this.getParamsData()

        },

        async handleInputConfirm(row){
            if(row.inputValue.trim().length===0){
                row.inputValue='';
                row.inputVisible=false;
                return
            }
            //文本框有内容
            row.attr_vals.push(row.inputValue.trim());
            row.inputValue='';
            row.inputVisible=false;
            this.saveAttrVals(row)
        },
        async saveAttrVals(row){
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`
                ,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})
            if(res.meta.status!==200){
                return this.$message.error('增加标签失败')
            }
            this.$message.success('增加标签成功')

        },
        showInput(row){
            row.inputVisible=true;
            // eslint-disable-next-line no-unused-vars
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleClose(i,row){

            row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        }


    },
    computed:{
        isBtnDis(){

            return this.selectedCateKeys.length!==3?true:false

        },
        cateId(){
            if(this.selectedCateKeys.length===3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        titleText(){
            if(this.activeName==='many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    }


}
</script>

<style scoped>
.opt {
    margin: 15px 0;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 150px;
}
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>

      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">
            添加商品
          </el-button>
        </el-col>
      </el-row>

      <tree-table class="treetable" border show-index index-text="#" :expand-type="false" :data="cateList" :columns="columns" :selection-type="false">
        <!-- 是否有效模板-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: green;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序模板-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">
            一级
          </el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level===1">
            二级
          </el-tag>
          <el-tag size="mini" v-else>
            三级
          </el-tag>
        </template>
        <template slot="opt" slot-scope="">
          <el-button type="primary" size="mini" icon="el-icon-edit">
            编辑
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">
            删除
          </el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialog"
      width="50%"
      @close="addCatClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            clearable
            change-on-select
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCatFrom">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框-->
    <el-dialog title="修改分类">
      <el-form :rules="addFormRules">
        <el-from-item label="分类名称" prop="cat_name">
          <el-input></el-input>
        </el-from-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            cateList:[],
            total:0,
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },{
                    label:'是否有效',
                    type:'template',
                    template:'isok'

                },
                {
                    label:'排序',
                    type:'template',
                    template:'order'

                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'

                },
            ],
            addCatDialog:false,
            addForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            //添加分类表单的验证对象
            addFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',
                        trigger:'blur'
                    }
                ]
            },
            //父级分类的列表
            parentCateList:[],
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectKeys:[]

        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        async getCateList(){
            const {data:res}=  await this.$http.get('categories',{params:this.querInfo})
            if(res.meta.status!==200){
                this.$message.error('获取商品列表失败');
            }

            this.cateList=res.data.result;
            //总数据条数
            this.total=res.data.total;

        },
        handleSizeChange(newSize){
            this.querInfo.pagesize=newSize;
            this.getCateList();
        },
        handleCurrentChange(newPage){
            this.querInfo.pagenum=newPage;
            this.getCateList();
        },
        showCateDialog(){
        //获取父级的祈求列表,再展示对话框
            this.getParentCateList();
            this.addCatDialog=true
        },
        //获取父级的祈求列表
        async getParentCateList(){
            const {data:res}=  await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200){
                this.$message.error('获取商品列表失败');
            }

            this.parentCateList=res.data
        },
        //选择项发生变化触发函数
        parentCateChanged(){
            console.log(this.selectKeys)
            if(this.selectKeys.length>0){
                let lent=this.selectKeys.length-1
                this.addForm.cat_pid= this.selectKeys[lent]
                this.addForm.cat_level=this.selectKeys.length
                console.log( this.addForm)
                return
            }else{
                this.addForm.cat_pid=0;
                this.addForm.cat_level=0
            }
        },
        //点击按钮，添加新的分类
        addCatFrom(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                console.log(this.addForm)
                const {data:res}= await this.$http.post('categories',this.addForm)
                if(res.meta.status!==201){
                    this.$message.error('增加商品分类失败');
                }else{
                    this.$message.success('增加分类成功');
                    this.getCateList();
                    this.addCatDialog=false
                }

            })


        },
        addCatClose(){
            this.$refs.addFormRef.resetFields()
            this.selectKeys=[];
            this.addForm.cat_pid=0;
            this.addForm.cat_level=0

        },


    }
}
</script>

<style lang="less" scoped>
.treetable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>

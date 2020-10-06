<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>增加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!--步骤条 -->
      <el-steps :space="200" align-center :active="activeIndex" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                expand-trigger="hover"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableData"
                          :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"
                             v-for="(cb,i) in item.attr_vals"
                             :key="i"
                             border
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTableData"
                          :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- -->
            <el-upload

              :action="uoloadImg"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">
                点击上传
              </el-button>
              <!-- <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            ></quill-editor>
            <el-button class="btn" type="primary" @click="add">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
      <img :src="previewPath" class="previewImg" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import {addGoods} from '@/api/goods.js'
export default {
    data(){
        return{
            tt:[],
            uoloadImg:"http://127.0.0.1:8888/api/private/v1/upload",
            activeIndex:'0',
            //添加商品的表单数据
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            catelist:[],
            manyTableData:[],
            addFormRules:{
                goods_name:[
                    {required:true,message:'请输入商品名称',trigger:'blur'}
                ],
                goods_price:[
                    {required:true,message:'请输入商品价格',trigger:'blur'}
                ],
                goods_weight:[
                    {required:true,message:'请输入商品重量',trigger:'blur'}
                ],
                goods_number:[
                    {required:true,message:'请输入商品数量',trigger:'blur'}
                ],
            },
            cateProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            onlyTableData:[],
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            previewPath:'',
            previewVisible:false,


        }

    },
    created(){
        this.getCateList();
    },
    methods:{
        async getCateList(){
            const {data:res}= await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获取失败')
            }
            this.catelist=res.data
        },
        handleChange(){
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat=[]
            }
        },
        //离开标签页
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName ===  '0' && this.addForm.goods_cat.length!==3){
                this.$message.error('请选择商品分类')
                return false
            }
        },
        async tabClicked(){
            if(this.activeIndex === '1'){
                const  {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,
                    {params:{sel:'many'}})

                if(res.meta.status!==200){
                    return this.$message.error('获取失败')
                }
                res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals.length===0 ?
                        [] : item.attr_vals.split(' ')
                })
                console.log(res.data)
                this.manyTableData=res.data
            }else if(this.activeIndex === '2'){
                const  {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,
                    {params:{sel:'only'}})

                if(res.meta.status!==200){
                    return this.$message.error('获取失败')
                }
                this.onlyTableData=res.data

            }
        },
        //处理图片预览
        handlePreview(file){

            this.previewPath=file.response.data.url
            console.log( this.previewPath)
            this.previewVisible=true
        },
        //处理移除图片的操作
        handleRemove(file){
            const filePath=file.response.data.tmp_path;
            const i=this.addForm.pics.findIndex(x=>{

                return x.pic===filePath
            })
            console.log(i)
            this.addForm.pics.splice(i,1);
            console.log( this.addForm)
        },
        handleSuccess(response){
            const picInfo ={
                pic:response.data.tmp_path
            }
            this.addForm.pics.push(picInfo)

        },
        add(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项')
                }
                //lodash cloneDeep(obj)
                const form=_.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(',')
                this.manyTableData.forEach(item=>{
                    const newInfo={attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                });
                this.onlyTableData.forEach(item=>{
                    const newInfo={attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs=this.addForm.attrs
                //console.log(form)
                // const {data:res} = await this.$http.post('goods',form)
                // console.log(res)

                const {data:res} = await addGoods(form)
                if(res.meta.status!==201){
                    return this.$message.error('添加商品失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        }
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }else{
                return null
            }
        }
    }
}
</script>

<style scoped>
.el-checkbox {
    margin: 0 10px 0 0 !important;
}
.previewImg {
    width: 100%;
}
.btn {
    margin-top: 10px;
}
</style>

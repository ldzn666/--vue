<template>
    <div>
        <el-form ref="form" label-width="80px" :model="spu">
            <el-form-item label="SPU名称">
                <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option 
                        :label="tm.tmName" 
                        :value="tm.id" 
                        v-for="(tm,index) in tradeMarkList" 
                        :key="tm.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input 
                    type="textarea" 
                    rows="4" 
                    placeholder="描述"
                    v-model="spu.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload 
                    action="/dev-api/admin/product/fileUpload" 
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview" 
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :file-list="spuImageList">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndName">
                    <el-option 
                        :label="unselect.name" 
                        :value="`${unselect.id}:${unselect.name}`" 
                        v-for="(unselect,index) in unSelectSaleAttr" 
                        :key="unselect.id"></el-option>
                </el-select>
                <el-button 
                    type="primary" 
                    icon="el-icon-plus" 
                    style="margin:10px" 
                    :disabled="!attrIdAndName"
                    @click="addSaleAttr">添加销售属性</el-button>
                <el-table style="width:100%" border :data="spu.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column> 
                    <el-table-column prop="saleAttrValueName" label="属性值名称列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag 
                                :key="tag.id" 
                                v-for="(tag,index) in row.spuSaleAttrValueList" 
                                closable 
                                :disable-transitions="false" 
                                @close="handleClose(row,index)">
                                    {{tag.saleAttrValueName}}
                            </el-tag>
                            <el-input 
                                class="input-new-tag" 
                                v-if="row.inputVisible" 
                                v-model="row.inputValue" 
                                ref="saveTagInput" 
                                size="small"
                                @keyup.enter.native="handleInputConfirm" 
                                @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else 
                                class="button-new-tag" 
                                size="small" 
                                @click="addSaleAttrValue(row)">+ 添加
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-button 
                                type="danger" 
                                icon="el-icon-delete" 
                                size="mini"
                                @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button 
                    type="primary"
                    @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'spuForm',

    data() {
        return {
            dialogImageUrl: '', 
            dialogVisible: false,
            spu: {
                "category3Id": '',
                "description": "",
                "tmId": '',
                "spuName": "",
                "spuImageList": [
                    // {
                    //     "id": 0,
                    //     "imgName": "",
                    //     "imgUrl": "",
                    //     "spuId": 0
                    // }
                ],
                "spuSaleAttrList": [
                    // {
                    //     "baseSaleAttrId": 0,
                    //     "id": 0,
                    //     "saleAttrName": "",
                    //     "spuId": 0,
                    //     "spuSaleAttrValueList": [
                    //         {
                    //             "baseSaleAttrId": 0,
                    //             "id": 0,
                    //             "isChecked": "",
                    //             "saleAttrName": "",
                    //             "saleAttrValueName": "",
                    //             "spuId": 0
                    //         }
                    //     ]
                    // }
                ]
            },
            tradeMarkList:[],
            spuImageList:[],
            saleAttrList:[],
            attrIdAndName:'',
        };
    },

    mounted() {
        
    },

    methods: {
        handleRemove(file, fileList) {
            this.spuImageList = fileList;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleSuccess(response,file,fileList){
            this.spuImageList = fileList;
        },
        async initSpuData(spu){
            let spuRes = await this.$API.spu.reqSpu(spu.id);
            if(spuRes.code == 200){
                this.spu = spuRes.data;
            }
            let tradeMarkRes = await this.$API.spu.reqTradeMarkList();
            if(tradeMarkRes.code == 200){
                this.tradeMarkList = tradeMarkRes.data;
            }
            let spuImageRes = await this.$API.spu.reqSpuImageList(spu.id);
            if(spuImageRes.code == 200){
                let listArr = spuImageRes.data;
                listArr.forEach((item) => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                })
                this.spuImageList = listArr;
            }
            let saleRes = await this.$API.spu.reqBaseSaleAttrList();
            if(saleRes.code == 200){
                this.saleAttrList = saleRes.data;
            }
        },
        addSaleAttr(){
            const [baseSaleAttrId,saleAttrName] = this.attrIdAndName.split(':');
            let newSaleAttr = {
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList:[]
            };
            this.spu.spuSaleAttrList.push(newSaleAttr);
            this.attrIdAndName = '';
        },
        addSaleAttrValue(row){
            this.$set(row,'inputVisible',true);
            this.$set(row,'inputValue','');
        },
        handleInputConfirm(row){
            const {baseSaleAttrId,inputValue} = row;
            if(inputValue.trim()==''){
                this.$message({
                    type:'warning',
                    message:'请不要输入空'
                });
                return;
            }
            let res = row.spuSaleAttrValueList.some((item) => {
                return item.saleAttrValueName === inputValue;
            });
            if(res){
                this.$message({
                    type:'error',
                    message:'请不要输入重复值'
                });
                return;
            }
            let newSaleAttrValue = {
                baseSaleAttrId,
                saleAttrValueName:inputValue
            }
            row.spuSaleAttrValueList.push(newSaleAttrValue);
            row.inputVisible = false;
        },
        handleClose(row,index){
            row.spuSaleAttrValueList.splice(index,1)
        },
        async addOrUpdateSpu(){
            //整理照片墙
            this.spu.spuImageList = this.spuImageList.map((item) => {
                return{
                    imageName:item.name,
                    imageUrl:(item.response&&item.response.data)||item.url
                }
            });
            let res = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
            if(res.code == 200){
                this.$message({
                    type:'success',
                    message:'保存成功'
                });
                this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'新增'});
            }
            Object.assign(this._data,this.$options.data());
        },
        async spuAddSpuData(category3Id){
            this.spu.category3Id = category3Id;
            let tradeMarkRes = await this.$API.spu.reqTradeMarkList();
            if(tradeMarkRes.code == 200){
                this.tradeMarkList = tradeMarkRes.data;
            }
            let saleRes = await this.$API.spu.reqBaseSaleAttrList();
            if(saleRes.code == 200){
                this.saleAttrList = saleRes.data;
            } 
        },
        cancel(){
            this.$emit('changeScene',{scene:0,flag:''});
            Object.assign(this._data,this.$options.data());
        }
    },

    computed:{
        unSelectSaleAttr(){
            return this.saleAttrList.filter((item) => {
                return this.spu.spuSaleAttrList.every((item1) => {
                    return item.name != item1.saleAttrName;
                })
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
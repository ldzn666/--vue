<template>
    <div>
        <el-card style="margin:20px 0px">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" style="margin:20px" @click="addAttr">添加属性</el-button>
                <el-table style="width:100%" border :data="attrList">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150">
                    </el-table-column>
                    <el-table-column prop="" label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id"
                                style="margin:0px 20px">
                                {{attrValue.valueName}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="150">
                        <template slot-scope="{row,$index}">
                            <el-button 
                                type="warning" 
                                icon="el-icon-edit" 
                                size="mini" 
                                @click="updateAttr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttrItem(row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button
                    type="primary" 
                    icon="el-icon-plus" 
                    @click="addAttrValue" 
                    :disabled="!attrInfo.attrName">添加属性值</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
                <el-table
                    style="width:100% ;margin:20px"
                    :data="attrInfo.attrValueList"
                    border>
                    <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
                    <el-table-column width="width" label="属性值名称">
                        <template slot-scope="{row,$index}">
                            <el-input 
                                placeholder="请输入属性值名称" 
                                v-model="row.valueName" 
                                size="mini" v-if="row.flag" 
                                @blur="toLook(row)"
                                @keyup.native.enter="toLook(row)"
                                :ref="$index"></el-input>
                            <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="width" label="操作">
                        <template slot-scope="{row,$index}">
                            <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button 
                                type="danger" 
                                icon="el-icon-delete" 
                                size="mini"
                                slot="reference"
                                >删除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
            </div>

        </el-card>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
    name: "Attr",
    data() {
        return {
            isShowTable:true,
            category1Id:'',
            category2Id:'',
            category3Id:'',
            attrList:[],
            attrInfo:{
                attrName:'',
                attrValueList:[],
                categoryId: 0,
                categoryLevel: 3,
            }
        };
    },
    mounted() {
    },
    methods: {
        getCategoryId({categoryId,level}){
            if(level == 1){
                this.category1Id = categoryId;
                this.category2Id = '';
                this.category3Id = '';
            }else if(level == 2){
                this.category2Id = categoryId;
                this.category3Id = '';
            }else{
                this.category3Id = categoryId;
                this.getAttrList();
            }
        },
        async getAttrList(){
            //获取ID
            const {category1Id,category2Id,category3Id} = this;
            let res = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id);
            if(res.code === 200){
                this.attrList = res.data;
            }
        },
        addAttrValue(){
            let isNull = this.attrInfo.attrValueList.some((item)=>{
                return item.valueName == '';
            })
            if(isNull){
                return;
            }
            this.attrInfo.attrValueList.push(
                {
                    attrId:this.attrInfo.id,
                    valueName:'',
                    flag:true
                }
            );
            this.$nextTick(()=>{
                this.$refs[this.attrInfo.attrValueList.length - 1].focus();
            })
        },
        addAttr(){
            this.isShowTable = false;
            this.attrInfo = {
                attrName:'',
                attrValueList:[],
                categoryId: this.category3Id,
                categoryLevel: 3,
            }
        },
        updateAttr(row){
            this.isShowTable = false;
            //浅拷贝 {...row}
            this.attrInfo = cloneDeep(row);
            this.attrInfo.attrValueList.forEach((item) =>{
                this.$set(item,'flag',false);
            })
        },
        toLook(row){
            if(row.valueName.trim() === ''){
                this.$message({
                    type:'warning',
                    message:'请不要输入空'
                });
                return;
            }
            //新增属性值不能重复
            let isRepat = this.attrInfo.attrValueList.some((item)=>{
                if(row != item){
                    return item.valueName === row.valueName
                }
            })
            if(isRepat){
                this.$message({
                    type:'warning',
                    message:'请不要输入重复的属性值'
                });
                return;
            }
            row.flag = false;
        },
        toEdit(row,index){
            row.flag = true;
            this.$nextTick(()=>{
                this.$refs[index].focus();
            })
        },
        deleteAttrValue(index){
            this.attrInfo.attrValueList.splice(index,1);
        },
        async addOrUpdateAttr(){
            let isNull = this.attrInfo.attrValueList.some((item)=>{
                return item.valueName == '';
            })
            if(isNull){
                this.$message({
                    type:'error',
                    message:'存在属性值为空的元素，保存失败'
                });
                return;
            }

            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item)=>{
                if(item.valueName.trim() != ''){
                    delete item.flag;
                    return true
                }
            });
            try{
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                this.$message({
                    type:'success',
                    message:'保存成功'
                });
                this.getAttrList();
                this.isShowTable = true;
            }catch(error){
                this.$message({
                    type:'danger',
                    message:'保存失败'
                })
            }
        },
        async deleteAttrItem(row){
            this.$confirm(`此操作将永久删除${row.attrName}，是否继续`,"提示",{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning',
            }).then(async()=>{
                let res = await this.$API.attr.reqDeleteAttr(row.id);
                if(res.code == 200){
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    });
                    this.getAttrList();
                }
            }).catch(()=>{
                this.$message({
                    type:'info',
                    message:'已取消删除'
                })
            })
        }
    },
};
</script>

<style lang="scss" scoped>

</style>
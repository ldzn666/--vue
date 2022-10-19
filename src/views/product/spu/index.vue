<template>
    <div>
        <el-card style="margin:20px 0px">
            <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="scene==0">
                <el-button 
                    type="primary" 
                    icon="el-icon-plus" 
                    style="margin:20px" 
                    :disabled="!category3Id"
                    @click="addSpu()">添加SPU</el-button>
                <el-table style="width:100%" border :data="records">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
                    <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <hint-button 
                                type="success" 
                                icon="el-icon-plus" 
                                size="mini" 
                                @click="addSku(row)"
                                title="添加SKU"></hint-button>
                            <hint-button 
                                type="warning" 
                                icon="el-icon-edit" 
                                size="mini" 
                                title="修改SPU"
                                @click="updateSpu(row)"/>
                            <hint-button 
                                type="info" 
                                icon="el-icon-info" 
                                size="mini"  
                                title="查看当前SPU的SKU列表"
                                @click="handler(row)"></hint-button>
                            <el-popconfirm @onConfirm="deleteSpu(row)">
                                <hint-button 
                                type="danger" 
                                icon="el-icon-delete" 
                                size="mini" 
                                title="删除SPU"
                                slot="reference"></hint-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination 
                    style="margin-top:20px; text-align: center;" 
                    :current-page="page" 
                    :total="total" 
                    :page-size="limit"
                    :pager-count="7" 
                    :page-sizes="[3,5,10]" 
                    @current-change="getSpuList" 
                    @size-change="handleSizeChange"
                    layout="prev,pager,next,jumper,->,sizes,total">
                </el-pagination>
            </div>
            <SpuForm v-show="scene==1" @chang eScene="changeScene" ref="spu"></SpuForm>
            <SkuForm v-show="scene==2" ref="sku" @changeScene="changeScene"></SkuForm>
        </el-card>
        <el-dialog 
            :title="`${spu.spuName}的sku列表`" 
            :visible.sync="dialogTableVisible"
            :before-close="close">
            <el-table :data="skuList" style="width:100%" border  v-loading="loading" >
                <el-table-column property="skuName" label="名称" width="width"></el-table-column>
                <el-table-column property="price" label="价格" width="width"></el-table-column>
                <el-table-column property="weight" label="重量" width="width"></el-table-column>
                <el-table-column label="默认图片" width="width">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog> 
    </div>
</template>

<script>
import SkuForm from './skuForm/index.vue';
import SpuForm from './spuForm/index.vue';

export default {
    name: "spu",
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            total: 10,
            limit: 5,
            page: 1,
            records: [],
            scene: 0, //0代表spu列表  1代表spu  2代表sku
            dialogTableVisible:false,
            spu:{},
            skuList:[],
            loading:true,
        };
    },
    mounted() {
    },
    methods: {
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
            }
            else if (level == 2) {
                this.category2Id = categoryId;
                this.category3Id = "";
            }
            else {
                this.category3Id = categoryId;
                this.getSpuList();
            }
        },
        async getSpuList(pages = 1) {
            this.page = pages;
            const { page, limit, category3Id } = this;
            const res = await this.$API.spu.reqSpuList(page, limit, category3Id);
            if (res.code === 200) {
                this.total = res.data.total;
                this.records = res.data.records;
            }
        },
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSpuList();
        },
        updateSpu(row){
            this.scene = 1;
            this.$refs.spu.initSpuData(row);
        },
        addSpu(){
            this.scene = 1;
            this.$refs.spu.spuAddSpuData(this.category3Id);
        },
        changeScene({scene,flag}){
            this.scene = scene;
            if(flag==='修改'){
                this.getSpuList(this.page); 
            }else{
                this.getSpuList(); 
            }
        },
        async deleteSpu(row){
            let res = await this.$API.spu.reqDeleteSpu(row.id);
            if (res.code == 200) {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
                this.getSpuList(this.records.length>1?this.page:this.page-1);
            }
        },
        addSku(row){
            this.scene = 2;
            this.$refs.sku.getData(this.category1Id,this.category2Id,row);
        },
        async handler(spu){
            this.dialogTableVisible = true;
            this.spu = spu;
            let res = await this.$API.spu.reqSkuList(spu.id); 
            if(res.code == 200){
                this.skuList = res.data;
                this.loading = false;
                // res.data.forEach((item)=>{
                //     this.skuList.push(item);
                // });
            }
        },
        close(){
            this.loading = false;
            this.skuList = [];
        }
    },
    components: { SkuForm, SpuForm }
};
</script>

<style lang="scss" scoped>

</style>
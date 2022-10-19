<template>
    <div>
        <el-table style="width" border :data="records">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
            <el-table-column label="默认图片" width="120">
                <template slot-scope="{row,$index}">
                    <img src="row.skuDefaultImg" style="width:100px;height:100px">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="80"></el-table-column>
            <el-table-column prop="price" label="价格" width="80"></el-table-column>
            <el-table-column prop="" label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <el-button 
                        type="success" 
                        icon="el-icon-sort-down" 
                        size="mini" 
                        v-if="row.isSale==0"
                        @click="sale(row)"></el-button>
                    <el-button 
                        type="info" 
                        icon="el-icon-sort-up" 
                        size="mini" 
                        v-else
                        @click="cancel(row)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button 
                        type="info" 
                        icon="el-icon-info" 
                        size="mini"
                        @click="getSkuInfo(row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
                    @current-change="getSkuList" 
                    @size-change="handleSizeChange"
                    layout="prev,pager,next,jumper,->,sizes,total">
        </el-pagination>
        <el-drawer :visible.sync="drawer" :show-close="false" size="40%">
            <el-row>
                <el-col :span="5">
                    名称
                </el-col>
                <el-col :span="16">
                    {{skuInfo.skuName}}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    描述
                </el-col>
                <el-col :span="16">
                    {{skuInfo.skuDesc}}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    价格
                </el-col>
                <el-col :span="16">
                    {{skuInfo.price}}元
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    平台属性
                </el-col>
                <el-col :span="16">
                    <template>
                        <el-tag 
                            type="success"
                            v-for="(attr,index) in skuInfo.skuAttrValueList" 
                            :key="attr.id"
                            style="margin-right:10px">
                        {{attr.attrId}}-{{attr.valueId}}</el-tag>
                    </template>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    商品图片
                </el-col>
                <el-col :span="16">
                    <el-carousel height="150px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" style="width:100px;height: 100px;">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: 'sku',

    data() {
        return {
            total:0,
            limit:10,
            page:1,
            records:[],
            skuInfo:{},
            drawer:false,

        };
    },

    mounted() {
        //获取skuList
        this.getSkuList();
    },

    methods: {
        async getSkuList(pages = 1) {
            this.page = pages;
            const { page, limit } = this;
            const res = await this.$API.sku.reqSkuList(page, limit);
            if (res.code === 200) {
                this.total = res.data.total;
                this.records = res.data.records;
            }
        },
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSkuList();
        },
        async sale(row){
            let res = await this.$API.sku.reqSale(row.id);
            if(res.code == 200){
                row.isSale = 1;
                this.$message({
                    type:'success',
                    message:'上架成功'
                })
            }else{
                this.$message({
                    type:'error',
                    message:'上架失败'
                })
            }
        },
        async cancel(row){
            let res = await this.$API.sku.reqCancel(row.id);
            if(res.code == 200){
                row.isSale = 0;
                this.$message({
                    type:'success',
                    message:'下架成功'
                })
            }else{
                this.$message({
                    type:'error',
                    message:'下架失败'
                })
            }
        },
        async getSkuInfo(sku){
            let res = await this.$API.sku.reqSkuById(sku.id);
            if(res.code == 200){
                this.skuInfo = res.data;
                this.drawer = true;
            }
        }
    },
};
</script>

<style lang="scss" scoped>
        .el-row .el-col-5 {
            font-size: 18px;
            text-align: right;
        }
    
        .el-col {
            margin: 10px 10px;
        }
</style>

<style>
        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }
    
        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }

        .el-carousel__button{
            width:10px;
            height:10px;
            background: red;
            border-radius: 50%;
        }
</style>
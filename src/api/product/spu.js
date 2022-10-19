import request from '@/utils/request'

//获取spu列表的接口
export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id: category3Id }
})

//获取某个spu信息
export const reqSpu = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get',
})

//获取品牌的数据
export const reqTradeMarkList = () => request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: 'get'
})

//获取spu图片
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

//获取销售属性
export const reqBaseSaleAttrList = () => request({
    url: `/admin/product/baseSaleAttrList`,
    method: 'get'
})

//添加修改SPU
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({
            url: `/admin/product/updateSpuInfo`,
            method: 'post',
            data: spuInfo
        })
    } else {
        return request({
            url: `/admin/product/saveSpuInfo`,
            method: 'post',
            data: spuInfo
        })
    }
}

///admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})


//获取图片接口  /admin/product/spuImageList/{spuId}
export const reqSpuImgList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

//获取销售属性  /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
})

//获取平台属性 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})

//新增 /admin/product/saveSkuInfo
export const reqAddSku = (data) => request({
    url: `/admin/product/saveSkuInfo`,
    method: 'post',
    data: data
})

//根据id获取sku
export const reqSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get',
})
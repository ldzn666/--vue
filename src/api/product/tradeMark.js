import request from '@/utils/request';

//获取品牌管理列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList =
    (page, limit) => request({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'
    });

//新增品牌管理
//修改品牌管理
export const reqAddOrUpdateTradeMark =
    (tradeMark) => {
        //修改
        if (tradeMark.id) {
            return request({
                url: `/admin/product/baseTrademark/update`,
                method: 'put',
                data: tradeMark
            })
        } else {
            //新增
            return request({
                url: `/admin/product/baseTrademark/save`,
                method: 'post',
                data: tradeMark
            })
        }
    };

export const reqDeleteTradeMark =
    (id) => request({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'delete'
    });
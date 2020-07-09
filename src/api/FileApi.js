//查询商品列表
import request from '../utils/request';

export const removeImg = query => {
    return request({
        url: 'v1/file/remove/img',
        method: 'post',
        data: query
    });
};
import axios from 'axios'

export function getGoods (queryInfo) {
    return axios({
        url:'goods',
        method:'get',
        params:queryInfo
    })
}

export function deleteGoods (id) {
    return axios({
        url:'goods/'+id,
        method:'delete',

    })
}

export function addGoods (data) {
    return axios({
        url:'goods',
        method:'post',
        data:data
    })
}

export function addParmas (cateId, data) {
    return axios({
        url:`categories/${cateId}/attributes`,
        method:'get',
        params:data
    })
}

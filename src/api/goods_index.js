import axios from '../utils/myaxios'

export const getGoodsList = (params) => {
    return axios({
        url: 'goods',
        params
    })
}

export const addGoods = (data) => {
    return axios({
        url: 'goods',
        method: 'post',
        data
    })
}
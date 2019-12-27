import axios from '../utils/myaxios'

export const getGoodsList = (params) => {
    return axios({
        url:'goods',
        params
    })
}
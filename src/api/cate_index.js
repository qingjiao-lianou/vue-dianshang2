import axios from '../utils/myaxios'

export const getGoodsCate = (type) => {
    return axios({
        url:'categories',
        params:{type}
    })
}
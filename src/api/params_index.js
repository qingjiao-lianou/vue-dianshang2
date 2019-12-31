import axios from '../utils/myaxios'

export const getGoodsParams = (id, sel) => {
    return axios({
        url: `categories/${id}/attributes`,
        params: { sel }
    })
}
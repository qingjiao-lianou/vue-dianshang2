import axios from '../utils/myaxios'

// 获取用户列表数据
export const getUserList = (params) => {
    return axios({
        url:'users',
        params
    })
}
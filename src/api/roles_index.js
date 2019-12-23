import axios from '../utils/myaxios'

// 获取角色列表
export const getRoleList = () => {
    return axios({
        url:'roles',
    })
}
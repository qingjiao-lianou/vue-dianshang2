import axios from '../utils/myaxios'

// 获取权限列表
export const getRightList = (type) => {
    return axios({
        url:`rights/${type}`
    })
}

// 获取左侧菜单
export const getLeftMenu = () => {
    return axios({
        url:'menus'
    })
}
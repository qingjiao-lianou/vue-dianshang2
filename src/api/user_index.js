import axios from '../utils/myaxios'

// 获取用户列表数据
export const getUserList = (params) => {
    return axios({
        url: 'users',
        params
    })
}

// 添加用户
export const getAddUsers = (data) => {
    return axios({
        url: 'users',
        method: 'post',
        data
    })
}

// 编辑用户
export const getEditUsers = (data) => {
    return axios({
        url: `users/${data.id}`,
        method: 'put',
        data
    })
}

// 分配角色
export const getAllotRole = (data) => {
    return axios({
        url: `users/${data.id}/role`,
        method: 'put',
        data: { rid: data.rid }
    })
}

// 删除用户
export const getDeluser = (id) => {
    return axios({
        url: `users/${id}`,
        method: 'delete'
    })
}

// 修改用户状态
export const ChangeStatus = (uid, type) => {
    return axios({
        url: `users/${uid}/state/${type}`,
        method: 'put'
    })
}
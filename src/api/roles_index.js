import axios from '../utils/myaxios'

// 获取角色列表
export const getRoleList = () => {
    return axios({
        url: 'roles',
    })
}

// 删除指定角色的权限
export const delRoleRight = (roleId, rightId) => {
    return axios({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}

// 为指定的角色授权
export const roleAuth = (roleId, rids) => {
    return axios({
        url: `roles/${roleId}/rights`,
        method:'post',
        data: { rids }
    })
}
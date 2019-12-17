import axios from '../utils/myaxios.js'

export const loginRequest = (data) => {
    return axios({
        url:'login',
        method:'post',
        data
    })
}
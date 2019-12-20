import axios from '../utils/myaxios'

export const loginRequest = (data) => {
    return axios({
        url:'login',
        method:'post',
        data
    })
}
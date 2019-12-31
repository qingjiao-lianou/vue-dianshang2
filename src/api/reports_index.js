import axios from '../utils/myaxios'

export const getReportsData = (type) => {
    return axios({
        url:`reports/type/${type}`
    })
}
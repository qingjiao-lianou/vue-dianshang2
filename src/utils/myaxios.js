import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 拦截器
axios.interceptors.request.use(function (config) {
    // 获取token
    const mytoken = localStorage.getItem('token')
    if (mytoken) {
        config.headers.Authorization = mytoken
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

export default axios

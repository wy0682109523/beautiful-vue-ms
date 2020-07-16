import axios from 'axios';

//以自定义配置创建实例
const service = axios.create({
    timeout: 5000
});

//请求拦截器
service.interceptors.request.use(
    config => {
        //配置全局token
        let token = localStorage.getItem('ms_token');

        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

//响应拦截器
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            return Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

//一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量
//使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载,其他模块加载该模块时，import命令可以为该匿名函数指定任意名字
export default service;

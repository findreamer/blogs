import { axios } from '.'


export const getVerifyCode = (email: string, code: string) => {
    return axios.get(`/users/getVerifyCode?email=${email}&code=${code}`);
};

export const register = (params: {
    email: string;
    passsword: string
    code: string
}) => {
    return axios.post(`/users/register`, params)
}


export const login = (params: {
    email: string;
    password: string
}) => {
    return axios.post(`/users/login`, params)
}

export const logout = () => {
    return axios.get(`/users/logout`)
}


export const getUserInfoById = (id: number) => {
    return axios.get('/users/getUserInfo/' + id)
}

export const updateUserInfo = (userInfo: {
    username: string;
    info: string;
    avatar: string;
}) => {
    return axios.post('/users/updateUserInfo', userInfo)
}

export const getUserInfo = () => {
    return axios.get('/users/getUserInfo')
}

export const uploadFile = (data: FormData) => {
    return axios.post('/common/upload', data)
}
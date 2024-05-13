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
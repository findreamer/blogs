import { axios } from '.'


export const getVerifyCode = (email: string, code: string) => {
    return axios.get(`/users/getVerifyCode?email=${email}&code=${code}`);
};
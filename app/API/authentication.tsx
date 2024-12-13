import {API} from "../api";

const ENDPOINTS = {
    postUserLoginInfo:() =>`api/user/login2`,
    postUserRegisIndo:() =>'api/user/register'
}

const userLogin = async (payload:Object) => {
    try {
        const api = await API();
        const response = await api.post(ENDPOINTS.postUserLoginInfo(), payload);
        return response.data;
    } catch (error: unknown) {
        return null;
    }
};

const userRegister = async (payload:Object) => {
    try {
        const api = await API();
        const response = await api.post(ENDPOINTS.postUserRegisIndo(), payload);
        return response.data;
    } catch (error: unknown) {
        return null;
    }
};

export {userLogin, userRegister}
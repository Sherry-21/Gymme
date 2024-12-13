import {API} from "../api";

const ENDPOINTS = {
    postWeight: () => `api/weight`,
    getWeight: (page:string, limit:string) => `api/weight?page=${page}&limit=${limit}`,
    getLatest: () => `weight/latest`
}

const getWeight = async () => {
    try {
        const api = await API();
        console.log(ENDPOINTS.getWeight('0', '20'))
        const response = await api.get(ENDPOINTS.getWeight('0', '50'));
        console.log(response.data)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const postWeight = async (payload:Object) => {  
    try {
        console.log("HIT KE SINI")
        console.log(payload)
        const api = await API();
        const response = await api.post(ENDPOINTS.postWeight(), payload);
        console.log(response)
        console.log("FINISH")
        return response.data;
    } catch (error: unknown) {
        console.log("HIT HERE")
        console.log(error)
        return null;
    }
};

const getLatest =  async () => {
    try {

        const api = await API();
        const response = await api.post(ENDPOINTS.getLatest());
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
}

export {getWeight, postWeight, getLatest}

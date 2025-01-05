import {API} from "../api";

const ENDPOINTS = {
    postWeight: () => `api/weight`,
    getWeight: (firstDate:string, lastDate:string) => `api/weight/date?date_from=${firstDate}&date_to=${lastDate}`,
    getLatest: () => `api/weight/latest`
}

const getWeight = async (firstDate:string, lastDate:string) => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getWeight(firstDate, lastDate));
        console.log(response.data)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const postWeight = async (payload:Object) => {  
    try {
        console.log(payload)
        const api = await API();
        const response = await api.post(ENDPOINTS.postWeight(), payload);
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const getLatest =  async () => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getLatest());
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
}

export {getWeight, postWeight, getLatest}

import {API} from "../api";

const ENDPOINTS = {
    getProfileById:() =>`/api/profile`,
    getWeight: () => `/api/weight`,
    deleteWeight: (weight_id:number) => `api/weight/delete/${weight_id}`
}

const getProfileById = async () => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getProfileById());
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const postProfileById = async (payload:Object) => {
    try {
        const api = await API();
        const response = await api.put(ENDPOINTS.getProfileById(), payload);
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

export {getProfileById, postProfileById}

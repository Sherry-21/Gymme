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

// const getWeight = async () => {
//     try {
//         const api = await API();
//         const response = await api.get(ENDPOINTS.getWeight());
//         return response.data;
//     } catch (error: unknown) {
//         console.log(error)
//         return null;
//     }
// };

// const postWeight = async () => {
//     try {
//         const api = await API();
//         const response = await api.post(ENDPOINTS.getWeight());
//         return response.data;
//     } catch (error: unknown) {
//         console.log(error)
//         return null;
//     }
// };

// const deleteWeight = async (weight_id:number) => {
//     try {
//         const api = await API();
//         const response = await api.delete(ENDPOINTS.deleteWeight(weight_id));
//         return response.data;
//     } catch (error: unknown) {
//         console.log(error)
//         return null;
//     }
// };

export {getProfileById}

import {API} from "../api";

const ENDPOINTS = {
    getPageBySearch: (equipmentKey:string) => `/api/equipment?equipment_key=${equipmentKey}`,
    getAllCourse: (id:number) => `/api/equipment/course/${id}`,
    getCourseById: (id:number) => `/api/equipment/course/by-id/${id}`,
} 

const getPageBySearch = async (equipmentKey:string) => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getPageBySearch(equipmentKey));
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const getAllCourse = async (id:number) => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getAllCourse(id));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const getCourseById = async (id:number) => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getCourseById(id));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
}

export {getPageBySearch, getAllCourse, getCourseById}


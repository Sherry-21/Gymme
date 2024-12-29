import {API} from "@/app/api";
import axios from "axios";
import { router } from "expo-router";

const ENDPOINTS = {
    getInformationById:(id:number) =>`/api/information/by-id/${id}`,
    getAllInformationByPagination: (page:string, limit:string) => `/api/information?page=${page}&limit=${limit}`,
    getAllInformationBySearch: (page:string, limit:string, name:string) => `/api/information/search?key_filter=${name}&page=${page}&limit=${limit}`
}

const getInformationById = async (id: number) => {
    try {
        if (!id) throw new Error("ID is required to fetch information.");
        const api = await API();
        const response = await api.get(ENDPOINTS.getInformationById(id));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

//deprecated
const getAllInformationByPagination = async (page:string, limit:string) => {    
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getAllInformationByPagination(page, limit));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const getAllInformationBySearch = async (page:string, limit:string, name:string) => {    
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getAllInformationBySearch(page, limit, name));
        console.log(response)
        console.log("HIT HERE1")
        return response.data;
    } catch (error: unknown) {
        console.log("OR HIT HERE?")
        console.log(error)
        return null;
    }
};

export {getInformationById, getAllInformationByPagination, getAllInformationBySearch}
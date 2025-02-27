import {API} from "../api";

const ENDPOINTS = {
    getEventCalendar:(date:string) =>`api/event/by-date?event_date=${date}`,
    insertCalendar:() =>'api/event/',
    updateCalendar:(id:number) => `api/event/${id}`,
    deleteCalendar:(id:number) => `api/event/delete/${id}`
}

const updateCalendar = async (payload:Object, id:number) => {
    try {
        const api = await API();
        const response = await api.put(ENDPOINTS.updateCalendar(id), payload);
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        return null;
    }
};

const deleteCalendar = async (id:number) => {
    try {
        const api = await API();
        const response = await api.delete(ENDPOINTS.deleteCalendar(id));
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        return null;
    }
};


const insertCalendar = async (payload:Object) => {
    try {
        const api = await API();
        const response = await api.post(ENDPOINTS.insertCalendar(), payload);
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        return null;
    }
};

const getEventCalendar = async (date:string) => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getEventCalendar(date));
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        return null;
    }
};  

export {updateCalendar, deleteCalendar, getEventCalendar, insertCalendar}
import {API} from "../api";

const ENDPOINTS = {
    getTimer: () => `api/timer`,
    getTimerQueue:(id:number) =>`/api/timer/queue/${id}`,
    deleteQueue: (id:number) => `/api/timer/queue/${id}`,
    deleteTimer: (id:number) => `api/timer/delete/${id}`,
    insertQueue: () => `api/timer/queue`,
    insertTimer: () => `api/timer`
}

const getTimer = async () => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getTimer());
        console.log(response.data)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const postTimer = async (payload:Object) => {
    try {
        const api = await API();
        const response = await api.post(ENDPOINTS.getTimer(), payload);
        console.log(response.data)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const getTimerQueue = async (id:number) => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.getTimerQueue(id));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const deleteQueue = async (id:number) => {
    try {
        const api = await API();
        const response = await api.delete(ENDPOINTS.deleteQueue(id));
        console.log(response.data)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const insertQueue = async (id:number, payload:Object) => {
    try {
        console.log(id)
        console.log(payload)
        const api = await API();
        const response = await api.post(ENDPOINTS.insertQueue(), payload);
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const insertTimer = async () => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.insertTimer());
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const deleteTimer = async (id:number) => {
    try {
        const api = await API();
        const response = await api.delete(ENDPOINTS.deleteTimer(id));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
}

export {getTimer, postTimer, deleteTimer, getTimerQueue, deleteQueue, insertQueue, insertTimer}

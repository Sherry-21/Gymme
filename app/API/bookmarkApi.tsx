import {API} from "../api";

const ENDPOINTS = {
    bookmarkList: (information_id:number) =>`/api/bookmark/${information_id}`,
    bookmark: () => `/api/bookmark`,
    eqBookmarkList: (information_id:number) =>`/api/equipment/bookmark/${information_id}`,
    eqBookmark: () => `/api/equipment/bookmark`
}

const postBookmarkList = async (information_id:number) => {
    try {
        const api = await API();
        const response = await api.post(ENDPOINTS.bookmarkList(information_id));
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const deleteBookmarkList = async (information_id:number) => {
    try {
        const api = await API();
        const response = await api.delete(ENDPOINTS.bookmarkList(information_id));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const getBookmarkList = async () => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.bookmark());
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
}

const postEqBookmarkList = async (information_id:number) => {
    console.log(information_id)
    try {
        const api = await API();
        const response = await api.post(ENDPOINTS.eqBookmarkList(information_id));
        console.log(response)
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const deleteEqBookmarkList = async (information_id:number) => {
    console.log(information_id)
    try {
        const api = await API();
        const response = await api.delete(ENDPOINTS.eqBookmarkList(information_id));
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
};

const getEqBookmarkList = async () => {
    try {
        const api = await API();
        const response = await api.get(ENDPOINTS.eqBookmark());
        return response.data;
    } catch (error: unknown) {
        console.log(error)
        return null;
    }
}

export {postBookmarkList, deleteBookmarkList, getBookmarkList, postEqBookmarkList, deleteEqBookmarkList, getEqBookmarkList}
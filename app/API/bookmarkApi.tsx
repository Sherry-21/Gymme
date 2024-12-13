import {API} from "../api";

const ENDPOINTS = {
    bookmarkList: (information_id:number) =>`/api/bookmark/${information_id}`,
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

export {postBookmarkList, deleteBookmarkList}
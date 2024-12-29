import { API } from "../api";

const ENDPOINTS = {
  getPageBySearch: (equipmentKey: string) =>
    `/api/equipment?equipment_key=${equipmentKey}`,
  getSearchHistory: () => `/api/equipment/history`,
  deleteSearchHistory: (id: number) => `/api/equipment/history/${id}`,
  aiSearch: (publicId: string) =>
    `/api/equipment/ai?cloudinary_public_id=${publicId}`,
};

const getPageBySearch = async (equipmentKey: string) => {
  try {
    const api = await API();
    const response = await api.get(ENDPOINTS.getPageBySearch(equipmentKey));
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
};

const getSearchHistory = async () => {
  try {
    const api = await API();
    const response = await api.get(ENDPOINTS.getSearchHistory());
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
};

const deleteSearchHistory = async (id: number) => {
  try {
    const api = await API();
    const response = await api.delete(ENDPOINTS.deleteSearchHistory(id));
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
};

const aiSearch = async (publicId: string) => {
  try {
    const api = await API();
    const response = await api.post(ENDPOINTS.aiSearch(publicId));
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
};

export { getPageBySearch, getSearchHistory, deleteSearchHistory, aiSearch };

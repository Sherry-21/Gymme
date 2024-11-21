import API from "@/app/api";
import axios from "axios";

const ENDPOINTS = {
    getInformationById:() =>'api/information/by-id/1',
    // get
}

const getInformationById = async (id: number) => {
    // "information_id": 1,
    //     "information_header": "Header",
    //     "information_date_created": "2024-11-17T13:51:29.98Z",
    //     "information_created_by_user_id": 1,
    //     "information_body": null,
    //     "information_type_id": 1,
    try {
        if (!id) throw new Error("ID is required to fetch information.");

        const response = await API.get(ENDPOINTS.getInformationById());
        // console.log(response.data);
        console.log("sdkjasnkjdbaskjdbas");
        return response.data;
    } catch (error: unknown) {
        console.log("ini error bos");
        console.error(error)
        // Narrow down the error type
        if (axios.isAxiosError(error)) {
            // AxiosError-specific handling
            if (error.response) {
                console.error(
                    `Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`
                );
            } else if (error.request) {
                console.error("Error: No response received from server.", error.request);
            } else {
                console.error("Error: Axios setup issue.", error.message);
            }
        } else if (error instanceof Error) {
            // General Error handling
            console.error("Error:", error.message);
        } else {
            // Fallback for unknown error types
            console.error("An unknown error occurred:", error);
        }

        throw error; // Rethrow error for the caller to handle
    }
};


export {getInformationById}
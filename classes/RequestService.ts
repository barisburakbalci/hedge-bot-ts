import axios from "axios";
import { HttpMethod } from "../Enums";

class RequestService {
    public static async Send(method: HttpMethod, URL: string) {
        try {
            return await this[method](URL);
        } catch (error: any) {
            console.error("---- REQUEST ERROR ----");
            console.error(URL);
            console.error("Binance Message:", error?.response?.data?.msg, error);
            if (!error?.response?.data?.msg) {
                console.error(error);
            }
            throw new Error("Request Error");
        }
    }
    public static async GET(URL: string) {
        return await axios.get(URL);
    }
    public static async POST(URL: string) {
        return await axios.post(URL);
    }
    public static async PUT(URL: string) {
        return await axios.put(URL);
    }
    public static async PATCH(URL: string) {
        return await axios.patch(URL);
    }
    public static async DELETE(URL: string) {
        return await axios.delete(URL);
    }
}

export default RequestService;
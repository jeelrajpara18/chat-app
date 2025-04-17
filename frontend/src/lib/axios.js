import { HOST } from "../utils/constants";
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : HOST,
    withCredentials : true
})
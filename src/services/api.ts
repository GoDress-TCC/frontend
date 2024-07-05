import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');
        return token;
    } catch (error) {
        console.error("Erro:", error);
        return null;
    }
};

const Api = axios.create({
    baseURL: "http://localhost:3000/api",
});

Api.interceptors.request.use(
    async config => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default Api;

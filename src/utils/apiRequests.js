import axios from "axios";

const newApiRequest = async (url, method, data,
    headers = {
        'Content-Type': 'application/json',
    }) => {

    try {
        const response = await axios({
            url: `${import.meta.env.VITE_BASE_URL}${url}`,
            method,
            data,
            headers,
            withCredentials: true,
        });
        
        //console.log(`🟢 ${response.status}: ${url} ${method} ${JSON.stringify(data)}`, response);
        return response.data;

    } catch (error) {
        console.log(`🔺 ${error.message}: ${url} ${method} ${JSON.stringify(data)}`, error.response.data);
        return { error: error.message, ...error.response.data };
    }
}

export default newApiRequest
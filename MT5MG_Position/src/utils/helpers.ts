import { IResponse } from "../types/response";
import 'dotenv/config'

export const sendMessageToUser = (data: IResponse): void => {
    postData(String(process.env.TICK_SERVER_URL), data, '/send-message');
}

const postData = async (url: string, data: any, endPoint: string) => {
    try {
        const response = await fetch(url + endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
    }
}
import axios from "axios";

const API_KEY = "55935956-ece2cee4535cd5803e1c6407f";
const BASE_URL = "https://pixabay.com/api/";

// page parametresini dışarıdan alıyoruz, per_page değerini 40 yapıyoruz
export async function fetchImages(query, page = 1) {
    const searchParams = {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        page: page,
        per_page: 40 // Ödev gereği 40 nesne dönecek şekilde güncelledik
    };

    const response = await axios.get(BASE_URL, { params: searchParams });
    return response.data;
}
import axios from "axios";
//==1. http-request + axios + api key
export default async function galleryFetch(value, page) {
    const url = 'https://pixabay.com/api/';
    const key = '32854476-805ee57f77a30afa60c0542ae';
    const filter = `?key=${key}&q=${value}&image_type=photo
&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    
    return await axios.get(`${url}${filter}`)
        .then(response => response.data);
}

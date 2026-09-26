import axios from 'axios';

const API_URL = 'https://quoteslate.vercel.app/api';

export const getRandomQuote = async (selectedTag = null) => {
    // TODO 17 [Dynamic Endpoint Interpolation]:
    // Kapag may napiling tag, idadagdag ang ?tags=[selectedTag]
    const endpoint = selectedTag 
        ? `${API_URL}/quotes/random?tags=${selectedTag}` 
        : `${API_URL}/quotes/random`;

    try {
        // TODO 18 [Asynchronous Request Handling]:
        const response = await axios.get(endpoint);
        const { quote, author, tags } = response.data;

        return {
            text: quote,
            author: author,
            tags: tags || []
        };
        
    } catch (error) {
        // TODO 19 [Resilient System Fallbacks]:
        return {
            text: "Acquaintances we meet, enjoy, and can easily leave behind; but friendship grows deep roots.",
            author: "H. Jackson Brown Jr.",
            tags: ["friendship", "inspiration", "motivation"]
        };
    }
};

export const getTags = async () => {
    // TODO 20 [Asynchronous List Retrieval]:
    try {
        const response = await axios.get(`${API_URL}/tags`);
        return response.data; // Nagbabalik ng array ng tags mula sa API
    } catch (error) {
        return ["friendship", "inspiration", "motivation"];
    }
};
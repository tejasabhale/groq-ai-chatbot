import api from "../api/axios";

const generateResponse = async (prompt) => {
  const { data } = await api.post("/generate", { prompt });
  return data;
};

const aiService = {
  generateResponse,
};

export default aiService;

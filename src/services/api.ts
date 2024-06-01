import axios from 'axios';

const API_BASE_URL = 'https://665b482b003609eda4606f07.mockapi.io';

export const fetchQuestions = async () => {
  const response = await axios.get(`${API_BASE_URL}/questions`);
  return response.data.map((question: any) => ({
    ...question,
    options: JSON.parse(question.options)
  }));
};

export const createQuestion = async (question: any) => {
  const payload = {
    ...question,
    options: JSON.stringify(question.options)
  };
  const response = await axios.post(`${API_BASE_URL}/questions`, payload);
  return response.data;
};

export const deleteQuestion = async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/questions/${id}`);
    return response.data;
  };
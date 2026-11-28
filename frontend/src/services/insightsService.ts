
import api from './api';

export interface ProductivityInsights {
  statistics: {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    completion_rate: number;
  };
  gemini_insights: string;
  groq_insights: string;
}

const getProductivityInsights = async (): Promise<ProductivityInsights> => {
  const response = await api.get('/insights/');
  return response.data;
};

export default { getProductivityInsights };

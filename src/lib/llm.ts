import OpenAI from 'openai';

// Initialize the OpenAI SDK pointing to Qwen Cloud
export const llm = new OpenAI({
  apiKey: process.env.QWEN_API_KEY || process.env.OPENAI_API_KEY || '',
  baseURL: process.env.QWEN_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

// Use qwen-plus for reasoning tasks
export const MODEL = process.env.QWEN_MODEL || 'qwen-plus';

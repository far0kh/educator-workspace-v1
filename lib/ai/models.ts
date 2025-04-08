export const DEFAULT_CHAT_MODEL: string = 'chat-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'General Chat',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-educator',
    name: 'Course Creator',
    description: 'Custom model for creating courses and educational content',
  },
];

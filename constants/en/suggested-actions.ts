interface SuggestedAction {
  title: string;
  label: string;
  action: string;
}

interface ModelSuggestions {
  [key: string]: SuggestedAction[];
}

const SuggestedActions: ModelSuggestions = {
  'chat-model': [
    {
      title: 'What are the advantages',
      label: 'of using AI in Education?',
      action: 'What are the advantages of using AI in Education?',
    },
    {
      title: 'Write code to',
      label: `demonstrate djikstra's algorithm`,
      action: `Write code to demonstrate djikstra's algorithm, use artifacts`,
    },
    {
      title: 'Help me write an essay',
      label: `about silicon valley`,
      action: `Help me write an essay about silicon valley`,
    },
    {
      title: 'What is the weather',
      label: 'in San Francisco?',
      action: 'What is the weather in San Francisco?',
    },
  ],
  'chat-model-educator': [
    {
      title: 'Create a lesson plan',
      label: 'about machine learning basics',
      action: 'Create a lesson plan about machine learning basics',
    },
    {
      title: 'Design a quiz',
      label: 'on Python programming',
      action: 'Design a quiz on Python programming',
    },
    {
      title: 'Explain',
      label: 'neural networks to beginners',
      action: 'Explain neural networks to beginners',
    },
  ],
};

export default SuggestedActions;

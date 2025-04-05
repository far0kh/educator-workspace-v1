import next from "next";

const Pages = {
  submitEducator: {
    back: "Back",
    next: "Next",
    submit: "Sign Up",
  },
  chat: {
    welcome: {
      hello: "Hello",
      description: "Welcome to your workspace. Let's get started!",
      prompts: ["I want to create a new course.", "I want to view my courses."],
    },
    sidebar: {
      title: "Frequently Asked Questions",
      settings: "Settings",
    },
    messages: {
      waiting: "Please wait",
      thinking: "🤖💜",
    },
    input: {
      placeholder: "Type your message here...",
    },
    clear: {
      button: "Clear Messages",
    },
  },
};

export default Pages;

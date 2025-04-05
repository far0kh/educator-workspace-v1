const SignUpSteps = [
  {
    id: 'name',
    title: 'Introduction',
    subtitle: 'Hello, what\'s your name?',
    label: 'Name',
    placeholder: 'Enter your full name',
    description: 'You will be known by this name in the educational ecosystem.',
    errorMessage: 'Name must be between 2 and 32 characters.',
  },
  {
    id: 'premiumTier',
    title: 'Account Type',
    subtitle: 'Which account type do you choose?',
    label: 'Account',
    placeholder: 'Account Type',
    description: 'Choose your account type based on your needs.',
    errorMessage: 'Please select your account type.',
  },
  {
    id: 'terms',
    title: 'Final Step',
    subtitle: 'Just one more step. Do you agree to the terms and conditions?',
    label: 'I Agree',
    placeholder: '',
    description: 'Read the terms of use.',
    errorMessage: 'This field is required.',
  },
];

export default SignUpSteps;

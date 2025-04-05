const SignUpSteps = [
  {
    id: 'name',
    title: 'آشنایی',
    subtitle: 'سلام، اسم شما چیست؟',
    label: 'نام',
    placeholder: 'نام کامل خود را وارد کنید',
    description: 'شما در اکوسیستم آموزشی به این نام شناخته می‌شوید.',
    errorMessage: 'نام باید بین ۲ تا ۳۲ کاراکتر باشد.',
  },
  {
    id: 'premiumTier',
    title: 'نوع اکانت',
    subtitle: 'کدام اکانت را انتخاب می‌کنید؟',
    label: 'اکانت',
    placeholder: 'نوع اکانت',
    description: 'نوع اکانت را بر اساس نیاز خود انتخاب کنید.',
    errorMessage: 'لطفا نوع اکانت خود را انتخاب کنید.',
  },
  {
    id: 'terms',
    title: 'مرحله آخر',
    subtitle: 'فقط یک مرحله دیگر باقی مانده است. آیا با شرایط و قوانین استفاده موافق هستید؟',
    label: 'موافقم',
    placeholder: '',
    description: 'قوانین استفاده را مطالعه کنید.',
    errorMessage: 'پر کردن این قسمت اجباری است.',
  },
];

export default SignUpSteps;


export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};


export const isValidUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username.trim());
};

export const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};


export const isValidPhoneNumber = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const validateOTP = (otp)=>{
  const regex = /^\d{6}$/;
  return regex.test(otp);
}

export const doPasswordsMatch = (pass1, pass2) => {
  return pass1 === pass2;
};


export const validateProfileForm = (formData) => {
  const errors = {};

  if (!formData.userName || !formData.userName.trim()) {
    errors.userName = "Username is required";
  } else if (formData.userName.trim().length < 3) {
    errors.userName = "Username must be at least 3 characters";
  }

  if (!formData.companyName || !formData.companyName.trim()) {
    errors.companyName = "companyName is required";
  } else if (formData.companyName.trim().length < 3) {
    errors.companyName = "companyName must be at least 3 characters";
  }

 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }


  const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
  if (!formData.phoneNumber || !formData.phoneNumber.toString().trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  }

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

 if (!formData.linkedIn || !formData.linkedIn.trim()) {
    errors.linkedIn = "LinkedIn URL is required";
  } else if (!urlRegex.test(formData.linkedIn)) {
    errors.linkedIn = "Please enter a valid LinkedIn URL";
  }

  if (!formData.twitter || !formData.twitter.trim()) {
    errors.twitter = "Twitter URL is required";
  } else if (!urlRegex.test(formData.twitter)) {
    errors.twitter = "Please enter a valid Twitter URL";
  }

  if (!formData.web || !formData.web.trim()) {
    errors.web = "Website URL is required";
  } else if (!urlRegex.test(formData.web)) {
    errors.web = "Please enter a valid website URL";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const formatProfileData = (formData) => {
  const formatted = { ...formData };

  formatted.phoneNumber =
  formData.phoneNumber && formData.phoneNumber.toString().trim()
    ? Number(formData.phoneNumber.toString().replace(/[\s\-()]/g, ''))
    : null;

  [ 'linkedIn', 'twitter', 'web'].forEach(site => {
    if (formatted[site] && !formatted[site].match(/^https?:\/\//)) {
      formatted[site] = `https://${formatted[site]}`;
    }
  });

  return formatted;
};

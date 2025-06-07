export const validateProfileForm = (formData) => {
  const errors = {};


  if (!formData.userName || !formData.userName.trim()) {
    errors.userName = "Username is required";
  } else if (formData.userName.trim().length < 3) {
    errors.userName = "Username must be at least 3 characters";
  }

 
  if (!formData.position || !formData.position.trim()) {
    errors.position = "Position is required";
  } else if (formData.position.trim().length < 3) {
    errors.position = "Position must be at least 3 characters";
  }

  if (!formData.experienceLevel || !formData.experienceLevel.trim()) {
    errors.experienceLevel = "Experience is required";
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


  if (!formData.address || !formData.address.trim()) {
    errors.address = "Address is required";
  }

  if (typeof formData.skills === 'string') {
    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      errors.skills = "Please enter at least one skill";
    }
  } else if (!Array.isArray(formData.skills) || formData.skills.length === 0) {
    errors.skills = "Please enter at least one skill";
  }

  if (!formData.about || !formData.about.trim()) {
    errors.about = "Please tell us about yourself";
  } else if (formData.about.trim().length < 20) {
    errors.about = "About section should be at least 20 characters";
  }

  // Price
  if (!formData.pricePerHour || !formData.pricePerHour.toString().trim()) {
    errors.pricePerHour = "Price per hour is required";
  } else if (isNaN(Number(formData.pricePerHour))) {
    errors.pricePerHour = "Price must be numeric";
  }

  // Optional URLs
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  if (formData.gitHub && !urlRegex.test(formData.gitHub)) {
    errors.gitHub = "Please enter a valid GitHub URL";
  }
  if (formData.linkedIn && !urlRegex.test(formData.linkedIn)) {
    errors.linkedIn = "Please enter a valid LinkedIn URL";
  }
  if (formData.twitter && !urlRegex.test(formData.twitter)) {
    errors.twitter = "Please enter a valid Twitter URL";
  }
  if (formData.web && !urlRegex.test(formData.web)) {
    errors.web = "Please enter a valid website URL";
  }

  if (!Array.isArray(formData.languages) || formData.languages.length === 0) {
    errors.languages = "At least one language is required";
  } else {
    formData.languages.forEach((language, index) => {
      if (!language.name || !language.name.trim()) {
        errors.languages = `Language ${index + 1}: Name is required`;
      }
      if (!language.proficiency || !['Beginner', 'Intermediate', 'Fluent', 'Native'].includes(language.proficiency)) {
        errors.languages = `Language ${index + 1}: Valid proficiency level is required`;
      }
    });
  }

  if (!Array.isArray(formData.education) || formData.education.length === 0) {
    errors.education = "At least one education entry is required";
  } else {
    formData.education.forEach((edu, index) => {
      if (!edu.degree || !edu.degree.trim()) {
        errors.education = `Education ${index + 1}: Degree is required`;
      }
      if (!edu.institution || !edu.institution.trim()) {
        errors.education = `Education ${index + 1}: Institution is required`;
      }
      if (!edu.year || !edu.year.trim()) {
        errors.education = `Education ${index + 1}: Year is required`;
      } else if (!/^\d{4}$/.test(edu.year.trim())) {
        errors.education = `Education ${index + 1}: Year must be a valid 4-digit number`;
      }
    });
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

  formatted.pricePerHour = formData.pricePerHour
    ? parseFloat(formData.pricePerHour.toString().replace(/[$\s]/g, ''))
    : null;

  if (typeof formData.skills === 'string') {
    formatted.skills = formData.skills.trim()
      ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      : [];
  }

   formatted.languages = Array.isArray(formData.languages)
    ? formData.languages
        .filter(lang => lang.name && lang.name.trim() && lang.proficiency)
        .map(lang => ({
          name: lang.name.trim(),
          proficiency: lang.proficiency,
        }))
    : [];

  // Format education
  formatted.education = Array.isArray(formData.education)
    ? formData.education
        .filter(edu => edu.degree && edu.degree.trim() && edu.institution && edu.institution.trim() && edu.year && edu.year.trim())
        .map(edu => ({
          degree: edu.degree.trim(),
          institution: edu.institution.trim(),
          field: edu.field ? edu.field.trim() : '',
          year: edu.year.trim(),
        }))
    : [];

  ['gitHub', 'linkedIn', 'twitter', 'web'].forEach(site => {
    if (formatted[site] && !formatted[site].match(/^https?:\/\//)) {
      formatted[site] = `https://${formatted[site]}`;
    }
  });

  return formatted;
};

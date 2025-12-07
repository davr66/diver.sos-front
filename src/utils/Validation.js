export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password, minLength = 6) => {
  if (password.length < minLength) {
    return `A senha deve ter pelo menos ${minLength} caracteres`;
  }
  return null;
};

export const validateRequired = (fields) => {
  for (const [value] of Object.entries(fields)) {
    if (!value.trim()) {
      return 'Por favor, preencha todos os campos';
    }
  }
  return null;
};

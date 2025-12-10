export const getStoredUser = () => {
  const raw = localStorage.getItem('authUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user, token) => {
  if (user) {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

export const clearStoredUser = () => {
  localStorage.removeItem('authUser');
  localStorage.removeItem('authToken');
};

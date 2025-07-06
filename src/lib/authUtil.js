let logoutCallback = null;

export const registerLogoutCallback = (logoutFn) => {
  logoutCallback = logoutFn;
};

export const triggerLogout = () => {
  localStorage.removeItem('authToken');
  if (logoutCallback) {
    logoutCallback();
  }
};

export const apiRequest = async (
  fn,
  message = 'Something went wrong, please try again later.'
) => {
  try {
    const response = await fn();
    return response?.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || message;
    console.log(error, errorMessage);
  }
};

export const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('http')
  ) {
    return path;
  }
  const base = import.meta.env.VITE_IMAGE_BASE_URL;
  return `${base}${path}`;
};

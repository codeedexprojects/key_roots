export const getImageUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('http')
  ) {
    return path;
  }
  const base = import.meta.env.VITE_IMAGE_BASE_URL;
  return `${base}/${path}`;
};

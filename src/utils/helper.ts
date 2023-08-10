import path from 'path';

export const generateUUID = () => {
  let d = new Date().getTime();
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now(); // Use high-precision timer if available
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
};

export const transformNameToUrl = (str: string): string => {
  return `${str.toLowerCase().split(' ').join('-')}-${Date.now()}`;
};

export const createUploadsFolder = (folderName: string) => {
  return path.join(process.cwd(), folderName);
};

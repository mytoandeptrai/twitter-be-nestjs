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

export const parseJson = (data: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing json', error);
  }
  return null;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
  } catch (error) {
    return false;
  }
  return true;
};

export const removeDuplicateObjectInArray = (list) =>
  list.filter((item, index) => {
    const _item = JSON.stringify(item);
    return (
      index ===
      list.findIndex((obj) => {
        return JSON.stringify(obj) === _item;
      })
    );
  });

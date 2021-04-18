export const isNotEmptyString = (str) => {
  if (typeof str !== 'string') return false;
  return (str.length > 0);
};

export const isNotEmptyArray = (arr) => {
  if (!Array.isArray(arr)) return false;
  return (arr.length > 0);
}

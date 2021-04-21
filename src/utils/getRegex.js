export const getRegex = (str, options = 'i') => {
  // /class\s*=\s*['"](\S+)['"]/;
  return new RegExp(`${str}\\s*=\\s*['"](\\S+)['"]`, 'i');
}

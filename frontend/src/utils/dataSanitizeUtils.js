export const retainDigits = (dataStr) => {
  const removeLeadingZeros = dataStr.replace(/^0+(?=\d)/, "");
  return removeLeadingZeros.replace(/[^\d]/g, "");
};

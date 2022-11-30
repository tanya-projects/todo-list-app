/**
 * Style Title with first letter uppercased by desctructuring title as an Array
 * @param {string} title - inserted title
 * @returns {string} - inserted title with Uppercased first letter
 */
export const StyleTextTitle = (title) => {
  // make first letter capitalize
  const [first, ...other] = title;
  const updatedText = [first.toUpperCase(), ...other].join('');
  return updatedText;
};

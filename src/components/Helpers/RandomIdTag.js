/**
 * Generate Random Id Tag used in $.map() for key values
 * Creates 3 Arrays of possible symbols ([a-z], [A-Z], [0-9]), then transforming in 1 Array, which then used for generating tag
 * @returns {string} - Random 5-Symbol String
 */
export const RandomIDTag = () => {
  let allSymbols = [];
  // loop for adding uppercase letters (charcode from 65)
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    allSymbols.push(letter);
  }
  // loop for adding lowercase letters (charcode from 97)
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i);
    allSymbols.push(letter);
  }
  // loop for adding digits
  for (let num = 0; num < 10; num++) {
    allSymbols.push(num);
  }

  let randomTag = [];
  for (let sym = 0; sym < 5; sym++) {
    // add random symbol from all symbols array to Random tag
    const symIndex = Math.floor(Math.random() * allSymbols.length);
    randomTag.push(allSymbols[symIndex]);
  }

  return randomTag.join('');
};

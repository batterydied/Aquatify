/**
 * Validates if a given zip code is a 5-digit number.
 * @param zipCode - The zip code to validate (as a string or number).
 * @returns {boolean} - True if the zip code is valid, false otherwise.
 */
export function isValidZipCode(zipCode: string | number): boolean {
    // Convert to string in case the input is a number
    const zipCodeStr = zipCode.toString();
  
    // Check if the zip code is exactly 5 digits and contains only numbers
    return /^\d{5}$/.test(zipCodeStr);
  }
  
  export default isValidZipCode;
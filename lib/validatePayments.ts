// Validate card number (using Luhn algorithm for credit card validation)
export const validateCardNumber = (cardNumber: string): boolean => {
    const cleanedCardNumber = cardNumber.replace(/\D/g, ""); // Remove non-numeric characters
    return /^\d{13,19}$/.test(cleanedCardNumber); // Check if it's a valid length and numeric
};

  // Validate expiry month (MM)
export const validateExpiryMonth = (expiryMonth: string): boolean => {
    const month = parseInt(expiryMonth, 10);
    return /^\d{2}$/.test(expiryMonth) && month >= 1 && month <= 12;
};

  // Validate expiry year (YY)
export const validateExpiryYear = (expiryYear: string): boolean => {
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
    const year = parseInt(expiryYear, 10);
    return /^\d{2}$/.test(expiryYear) && year >= currentYear && year <= currentYear + 20; // Allow up to 20 years in the future
};

  // Validate CVV (3 or 4 digits)
export const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
};

  // Validate cardholder name (non-empty)
export const validateCardName = (cardName: string): boolean => {
    return cardName.trim().length > 0;
};
export const validateQuantity = (unformattedQuantity: string)=>{
    if(!unformattedQuantity){
        return false;
    }

    const quantity = Number(unformattedQuantity);

    if(quantity < 0){
        return false;
    }   
    if (!Number.isInteger(quantity)) {
        return false;
    }
    return true;
}

export const validatePricing = (unformattedPrice: string)=> {
    if(!unformattedPrice){
        return false;
    }

    const price = Number(unformattedPrice);

    if(Number.isNaN(price)){
      return false;
    }

    if (price < 0) {
        return false;
    }

    const decimalPlaces = unformattedPrice.split(".")[1]?.length || 0;
    if (decimalPlaces > 2) {
        return false;
    }

    return true;
}

export const validateCardNumber = (cardNumber: string): boolean => {
    // Remove all non-numeric characters
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");
  
    // Check if the card number is of valid length (13 to 19 digits)
    if (!/^\d{13,19}$/.test(cleanedCardNumber)) {
      return false;
    }
  
    // Luhn algorithm implementation
    let sum = 0;
    let shouldDouble = false;
  
    // Iterate over the card number from right to left
    for (let i = cleanedCardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedCardNumber.charAt(i), 10);
  
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit = digit - 9; // Equivalent to adding the digits of the doubled number
        }
      }
  
      sum += digit;
      shouldDouble = !shouldDouble; // Toggle the flag for the next iteration
    }
  
    // If the sum is a multiple of 10, the card number is valid
    return sum % 10 === 0;
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

export const isValidZipCode = (zipCode: string | number): boolean => {
    // Convert to string in case the input is a number
    const zipCodeStr = zipCode.toString();
  
    // Check if the zip code is exactly 5 digits and contains only numbers
    return /^\d{5}$/.test(zipCodeStr);
  }
  
export const isMyShop = (shopUserId: string, userId: string) => {
  return shopUserId === userId;
}

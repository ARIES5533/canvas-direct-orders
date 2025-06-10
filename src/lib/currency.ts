
export const formatPrice = (price: number, currency: 'USD' | 'NGN') => {
  const symbol = currency === 'USD' ? '$' : '₦';
  return `${symbol}${price.toLocaleString()}`;
};

export const getCurrencySymbol = (currency: 'USD' | 'NGN') => {
  return currency === 'USD' ? '$' : '₦';
};

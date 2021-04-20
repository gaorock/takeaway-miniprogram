module.exports = function formatPrice (price) {
  price = parseFloat(price);
  const formatedPrice = String(price.toFixed(2)).split('.')
  if (formatedPrice[1]) {
    formatedPrice[1] = formatedPrice[1].length >= 2?formatedPrice[1]:formatedPrice[1]+'0';
  } else {
    formatedPrice[1] = '00'
  }
  return formatedPrice
}
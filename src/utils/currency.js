export function getAbsoluteAmount (balance) {
  if (!balance || typeof (balance) === 'object') {
    return 0
  }
  const amount = balance.split(' ')[0]
  return parseFloat(amount)
}

export function getCurrency (balance) {
  if (!balance) {
    return ''
  }
  const currency = balance.split(' ')[1]
  return currency
}

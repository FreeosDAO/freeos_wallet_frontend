export function getAbsoluteAmount (balance) {
  if (!balance) {
    return 0
  }
  const amount = balance.split(' ')[0]
  return parseFloat(amount)
}

export function getAbsoluteAmount(balance) {
  let amount = balance.split(" ")[0]
  return parseFloat(amount)
}
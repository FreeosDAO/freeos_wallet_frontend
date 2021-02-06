export function SET_BALANCE (state, data) {
  console.log(data)
  if (_.has(data, 'balance')) {
    state.balance = data.balance
  } else {
    state.balance = 0
  }
}

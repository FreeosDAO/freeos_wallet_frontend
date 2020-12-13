export const setAccount = function (state, { account, walletId }) {
  if (!state.account) {
    localStorage.walletId = walletId
    state.account = account
    state.connecting = false
    if (this.$router.currentRoute.fullPath !== state.path) {
      this.$router.push({ path: state.path })
    }
  }
}

export const clearAccount = function (state) {
  localStorage.removeItem('walletId')
  state.account = null
  this.$router.push({ path: '/' })
}

export const setConnecting = (state, connecting) => {
  state.connecting = connecting
}

export const setPath = function (state, pathe) {
  // console.log('pathe1', pathe)
  state.path = pathe
}

import notifyAlert from 'src/services/notify-alert'

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

export const setClaimInfo = function (state, claimInfo) {
  state.claimInfo = claimInfo
}

export const setClaimAttributeVal = function (state, payload) {
  const attr = payload.key
  const val = payload.value

  state.claimInfo[attr] = val
}

export const clearAccount = function (state) {
  localStorage.removeItem('walletId')
  state.account = null
  if (this.$router.currentRoute.fullPath !== '/') {
    this.$router.push({ path: '/' })
  }
  notifyAlert(1, 'logout successfully')
}

export const setConnecting = (state, connecting) => {
  state.connecting = connecting
}

export const setPath = function (state, pathe) {
  // console.log('pathe1', pathe)
  state.path = pathe
}

export default () => ({
  accountName: null,
  connecting: false,
  path: '/claim',
  claimInfo: {
    liquidInAccount: {
      balance: ''
    },
    eosStaked: {
      stake: ''
    },
    freeosInAccount: {
      balance: ''
    },
    claimCalendar: {
      end_date: ''
    },
    freeosHoldingRequire: {
      tokens_required: 0
    },
    respMasterSwitch: '',
    respFreeosRecord: '',
    respStakeRequirement: '',
    respIsUserAlreadyClaimed: '',
    nextCalendar: '',
    respAirKey: ''
  }
})

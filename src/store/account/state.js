export default () => ({
  account: null,
  connecting: false,
  path: '/claim',
  claimInfo: {
    eosInAccount: {
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
    respAirKey: ''
  }
})

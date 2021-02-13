import { connect } from 'src/utils/smartContractRequest'
import { Notify } from 'quasar'

export async function getVestedRecord (state, accountName) {
  const config = {
    code: process.env.AIRCLAIM_CONTRACT, // the airclaim account
    scope: accountName, // the subset of the table to query
    table: 'vestaccounts', // the name of the table
    limit: 1
  }
  const result = await connect(config)
  state.commit('SET_BALANCE', result.rows[0])
}

export async function getUnVestHistory (state, accountName) {
  const result = await connect({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: accountName,
    table: 'unvests',
    limit: 1
  })
  state.commit('SET_UNVEST_HISTORY', result.rows)
}

export async function unVest (state) {
  try {
    const accountName = this.$transit.wallet.auth.accountName
    const result = await this.$transit.eosApi.transact({
      actions: [{
        account: process.env.AIRCLAIM_CONTRACT, // the name of the airclaim contract (i'm using freeos333333 as a test account on Kylin)
        name: 'unvest', // name of the action to call
        authorization: [{
          actor: accountName, // the claim action is called on behalf of the user
          permission: 'active' // name of permission, e.g. this and the line above are the equivalent of  -p yvetecoleman@active
        }],
        data: {
          // Kenneth: only the following parameters required for claim action
          user: accountName // account name = yvetecoleman
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    })

    console.log(result)

    if (result.processed.receipt.status === 'executed') {
      Notify.create({
        message: 'Unvest action successfully',
        color: 'positive'
      })
      state.dispatch('getVestedRecord', accountName)
      state.dispatch('getUnVestHistory', accountName)
    } else {
      Notify.create({
        message: 'The action could not be completed. Please try later',
        color: 'negative'
      })
    }
  } catch (e) {
    console.log(e)
  }
}

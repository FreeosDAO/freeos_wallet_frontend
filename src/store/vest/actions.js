import { connect } from 'src/utils/smartContractRequest'
import notifyAlert from 'src/services/notify-alert'
import ProtonSDK from '../../utils/proton'

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

export async function getUnVestHistory (state, data) {
  const { accountName, iterationNumber } = data
  const result = await connect({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: accountName,
    table: 'unvests',
    limit: 1,
    lower_bound: iterationNumber
  })
  console.log(result.rows)
  state.commit('SET_UNVEST_HISTORY', result.rows)
}
export async function unVest (state, accountName) {
  try {
    const actions = [{
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
    const result = await ProtonSDK.sendTransaction(actions)
    if (result.processed.receipt.status !== 'executed') {
      notifyAlert('err', 'The action could not be completed. Please try later')
    }
  } catch (e) {
    console.log(e)
  }
}

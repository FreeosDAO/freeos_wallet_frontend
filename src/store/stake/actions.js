import notifyAlert from 'src/services/notify-alert'
import { connect } from 'src/utils/smartContractRequest'
import { RpcError } from 'eosjs'

export const actionStake = async function ({ state }) {
  try {
    const userRecord = await connect({
      json: true,
      code: process.env.AIRCLAIM_CONTRACT,
      scope: process.env.AIRCLAIM_CONTRACT,
      table: 'stake',
      limit: 1
    })
    const quantity = userRecord.rows[0].stake_requirement ? userRecord.rows[0].stake_requirement : userRecord.rows[0].default_stake

    const actions = [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: this.$transit.wallet.auth.accountName,
        permission: this.$transit.wallet.auth.permission
      }],
      data: {
        from: this.$transit.wallet.auth.accountName,
        to: process.env.AIRCLAIM_CONTRACT,
        quantity,
        memo: 'freeos stake'
      }
    }]

    console.log(actions)
    const result = await this.$transit.eosApi.transact({
      actions
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    })
    console.log(result)

    if (result.processed.receipt.status === 'executed') {
      notifyAlert('success', result.processed.action_traces[0].console + 'success')
    } else {
      notifyAlert('err', 'The action could not be completed. Please try later')
    }
    return result
  } catch (e) {
    if (e.message.startsWith("Cannot read property 'stake_requirement'")) {
      notifyAlert('err', 'You are not yet registered with freeos')
    } else if (e.message === 'UnAuthorized') {
      notifyAlert('err', 'Please check that your wallet contains the correct keys for the account you are trying to register')
    } else if (e.message.startsWith('assertion failure with message: ')) {
      notifyAlert('err', e.message.split('assertion failure with message: ')[1])
    } else if (e.message === 'unrecognized private key type') {
      notifyAlert('err', 'There is a problem with your private key. Please check your wallet has the correct key(s)')
    } else if (e instanceof RpcError || e instanceof TypeError) {
      notifyAlert('err', 'Connection error. Please try later')
    } else {
      notifyAlert('err', 'The action could not be completed. Please try later')
    }
  }
}

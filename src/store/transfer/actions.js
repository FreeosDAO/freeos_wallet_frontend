import { Notify } from 'quasar'

export async function transferTokens ({ state }, data) {
  const { toAccountName, tokenType, sendAmount, memo } = data
  const actions = [{
    account: tokenType === 'XPR' ? 'eosio.token' : process.env.AIRCLAIM_CONTRACT,
    name: 'transfer',
    authorization: [{
      actor: this.$transit.wallet.auth.accountName,
      permission: this.$transit.wallet.auth.permission
    }],
    data: {
      from: this.$transit.wallet.auth.accountName,
      to: toAccountName,
      quantity: `${parseFloat(sendAmount).toFixed(process.env.TOKEN_PRECISION)} ${tokenType}`,
      memo
    }
  }]

  try {
    const result = await this.$transit.eosApi.transact({
      actions
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    })
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Transfer successfully'
    }
    Notify.create({
      message: responseMessage,
      color: 'positive'
    })
    return result
  } catch (e) {
    return e
  }
}

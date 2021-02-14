export const sendTokens = async function ({ state }, { memo, quantity, to }) {
  const config = [{
    actions: [{
      account: process.env.TOKEN_SMARTCONTRACT,
      name: 'transfer',
      authorization: [{
        actor: this.$transit.wallet.auth.accountName,
        permission: this.$transit.wallet.auth.permission
      }],
      data: {
        from: this.$transit.wallet.auth.accountName,
        to,
        quantity: `${parseFloat(quantity).toFixed(process.env.TOKEN_PRECISION)} ${process.env.TOKEN_NAME}`,
        memo
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  }]

  console.log(config)
  try {
    const result = await this.$transit.eosApi.transact({
      actions: [{
        account: process.env.TOKEN_SMARTCONTRACT,
        name: 'transfer',
        authorization: [{
          actor: this.$transit.wallet.auth.accountName,
          permission: this.$transit.wallet.auth.permission
        }],
        data: {
          from: this.$transit.wallet.auth.accountName,
          to,
          quantity: `${parseFloat(quantity).toFixed(process.env.TOKEN_PRECISION)} ${process.env.TOKEN_NAME}`,
          memo
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    })
    return result
  } catch (e) {
    return e
  }
}

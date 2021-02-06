const { JsonRpc } = require('eosjs')
// endpoint
const rpc = new JsonRpc('https://' + process.env.NETWORK_HOST + ':' + process.env.NETWORK_PORT, { fetch })

export function connect (config) {
  return new Promise((resolve, reject) => {
    rpc.get_table_rows(config)
      .then((response) => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

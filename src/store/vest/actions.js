import { connect } from 'src/utils/smartContractRequest'

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
  console.log(result)
  // TODO
}

export function unVest (state) {
  console.log(1111)
}

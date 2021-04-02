import { connect } from 'src/utils/smartContractRequest'

export async function getClaimCalendar (state) {
  const result = await connect({
    json: true,
    code: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    scope: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    table: 'iterations',
    limit: 26,
    // to get the latest iteration, as iteration table is been paginated
    reverse: true
  })
  const currentTimeStamp = Math.floor((new Date()).getTime() / 1000)

  if (result.rows && result.rows.length) {
    result.rows.map((row, index) => {
      const startTimeStamp = row.start
      const endTimeStamp = row.end

      if (currentTimeStamp > startTimeStamp && currentTimeStamp < endTimeStamp) {
        state.commit('SET_CURRENT_CALENDAR', row)
        const currentIterationNo = row.iteration_number
        const nextCalendar = result.rows.find(r => r.iteration_number === currentIterationNo + 1) || null
        state.commit('SET_NEXT_CALENDAR', nextCalendar)
      }
    })
  }
}

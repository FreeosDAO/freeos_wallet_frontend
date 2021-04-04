import { getAbsoluteAmount } from '@/utils/currency'

export const isAuthenticated = ({ accountName }) => accountName !== null
export const connecting = ({ connecting }) => connecting
export const claimInfo = ({ claimInfo }) => claimInfo

export function userHasAirKey (state) {
  return getAbsoluteAmount(state.airKey) > 0
}

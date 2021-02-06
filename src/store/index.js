import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import claim from './claim'
import stake from './stake'
import unstake from './unstake'
import transfer from './transfer'
import vest from './vest'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      account,
      claim,
      stake,
      unstake,
      transfer,
      vest
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}

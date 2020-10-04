<template>
  <q-page
    class="window-height window-width row justify-center items-center"
  >
    <div class="column">
      <div class="row">
        <q-card square dark class="q-pa-md q-ma-none no-shadow bg-grey-10" style="width:320px;">
          <q-card-section class="q-mt-xl q-mb-md">
            <p class="text-weight-bolder text-primary">Login to your account</p>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input dark dense square filled clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input dark dense square filled clearable v-model="password" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions>
            <div class="row full-width items-center">
              <div class="col-6">
                <q-btn outline rounded size="md" color="red-4" class="full-width text-white" label="Sign In" />
              </div>
              <div class="col-6">
                <p class="text-no-wrap text-grey text-caption text-right">Forgot password?</p>
              </div>
            </div>
          </q-card-actions>
          <q-card-section>
            <p class="text-caption text-weight-light text-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce semper laoreet placerat. Nullam semper auctor justo, rutrum posuere odio vulputate nec.</p>
          </q-card-section>
          <button type="button" name="button" @click="readtable1">pushme</button>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Api, JsonRpc } from 'eosjs' // getTableRows
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
// import { binaryToDecimal } from 'eosjs/dist/eosjs-numeric'

const EOSIO_ENDPOINT = 'https://kylin-dsp-1.liquidapps.io/'
const EOSIO_CONTRACTNAME = 'freeosoffice'

export default {
  name: 'Login',
  data () {
    return {
      username: 'tommccann333',
      password: '',
      phone_number: '',
      email: '',
      authCode: '',
      jsonresponse: '',
      table: '',
      key: '5J4d9G8yUeRAzEdNhetuiuxAXUW5HrFVu1pHQwDnRauZNmeEMQH'
    }
  },
  async mounted () {
    this.jsonresponse = await this.EOSconnect('reguser', [50000, 'masterswitch'])
    this.table = await this.getTableRows(EOSIO_CONTRACTNAME, this.username, 'users')
  },
  methods: {
    async getTableRows (contract, user, tablename) {
      const rpc = new JsonRpc(EOSIO_ENDPOINT)
      const tableRows = await rpc.get_table_rows({
        json: true,
        code: contract,
        scope: user,
        table: tablename,
        limit: 10,
        reverse: false,
        show_payer: false
      })
      return tableRows
    },
    async EOSconnect (action, dataValue) {
      // const privateKey = localStorage.getItem('freeos_key')
      console.log(localStorage.getItem('freeos_account'))
      //  const privateKey = this.key
      //  const rpc = new JsonRpc(EOSIO_ENDPOINT)
      //  const signatureProvider = new JsSignatureProvider([privateKey])
      // transit library
      const privateKey = this.key
      const rpc = new JsonRpc(EOSIO_ENDPOINT)
      const signatureProvider = new JsSignatureProvider([privateKey])
      const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
      const resultWithConfig = await api.transact({
        actions: [{
          account: EOSIO_CONTRACTNAME,
          name: action,
          authorization: [{
            actor: 'tommccann333',
            permission: 'active'
          }],
          data: {
            user: 'tommccann333',
            account_type: 'e',
            permission: 'active',
            threshold: 50000
            // auth: {
            //   'threshold': 1,
            //   'keys': [{
            //     'key': "5JddzsLKQkPFGZxTiUSZJf6WQXkx1ivsqNBpErZV5LEvC87CzoS",
            //     'weight': 1
            //   }],
            // }
          }
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30
      })
      return resultWithConfig
    }
  }

}
</script>

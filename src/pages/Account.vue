<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 1000px">
      <q-card>
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          :mobile-arrows="false"
        >
          <q-tab name="accountDetails" no-caps label="Account details" />
          <q-tab name="paymentDetails" no-caps label="Payment Details" />
          <q-tab name="login" no-caps label="Login" />
          <q-tab name="QR" no-caps label="QR Code" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="accountDetails">
            <div class="text-h6 text-center q-mt-lg  q-mb-lg">Your account details</div>
            <div>
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-2 text-right q-mr-lg">
                  Name:
                </div>
                <div class="col-xs-6 col-sm-4">
                  <q-input
                    v-model="accountName"
                    type="text"
                    outlined
                    dense
                  />
                </div>
              </div>
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-2 text-right q-mr-lg">
                  Email:
                </div>
                <div class="col-xs-6 col-sm-4">
                  <q-input
                    v-model="accountEmail"
                    type="text"
                    outlined
                    dense
                  />
                </div>
              </div>
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-2 text-right q-mr-lg">
                  Phone number:
                </div>
                <div class="col-xs-6 col-sm-4">
                  <q-input
                    v-model="accountPhone"
                    type="text"
                    outlined
                    dense
                  />
                </div>
              </div>
              <div style="align-items: center; width: 80%; margin-left: auto; margin-right: auto;" class="row justify-end q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <q-btn color="primary" no-caps label="Save" />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="paymentDetails">
            <div class="text-h6 text-center q-mt-lg  q-mb-lg">Your payment details</div>
            <div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-4 col-sm-2 text-right q-mr-lg">
                  EOS account:
                </div>
                <div class="col-xs-6 col-sm-4">
                  asdf209832szf
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('asdf209832szf')" />
                </div>
              </div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-4 col-sm-2 text-right q-mr-lg">
                  FreeOS account:
                </div>
                <div class="col-xs-6 col-sm-4">
                  asdddaf23fdsf
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('asdddaf23fdsf')" />
                </div>
              </div>
              <div class="q-mt-xl q-mb-md text-center q-pl-md q-pr-md ">
                If you want to receive tokens from EOS wallet please use following credentials and memo. <span style="text-decoration: underline; cursor: pointer;" class="text-primary">Why?</span>
              </div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-4 col-sm-2 text-right q-mr-lg">
                  EOS account:
                </div>
                <div class="col-xs-6 col-sm-4">
                  freeosdsfac
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('freeosdsfac')" />
                </div>
              </div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-2 text-right q-mr-lg">
                  Memo:
                </div>
                <div class="col-xs-6 col-sm-4">
                  0:asdddaf23fdsf
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('0:asdddaf23fdsf')" />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="login">
            <div class="text-h6 text-center q-mt-lg  q-mb-lg">You logged in</div>
            <div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-4 col-sm-2 text-right q-mr-lg">
                  EOS account:
                </div>
                <div class="col-xs-6 col-sm-4">
                  asdf209832szf
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('asdf209832szf')" />
                </div>
              </div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-4 col-sm-2 text-right q-mr-lg">
                  FreeOS account:
                </div>
                <div class="col-xs-6 col-sm-4">
                  asdddaf23fdsf
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('asdddaf23fdsf')" />
                </div>
              </div>
              <div class="q-mt-xl q-mb-md text-center q-pl-md q-pr-md ">
                If you want to receive tokens from EOS wallet please use following credentials and memo. <span style="text-decoration: underline; cursor: pointer;" class="text-primary">Why?</span>
              </div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-4 col-sm-2 text-right q-mr-lg">
                  EOS account:
                </div>
                <div class="col-xs-6 col-sm-4">
                  freeosdsfac
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('freeosdsfac')" />
                </div>
              </div>
              <div class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-2 text-right q-mr-lg">
                  Memo:
                </div>
                <div class="col-xs-6 col-sm-4">
                  0:asdddaf23fdsf
                  <q-icon class="q-ml-sm" style="cursor: pointer" size='sm' name="content_copy" @click="copyText('0:asdddaf23fdsf')" />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="QR">
            <div class="text-h6 text-center q-mt-lg  q-mb-lg">QR code to your account</div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'Account',
  data () {
    return {
      tab: 'accountDetails',
      accountName: 'Agent Smith',
      accountEmail: 'agentsmith@example.com',
      accountPhone: '023444322333'
    }
  },
  methods: {
    copyText (text) {
      copyToClipboard(text)
        .then(() => {
          console.log(text)
          this.$q.notify({
            message: 'Copied to clipboard!',
            position: 'top',
            color: 'positive',
            timeout: 1000
          })
        })
        .catch(() => {
          console.log('copy text error!')
        })
    }
  }
}
</script>

<style scoped>

</style>

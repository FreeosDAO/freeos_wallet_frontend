<template>
  <div class="text-center" style="max-width: 800px; margin: 0 auto;">
    <div class="q-ma-md text-h6">
      Buy tokens
    </div>
    <div class="q-pa-md q-ml-auto q-mr-auto" style="width: 60%;">
      <q-input
        dense
        v-model.number="amount"
        type="number"
        outlined
        placeholder="Amount"
      />
    </div>
    <div class="q-pa-md q-ml-auto q-mr-auto" style="width: 60%;">
      <q-select dense outlined v-model="buySelectModel" :options="buySelectOptions" label="Choose token to buy" />
    </div>
    <div class="q-pa-md q-ml-auto q-mr-auto" style="width: 60%;">
      <q-select dense outlined v-model="paySelectModel" :options="paySelectOptions" label="Choose token to pay with" />
    </div>
    <div class="q-mt-lg row full-width justify-around">
      <div class="col-xs-8 col-sm-4 q-mb-lg" v-if="buySelectModel">
        <q-card>
          <q-card-section>
            <div class="q-ma-xs">
              4.12334 EOS
            </div>
            <div class="q-ma-xs q-mt-md">
              <q-btn color="primary" no-caps label="Pay with DefiBox" />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-8 col-sm-4 q-mb-lg" v-if="paySelectModel">
        <q-card>
          <q-card-section>
            <div class="q-ma-xs">
              4.04322 EOS
            </div>
            <div class="q-ma-xs q-mt-md">
              <q-btn color="primary" no-caps label="Pay with Bancor" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Buy',
  data () {
    return {
      amount: null,
      buySelectModel: null,
      buySelectOptions: [
        'FreeOS', 'FreeOS2', 'FreeOS3'
      ],
      paySelectModel: null,
      paySelectOptions: [
        'EOS', 'EOS2', 'EOS3'
      ]
    }
  }
}
</script>

<style scoped>

</style>

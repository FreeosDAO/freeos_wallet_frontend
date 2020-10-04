<template>
  <q-layout view="hHh Lpr fFf">

    <q-header reveal elevated class="bg-primary" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" />

        <q-toolbar-title class="fixed-right q-mr-md q-mt-xs">
          <q-avatar>
            <q-icon size='md' name="face" />
          </q-avatar>
          {{username}}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :width="200"
      :breakpoint="800"
      overlay
      bordered
      content-class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list>

          <template v-for="(menuItem, index) in menuList">
            <q-item :key="index" clickable :active="menuItem.label === 'Claim'" v-ripple @click="$router.replace('menuItem.route')">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
          <!-- <template v-for="(menuItem, index) in menuList">
            <q-side-link item :key="index" clickable :active="menuItem.route === $route.path" v-ripple :to="menuItem.route">
                <q-item-side avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-side>
                <q-item-main>
                  {{ menuItem.label }}
                </q-item-main>
            </q-side-link>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template> -->

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-dark text-white" >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar >
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
const menuList = [
  {
    icon: 'monetization_on',
    label: 'Claim',
    separator: true,
    route: '/claim'
  },
  {
    icon: 'swap_horiz',
    label: 'Transfer',
    separator: true,
    route: '/transfer'
  },
  {
    icon: 'get_app',
    label: 'Stake',
    separator: true,
    route: '/stake'
  },
  {
    icon: 'account_balance_wallet',
    label: 'Buy',
    separator: true,
    route: '/buy'
  },
  {
    icon: 'account_circle',
    iconColor: 'primary',
    label: 'Account',
    separator: false,
    route: '/account'
  }
]

export default {
  data () {
    return {
      drawer: false,
      username: 'tommccann333',
      menuList
    }
  }
}
</script>

<style lang="scss">
// .header {
//   color: $primary;
// }
</style>

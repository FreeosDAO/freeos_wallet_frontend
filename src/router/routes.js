const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/claim', component: () => import('pages/Claim.vue') },
      { path: '/stake', component: () => import('pages/StakeAndUnstake.vue') },
      { path: '/transfer', component: () => import('pages/Transfer.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

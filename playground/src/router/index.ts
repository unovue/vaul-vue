import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/test',
      children: [
        {
          path: 'controlled',
          component: () => import('../views/tests/ControlledView.vue'),
        },
        {
          path: 'initial-snap',
          component: () => import('../views/tests/InitialSnapView.vue'),
        },
        {
          path: 'nested-drawer',
          component: () => import('../views/tests/NestedDrawerView.vue'),
        },
        {
          path: 'non-dismissible',
          component: () => import('../views/tests/NonDismissibleView.vue'),
        },
        {
          path: 'scrollable-with-inputs',
          component: () => import('../views/tests/ScrollableWithInputsView.vue'),
        },
        {
          path: 'without-scaled-background',
          component: () => import('../views/tests/WithoutScaledBackgroundView.vue'),
        },
        {
          path: 'with-scaled-background',
          component: () => import('../views/tests/WithScaledBackgroundView.vue'),
        },
        {
          path: 'with-snap-points',
          component: () => import('../views/tests/WithSnapPointsView.vue'),
        },
      ],
    },
  ],
})

export default router

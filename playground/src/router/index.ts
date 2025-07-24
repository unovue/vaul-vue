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
          name: 'Controlled Drawer',
          component: () => import('../views/tests/ControlledView.vue'),
        },
        {
          path: 'no-drag-element',
          name: 'No Drag Element',
          component: () => import('../views/tests/NoDragElementView.vue'),
        },
        {
          path: 'initial-snap',
          name: 'Initial Snap Point',
          component: () => import('../views/tests/InitialSnapView.vue'),
        },
        {
          path: 'direction',
          name: 'Drawer Direction',
          component: () => import('../views/tests/DirectionView.vue'),
        },
        {
          path: 'nested-drawer',
          name: 'Nested Drawer',
          component: () => import('../views/tests/NestedDrawerView.vue'),
        },
        {
          path: 'nested-programmatic-close',
          name: 'Nested Programmatic Close',
          component: () => import('../views/tests/NestedProgrammaticClose.vue'),
        },
        {
          path: 'non-dismissible',
          name: 'Non-Dismissible Drawer',
          component: () => import('../views/tests/NonDismissibleView.vue'),
        },
        {
          path: 'scrollable-with-inputs',
          name: 'Scrollable with Inputs',
          component: () => import('../views/tests/ScrollableWithInputsView.vue'),
        },
        {
          path: 'without-scaled-background',
          name: 'Without Scaled Background',
          component: () => import('../views/tests/WithoutScaledBackgroundView.vue'),
        },
        {
          path: 'with-handle',
          name: 'With Handle',
          component: () => import('../views/tests/WithHandleView.vue'),
        },
        {
          path: 'with-scaled-background',
          name: 'With Scaled Background',
          component: () => import('../views/tests/WithScaledBackgroundView.vue'),
        },
        {
          path: 'with-snap-points',
          name: 'With Snap Points',
          component: () => import('../views/tests/WithSnapPointsView.vue'),
        },

      ],
    },
  ],
})

export default router

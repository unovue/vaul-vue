import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/test',
      children: [
        {
          path: 'controlled',
          name: 'Controlled Drawer',
          component: () => import('../views/tests/Controlled.vue'),
        },
        {
          path: 'no-drag-element',
          name: 'No Drag Element',
          component: () => import('../views/tests/NoDrag.vue'),
        },
        {
          path: 'initial-snap',
          name: 'Initial Snap',
          component: () => import('../views/tests/InitialSnap.vue'),
        },
        {
          path: 'side',
          name: 'Drawer Side',
          component: () => import('../views/tests/Direction.vue'),
        },
        {
          path: 'nested-drawer',
          name: 'Nested Drawer',
          component: () => import('../views/tests/NestedDrawer.vue'),
        },
        {
          path: 'non-dismissible',
          name: 'Non Dismissible',
          component: () => import('../views/tests/NonDismissible.vue'),
        },
        {
          path: 'scrollable-with-inputs',
          name: 'Scrollable With Inputs',
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

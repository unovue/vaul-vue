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
          path: 'with-handle',
          name: 'With Handle',
          component: () => import('../views/tests/WithHandleView.vue'),
        },
        {
          path: 'without-scale-background',
          name: 'Without scaled background',
          component: () => import('../views/tests/WithoutScaledBackground.vue'),
        },
        {
          path: 'emits',
          name: 'Emits',
          component: () => import('../views/tests/Emits.vue'),
        },
      ],
    },
  ],
})

export default router

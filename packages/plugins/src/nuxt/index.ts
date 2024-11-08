import { addComponent, defineNuxtModule } from '@nuxt/kit'
import { components } from '../../../vaul-vue/constant'

import type { } from '@nuxt/schema' // workaround for TS bug with "phantom" deps

export interface ModuleOptions {
  prefix: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@vaul-vue/nuxt',
    configKey: 'vaul',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    prefix: ''
  },
  setup(options) {
    for (const component of components) {
      addComponent({
        name: `${options.prefix}${component}`,
        export: component,
        filePath: 'vaul-vue',
      })
    }
  },
})

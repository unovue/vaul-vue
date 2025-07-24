<script setup lang="ts">
import {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from 'reka-ui'
import { RouterLink, useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()

const testPages = computed(() => {
  const testRoute = router.getRoutes().filter(route => route.path.includes('/test'))
  return testRoute?.map(child => ({
    path: child.path,
    name: child.name,
  }))
})
</script>

<template>
  <NavigationMenuRoot class="fixed top-0 left-0 right-0 z-10 flex max-w-max flex-1 items-center justify-center">
    <NavigationMenuList class="group flex flex-1 list-none items-center justify-center space-x-1">
      <!-- Home Link -->
      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <RouterLink
            to="/"
            class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
          >
            Home
          </RouterLink>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <!-- Test Pages Dropdown -->
      <NavigationMenuItem>
        <NavigationMenuTrigger class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
          Demo Pages
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            <div v-for="page in testPages" :key="page.path" class="row-span-1">
              <NavigationMenuLink as-child>
                <RouterLink
                  :to="page.path"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">
                    {{ page.name }}
                  </div>
                </RouterLink>
              </NavigationMenuLink>
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuIndicator class="top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in">
        <div class="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
      </NavigationMenuIndicator>
    </NavigationMenuList>

    <div class="absolute left-0 top-full flex justify-center">
      <NavigationMenuViewport class="origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]" />
    </div>
  </NavigationMenuRoot>
</template>

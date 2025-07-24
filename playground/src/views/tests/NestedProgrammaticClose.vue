<script setup lang="ts">
import {
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerRootNested,
  DrawerTrigger,
} from 'vaul-vue'
</script>

<template>
  <div class="w-screen h-screen bg-white p-8 flex justify-center items-center" data-vaul-drawer-wrapper="">
    <DrawerRoot
      v-slot="{ close: closeFirstDrawer }"
      should-scale-background
    >
      <DrawerTrigger as-child>
        <button data-testid="trigger" class="text-2xl">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay data-testid="overlay" class="fixed inset-0 bg-black/40" />
        <DrawerContent
          data-testid="content"
          class="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0"
        >
          <button @click="closeFirstDrawer">
            Close First Drawer
          </button>

          <br>

          <DrawerRootNested v-slot="{ close: closeSecondDrawer }">
            <DrawerTrigger as-child>
              <button data-testid="nested-trigger" class="text-2xl">
                Open Second Drawer
              </button>
            </DrawerTrigger>
            <DrawerPortal>
              <DrawerOverlay data-testid="nested-overlay" class="fixed inset-0 bg-black/40" />
              <DrawerContent
                data-testid="nested-content"
                class="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0"
              >
                <button @click="closeSecondDrawer">
                  Close Second Drawer
                </button>

                <br>

                <DrawerRootNested v-slot="{ close: closeThirdDrawer }">
                  <DrawerTrigger as-child>
                    <button data-testid="nested-trigger" class="text-2xl">
                      Open Third Drawer
                    </button>
                  </DrawerTrigger>
                  <DrawerPortal>
                    <DrawerOverlay data-testid="nested-overlay" class="fixed inset-0 bg-black/40" />
                    <DrawerContent
                      data-testid="nested-content"
                      class="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0"
                    >
                      <button @click="closeThirdDrawer">
                        Close Third Drawer
                      </button>
                    </DrawerContent>
                  </DrawerPortal>
                </DrawerRootNested>
              </DrawerContent>
            </DrawerPortal>
          </DrawerRootNested>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </div>
</template>

<style scoped></style>

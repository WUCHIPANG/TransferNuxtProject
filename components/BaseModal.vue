<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-modalBG backdrop-blur" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="relative border border-devider rounded-3xl min-w-[480px] min-h-[180px] transform overflow-hidden bg-white p-6 text-left align-middle transition-all">
              <!-- <span class="absolute cursor-pointer icon-close top-4 right-4" @click="closeModal" /> -->
              <DialogTitle as="h3" class="text-font24">
                <slot name="title" />
              </DialogTitle>
              <div class="mt-6">
                <p class="text-font20Regular">
                  <slot name="detail" />
                </p>
              </div>

              <div class="flex justify-around mt-6">
                <button
                  v-if="props.haveCancelBtn"
                  class="modal-button text-neutral-50 hover:bg-neutral-98"
                  @click="closeModal"
                >
                  <slot name="cancelButtonText" />
                </button>
                <slot name="confirmButton" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useVModel } from '@vueuse/core'
const props = defineProps({
  modelValue: Boolean,
  haveCancelBtn: {
    type: Boolean,
    default: true,
    require: false,
  },
  planID: {
    type: String,
    default: '',
  },
})
const isOpen = useVModel(props, 'modelValue')

const closeModal = () => {
  isOpen.value = false
}

</script>

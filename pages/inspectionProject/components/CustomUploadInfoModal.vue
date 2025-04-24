<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-onMapFirst">
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
            <DialogPanel class="relative p-6 overflow-hidden text-left align-middle transform bg-white border border-devider rounded-3xl ransition-all">
              <span class="absolute cursor-pointer icon-close top-4 right-4" @click="closeModal" />
              <DialogTitle as="h3" class="text-font24">
                <span class="mr-3 icon-route" />匯入資訊
              </DialogTitle>
              <div class="mt-6">
                <p class="text-font20Regular">
                  <UploadFlightRecord
                    :plan-id="propPlanID"
                    :plan-flight-id="porpFlightID"
                    :drone-brand="propDroneBrand"
                    @update-status="updateUploadStatus"
                  />
                </p>
              </div>

              <div class="flex justify-around mt-6">
                <button
                  class="w-[49%] h-[52px] rounded-xl text-font20 flex justify-center items-center cursor-pointer text-neutral-50 hover:bg-neutral-98"
                  @click="closeModal"
                >
                  取消
                </button>
                <button
                  class="w-[49%] h-[52px] rounded-xl text-font20 flex justify-center items-center cursor-pointer"
                  :class="isDisabledConfirm? ' text-neutral-50 bg-neutral-90':'text-active bg-activeBG hover:bg-activeBGHover'"
                  :disabled="isDisabledConfirm"
                  @click="closeModal"
                >
                  確定
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useVModel } from '@vueuse/core'
import UploadFlightRecord from '@/views/inspectionProject/components/CustomUploadFlightRecord.vue'

const emit = defineEmits(['showUploadImgBtn'])
const props = defineProps({
  modelValue: Boolean,
  planId: {
    type: String,
    default: '',
  },
  planFlightId: {
    type: String,
    default: '',
  },
  droneBrand: {
    type: Number,
    default: 0,
  },
})
const isOpen = useVModel(props, 'modelValue')
const propPlanID = useVModel(props, 'planId')
const porpFlightID = useVModel(props, 'planFlightId')
const propDroneBrand = useVModel(props, 'droneBrand')

const isDisabledConfirm = ref(true)
const updateUploadStatus = (status) => {
  if (status === 'success') {
    isDisabledConfirm.value = false
    emit('showUploadImgBtn', true)
  }
}
const closeModal = () => {
  isOpen.value = false
}
</script>


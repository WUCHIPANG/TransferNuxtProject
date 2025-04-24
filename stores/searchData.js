import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchDataStore = defineStore('searchData', () => {
  const data = ref()
  function addData(newData) {
    data.value = newData
  }
  function deleteData() {
    data.value = ''
  }
  return { data, addData, deleteData }
})

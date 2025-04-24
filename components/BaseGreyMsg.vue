<template>
  <div class=" w-[32%] h-15 rounded-lg flex bg-[#1F3C7454] text-white">
    <div class=" w-[30%] h-full text-xl flex justify-center items-center">
      <slot name="title" />
    </div>
    <div class="w-[70%] h-full bg-[#4E4E4E1A] text-xl flex justify-left items-center pl-4">
      <slot name="data" />
    </div>
  </div>
</template>

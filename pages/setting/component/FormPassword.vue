<script setup>

watch(async () => {

})
// const { $api, $toast } = useNuxtApp()

</script>
<template>
  <div>
    <ReInputText
      class="mb-2"
      label="Kata Sandi"
      type="password"
      placeholder="Masukkan Kata Sandi Anda"
      :require="false"
    />
    <ReInputText
      label="Ulangi Kata Sandi"
      type="password"
      placeholder="Ulangi Kata Sandi Anda"
      :require="false"
    />
    <div class="mt-8">
      <CButton class="w-full" text="Simpan" />
    </div>
  </div>
</template>

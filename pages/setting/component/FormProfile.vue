<script setup>

const unitData = ref()
const pjData = ref()
watch(async () => {
  await getUnit()
  await getPj()
})
const getUnit = async () => {
  try {
    const { data } = await $api.global.getUnitOfWork(null)
    if (data.value) {
      const val = []
      data.value.data.forEach((item) => {
        val.push({
          label: item.name,
          value: item.id
        })
      })
      unitData.value = val
    }
  } catch (e) {
    $toast.error(e)
  }
}

const setPj = (item) => {
  formData.pj = item
}
const { $api, $toast } = useNuxtApp()
const getPj = async () => {
  try {
    const { data } = await $api.global.getPositinOfWork(null)
    if (data.value) {
      const val = []
      data.value.data.forEach((item) => {
        val.push({
          label: item.name,
          value: item.id
        })
      })
      pjData.value = val
    }
  } catch (e) {
    $toast.error(e)
  }
}
</script>
<template>
  <div>
    <div style="width: 100%; height: 100%; justify-content: flex-start; align-items: center; gap: 16px; display: inline-flex">
      <div style="width: 100px; height: 100px; background: #FEE299; border-radius: 9999px" />
      <div style="justify-content: flex-start; align-items: center; gap: 8px; display: flex">
        <div style="background: #2953A1; border-radius: 8px; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: inline-flex">
          <div style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 8px; padding-bottom: 8px; justify-content: center; align-items: center; gap: 8px; display: inline-flex">
            <div style="text-align: center; color: white; font-size: 12px; font-family: Poppins; font-weight: 600; line-height: 23px; word-wrap: break-word">
              Upload Foto Baru
            </div>
          </div>
        </div>
        <div style="border-radius: 8px; overflow: hidden; border: 1px #E2E8F0 solid; flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: inline-flex">
          <div style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 8px; padding-bottom: 8px; justify-content: center; align-items: center; gap: 8px; display: inline-flex">
            <div style="text-align: center; color: #696969; font-size: 12px; font-family: Poppins; font-weight: 600; line-height: 23px; word-wrap: break-word">
              Hapus
            </div>
          </div>
        </div>
      </div>
    </div>
    <ReInputText
      class="mb-2"
      label="Nama"
      type="text"
      placeholder="Masukkan Nama Anda"
    />
    <ReInputText
      class=" mb-2"
      label="Email"
      type="email"
      placeholder="Masukkan Email Anda"
    />
    <ReInputText
      class="mb-2"
      label="NUP"
      type="text"
      placeholder="Masukkan NUP Anda"
    />
    <ReInputText
      class="mb-2"
      label="NIK"
      type="text"
      placeholder="Masukkan NIK Anda"
    />
    <div class="mb-2">
      <DropDown
        label="Unit Kerja"
        placeholder="Pilih unit kerja"
        :data="unitData"
        @input="setUnit"
      />
    </div>
    <div class="">
      <DropDown
        label="Penanggung Jawab"
        placeholder="Pilih penanggung jawab"
        :data="pjData"
        @input="setPj"
      />
    </div>
    <div class="mt-8">
      <CButton class="w-full" text="Simpan" />
    </div>
  </div>
</template>

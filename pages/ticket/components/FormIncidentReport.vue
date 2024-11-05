<script lang="ts" setup>
const props = defineProps({
  modelValue: String,
  error: String
})

const emits = defineEmits([
  'update:modelValue'
])

const form = ref({
  'Penanganan Awal': '',
  'Deskripsi Insiden': '',
  'Akibat Insiden': '',
  'Dampak Terhadap Sistem Aplikasi': '',
  'Klasifikasi Insiden': '',
  'Hasil Analisa Solusi': '',
  'Solusi Penanganan Insiden': '',
  'Area Penyebab Insiden': '',
  'Verifikasi atas Hasil Penanganan': '',
  'Root Caused Analysis': '',
  'Lessons Learned': ''
})

const incidentClassification = ref([
  { label: 'Crisis', value: 'Crisis' },
  { label: 'Major', value: 'Major' },
  { label: 'Normal', value: 'Normal' },
  { label: 'Low', value: 'Low' }
])

const reasonIncidentArea = ref([
  { label: 'Human Error', value: 'Human Error'},
  { label: 'Hardware', value: 'Hardware' },
  { label: 'Jaringan', value: 'Jaringan' },
  { label: 'Aplikasi', value: 'Aplikasi' },
  { label: 'Database', value: 'Database' },
  { label: 'Lainnya', value: 'Lainnya' }
])

const jsonToString = ref()

watch(() => form.value, (val) => {
  parsing(val)
  emits('update:modelValue', jsonToString.value)
}, { deep: true })

function parsing (json: any) {
  let result = ''
  for (const key in json) {
    result
      += '<p>'
        + '<b>' + key + '</b> : ' + json[key]
        + '</p>'
  }
  jsonToString.value = result
}
</script>
<template>
  <div
    class="space-y-2 border-2 border-b-transparent rounded-lg p-2"
    :class="{
      'border-red-500 ring ring-offset-2 ring-offset-white ring-red-500 rounded-lg': error
    }"
  >
    <ReInputText
      v-model="form['Penanganan Awal']"
      :label="Object.keys(form)[0]"
      :require="false"
    />
    <ReInputText
      v-model="form['Deskripsi Insiden']"
      :label="Object.keys(form)[1]"
      :require="false"
    />
    <ReInputText
      v-model="form['Akibat Insiden']"
      :label="Object.keys(form)[2]"
      :require="false"
    />
    <ReInputText
      v-model="form['Dampak Terhadap Sistem Aplikasi']"
      :label="Object.keys(form)[3]"
      :require="false"
    />
    <DropDown
      :required="false"
      :label="Object.keys(form)[4]"
      :data="incidentClassification"
      :value="form['Klasifikasi Insiden']"
      @input="form['Klasifikasi Insiden'] = $event.value"
    />
    <ReInputText
      v-model="form['Hasil Analisa Solusi']"
      :label="Object.keys(form)[5]"
      :require="false"
    />
    <ReInputText
      v-model="form['Solusi Penanganan Insiden']"
      :label="Object.keys(form)[6]"
      :require="false"
    />
    <DropDown
      :required="false"
      :label="Object.keys(form)[7]"
      :data="reasonIncidentArea"
      :value="form['Area Penyebab Insiden']"
      @input="form['Area Penyebab Insiden'] = $event.value"
    />
    <ReInputText
      v-model="form['Verifikasi atas Hasil Penanganan']"
      :label="Object.keys(form)[8]"
      :require="false"
    />
    <ReInputText
      v-model="form['Root Caused Analysis']"
      :label="Object.keys(form)[9]"
      :require="false"
    />
    <ReInputText
      v-model="form['Lessons Learned']"
      :label="Object.keys(form)[10]"
      :require="false"
    />
  </div>
</template>
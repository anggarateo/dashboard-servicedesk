<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const props = defineProps({
  codeTicket: {
    type: String,
    required: true
  }
})

const form = ref({
  type: ''
})
const isPreview = ref(false)
const mappingUrl = 'https://b-report.bpbatam.go.id/birt-viewer/preview?__report=bcare/'
const params = ref()
const openOptionDownload = ref(false)

const rules = computed(() => {
  return {
    type: {
      required
    }
  }
})
const v$ = useVuelidate(rules, form.value)

function checkForm (from: string) {
  v$.value.$validate()

  if (v$.value.$error) {

    isPreview.value = false
    params.value = ''
  
  } else {
    
    params.value = `${form.value.type}&cd_ticket=${props.codeTicket}`

    if (from === 'preview') {

      isPreview.value = true
    
    } else if (from === 'download') {

      downloadAs('pdf')
      // openOptionDownload.value = !openOptionDownload.value
    
    }
  }
}
function downloadAs (type: string) {
  const popout = window.open(mappingUrl + params.value + '&__format=' + type)
  popout.focus()
  popout.onblur = function () { popout.close() }
}
</script>

<template>
  <div class="space-y-4 rounded-lg border p-4 my-2">
    <DropdownPagination
      v-model="form.type"
      api-module="report"
      api-method="getReportType"
      :api-params="{ type: 'form' }"
      option-label="jenis_laporan"
      option-value="rpt_design"
      label="Jenis form"
      placeholder="Pilih jenis form"
      :error="v$.type?.$error ? v$.type?.$errors[0].$message : ''"
      @change="v$.type?.$touch"
    />

    <div class="flex justify-end items-center gap-2">
        <CButton
          text="Download"
          type="outlined"
          @click="checkForm('download')"
        />

      <CButton
        text="Preview"
        @click="checkForm('preview')"
      />
    </div>

    <iframe v-if="isPreview" :src="mappingUrl + params" class="w-full border-4 rounded-md border-gray-200" style="height: 80vh" />
    
    <div v-else class="flex flex-col gap-4 justify-center items-center mt-32">
      <img src="@/assets/img/EmptyReport.png" alt="Empty State" width="64" height="64" class="opacity-50">
      
      <p class="text-lg text-gray-400 text-center">
        Belum ada data yang ditampilkan
      </p>
    </div>
  </div>
</template>
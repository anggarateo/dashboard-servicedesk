<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import ApiSelectLayanan from './components/ApiSelectLayanan.vue'
import ApiSelectJenisLaporan from './components/ApiSelectJenisLaporan.vue'

useHead({ title: 'Laporan' })

definePageMeta({
  alias: '/laporan'
})

const { $localUser, $downloadFile } = useNuxtApp()
const form = reactive({
  jenisLaporan: null,
  periodeLaporan: null,
  units_of_work_id: null,
  layanan: null
})
const mappingUrl = ref('')
const isPreview = ref(false)
const openOptionDownload = ref(false)
const serviceParams = ref({
  units_of_work_id: ''
})

const rules = computed(() => {
  return {
    periodeLaporan: {
      required: helpers.withMessage('Periode laporan is required', required)
    },
    units_of_work_id: {
      required: helpers.withMessage('Unit kerja is required', required)
    }
    // layanan: {
    //   required: helpers.withMessage('Layanan is required', required)
    // }
  }
})
const v$ = useVuelidate(rules, form)

onMounted(() => {
  form.units_of_work_id = $localUser().units_of_work_id || null
})

watch(() => form.units_of_work_id, (val) => {
  serviceParams.value.units_of_work_id = val
})

const downloadAs = (type) => {
  $downloadFile(
    {
      filename: 'Laporan'
    },
    'https://b-report.bpbatam.go.id/birt-viewer/preview?__report=bcare/' + mappingUrl.value + `&user_id=${useNuxtApp().$localUser().id}` + '&__format=' + type,
    '_blank'
  )
}

const handlePreview = (isDownload = false) => {
  v$.value.$validate()

  if (!v$.value.$error) {
    isDownload ? openOptionDownload.value = !openOptionDownload.value : isPreview.value = true

    const dateObjectStart = new Date(form.periodeLaporan[0])
    const formattedDateStart = dateObjectStart.toISOString().split('T')[0]
    const dateObjectEnd = new Date(form.periodeLaporan[1])
    const formattedDateEnd = dateObjectEnd.toISOString().split('T')[0]

    mappingUrl.value = ((form.jenisLaporan || 'report_detail_transaction.rptdesign') + '&service_id=' + (form.layanan || '') + '&sDate=' + (formattedDateStart || '') + '&eDate=' + (formattedDateEnd || '') + `&user_id=${useNuxtApp().$localUser().id}` + `&units_of_work_id=${form.units_of_work_id}`)
  } else {
    isPreview.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <div class="w-full min-h-screen p-4 bg-white rounded-lg shadow-md space-y-2">
      <h1 class="text-2xl font-bold mb-6">
        Reporting
      </h1>

      <div class="flex flex-col sm:flex-row gap-4 gap-y-2">
        <div class="w-full sm:w-1/2">
          <label for="jenisLaporan">Jenis Laporan</label>
          <ApiSelectJenisLaporan v-model="form.jenisLaporan" class="style-select" placeholder="Pilih jenis laporan" />
        </div>
        <div class="w-full sm:w-1/2">
          <label for="periodeLaporan">Periode Laporan<span class="text-error">*</span></label>
          <DatePicker v-model="form.periodeLaporan" :range="true" format="yyyy-MM-dd" />
          <ReErrorText v-if="v$.periodeLaporan.$error" :text="v$.periodeLaporan.$error ? v$.periodeLaporan.$errors[0].$message : ''" />
        </div>
      </div>
      <DropdownPagination
        v-model="form.units_of_work_id"
        :api-params="$checkPermission('laporan', 'view')
          ? {
            units_of_work_id: $localUser().units_of_work_id,
            is_flow_exist: true
          }
          : {
            is_flow_exist: true
          }"
        api-module="global"
        api-method="getUnitOfWork"
        option-label="name"
        option-value="id"
        uniq-by="id"
        label="Unit Kerja"
        placeholder="Pilih unit kerja"
        :disabled="$localUser().units_of_work_id"
        :error="v$.units_of_work_id.$error ? v$.units_of_work_id.$errors[0].$message : ''"
        @change="v$.units_of_work_id.$touch"
      />
      <div>
        <label for="layanan">Layanan</label>
        <ApiSelectLayanan
          v-model="form.layanan"
          :api-params="serviceParams"
          class="style-select"
          placeholder="Pilih layanan"
        />
        <!-- <ReErrorText v-if="v$.layanan.$error" :text="v$.layanan.$error ? v$.layanan.$errors[0].$message : ''" /> -->
      </div>

      <div class="flex justify-end my-4">
        <CButton text="Preview" :rounded="true" @click="handlePreview" />
      </div>

      <div class="mt-8">
        <div class="flex justify-end">
          <div class="relative">
            <CButton
              text="Download Dokumen"
              :type="'outlined'"
              icon="ph:plus-bold"
              icon-position="left"
              @click="handlePreview(true)"
            />
            <div v-show="openOptionDownload" class="absolute inset-x-0 mt-1 rounded-lg shadow-md bg-white">
              <div class="flex flex-col divide-y">
                <div class="inline-flex items-center gap-2 p-2 cursor-pointer rounded-t-lg hover:bg-blue-50" @click="downloadAs('pdf')">
                  <Icon name="codicon:file-pdf" class="text-3xl" />

                  <span class="font-medium text-gray-600">as Pdf</span>
                </div>

                <div class="inline-flex items-center gap-2 p-2 cursor-pointer rounded-b-lg hover:bg-blue-50" @click="downloadAs('xlsx')">
                  <Icon name="bi:filetype-xlsx" class="text-3xl" />

                  <span class="font-medium text-gray-600">as Xlsx</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <!-- Empty State -->
          <iframe v-if="isPreview" :src="'https://b-report.bpbatam.go.id/birt-viewer/preview?__report=bcare/' + mappingUrl" class="w-full border-4 rounded-md border-gray-200" style="height: 80vh" />
          <div v-else class="flex flex-col gap-4 justify-center items-center mt-32">
            <img src="@/assets/img/EmptyReport.png" alt="Empty State" width="64" height="64" class="opacity-50">
            <p class="text-lg text-gray-400">
              Belum ada data yang ditampilkan
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-select {
  --vs-search-input-placeholder-color: #B4B4B4;
  --vs-line-height: 36px;
  --vs-dropdown-max-height: 135px;
  --vs-border-radius: 0.5rem;
}

.dp__theme_light {
  --dp-input-padding: 10px
}
</style>

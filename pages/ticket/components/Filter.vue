<script lang="ts" setup>
const emits = defineEmits(['filter', 'hide'])

const { $formatDate } = useNuxtApp()

const initForm = () => ({
  q: '',
  user_complainant: '',
  user_complainant_email: '',
  user_complainant_phone: '',
  title_or_content: '',
  status_ticket_id: '',
  impact_level_id: '',
  service_id: '',
  it_asset_id: '',
  complaint_classification_id: '',
  complaint_category_id: '',
  report_source_id: '',
  transaction_date: Array(),
  units_of_work_id: ''
})
const form = ref(initForm())
const daterange = ref()
const params = ref({
  units_of_work_id: ''
})

watch(() => form.value, (val) => {
  params.value.units_of_work_id = val.units_of_work_id
  emits('filter', val)
}, { deep: true })
watch(() => daterange.value, (val) => {
  if (val?.length === 2) {
    form.value.transaction_date = [
      $formatDate(val[0], 'yyyy-MM-dd'),
      $formatDate(val[1], 'yyyy-MM-dd')
    ]
  }
})
</script>
<template>
  <div class="m-4 p-4 border-2 border-stroke rounded-lg space-y-2">
    <div class="flex justify-between items-center">
      <CButton
        text="Sembunyikan Filter"
        type="outlined"
        @click="emits('hide')"
      />
      <CButton
        v-if="JSON.stringify(form) !== JSON.stringify(initForm())"
        text="Hapus Filter"
        color="error"
        @click="daterange = null, form = initForm()"
      />
    </div>
    <div class="flex flex-wrap gap-4">
      <ReInputText
        v-model="form.q"
        type="text"
        label="Kode Tiket"
        class="w-full lg:w-[32%]"
        :require="false"
      />
      <ReInputText
        v-model="form.user_complainant"
        type="text"
        label="Nama Pemohon"
        class="w-full lg:w-[32%]"
        :require="false"
      />
      <ReInputText
        v-model="form.user_complainant_email"
        type="email"
        label="Email Pemohon"
        class="w-full lg:w-[32%]"
        :require="false"
      />
      <ReInputText
        v-model="form.user_complainant_phone"
        type="text"
        label="No. Telp. Pemohon"
        class="w-full lg:w-[32%]"
        :require="false"
      />
      <ReInputText
        v-model="form.title_or_content"
        type="text"
        label="Subjek/Deskripsi TIket"
        class="w-full lg:w-[32%]"
        :require="false"
      />
      <div class="space-y-3">
        <label for="transaction_date">Tanggal Tiket Masuk</label>
        <DatePicker
          v-model="daterange"
          range
          format="dd/MM/yyyy"
        />
      </div>
      <DropdownPagination
        v-model="form.status_ticket_id"
        api-module="ticket"
        api-method="getStatusTicket"
        option-label="name"
        option-value="id"
        label="Status"
        :required="false"
        clearable
        class="w-full lg:w-1/3"
      />
      <DropdownPagination
        v-model="form.impact_level_id"
        api-module="ticket"
        api-method="getImpacts"
        option-label="name"
        option-value="id"
        label="Tingkat Dampak"
        :required="false"
        clearable
        class="w-full lg:w-1/5"
      />
      <DropdownPagination
        v-model="form.units_of_work_id"
        api-module="global"
        api-method="getUnitOfWork"
        :api-params="{ is_flow_exist: true }"
        option-label="name"
        option-value="id"
        uniq-by="id"
        label="Unit Kerja"
        :required="false"
        clearable
        class="w-full"
      />
      <DropdownPagination
        v-model="form.service_id"
        api-module="ticket"
        api-method="getServices"
        :api-params="params"
        watch-params
        option-label="name"
        option-value="id"
        label="Layanan"
        :required="false"
        clearable
        class="w-full"
      />
      <DropdownPagination
        v-model="form.it_asset_id"
        api-module="appAsset"
        api-method="getList"
        option-label="name"
        option-value="id"
        label="IT Asset"
        :required="false"
        clearable
        class="w-full lg:w-1/2"
      />
      <DropdownPagination
        v-model="form.complaint_category_id"
        api-module="complaintCategory"
        api-method="getList"
        option-label="name"
        option-value="id"
        label="Kategori Aduan"
        :required="false"
        clearable
        response-data="result"
        class="w-full lg:w-1/3"
      />
      <DropdownPagination
        v-model="form.report_source_id"
        api-module="ticket"
        api-method="getReportSources"
        option-label="name"
        option-value="id"
        label="Sumber Laporan"
        :required="false"
        clearable
        class="w-full lg:w-1/5"
      />
      <DropdownPagination
        v-model="form.complaint_classification_id"
        api-module="classification"
        api-method="getList"
        option-label="name"
        option-value="id"
        label="Klasifikasi Aduan"
        :required="false"
        clearable
        response-data="result"
        class="w-full lg:w-2/3"
      />
    </div>
    <div class="flex justify-between items-center lg:hidden">
      <CButton
        text="Sembunyikan Filter"
        type="outlined"
        @click="emits('hide')"
      />
      <CButton
        v-if="JSON.stringify(form) !== JSON.stringify(initForm())"
        text="Hapus Filter"
        color="error"
        @click="daterange = null, form = initForm()"
      />
    </div>
  </div>
</template>
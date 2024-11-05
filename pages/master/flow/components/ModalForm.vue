<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useModal } from 'vue-final-modal'
import { VueDraggableNext } from 'vue-draggable-next'
import ApiSelectLayanan from '@/pages/master/flow/components/ApiSelectLayanan.vue'
import ApiSelectJenisSla from '@/pages/master/flow/components/ApiSelectJenisSla.vue'
import ApiSelectSla from '@/pages/master/flow/components/ApiSelectSla.vue'
import ApiSelectAgent from '@/pages/master/flow/components/ApiSelectAgent.vue'
import ModalInfo from '@/components/ModalInfo.vue'
import ApiSelectJenisLaporan from '@/pages/laporan/components/ApiSelectJenisLaporan.vue'

const { $toast, $api } = useNuxtApp()
const emits = defineEmits(['close', 'submitted'])

const state = reactive({
  drage: false,
  dataLayanan: [],
  dataJenisSLA: [],
  form: {
    service_id: '',
    stages: [
      {
        no: 1,
        name: '',
        type_sla_id: null,
        sla_id: '',
        sla_custom: { sla_low: 0, sla_medium: 0, sla_height: 0, sla_unit: '', same_sla: false },
        agents: [],
        is_updated: false,
        is_deleted: false,
        is_show: true,
        path_report: '',
        tag: ''
      }
    ]
  }
})

const rules = computed(() => {
  return {
    form: {
      service_id: {
        required: helpers.withMessage('Required', required)
      },
      stages: {
        required,
        $each: helpers.forEach({
          name: {
            required: helpers.withMessage('Required', required)
          },
          type_sla_id: {
            required: helpers.withMessage('Required', required)
          },
          agents: {
            required: helpers.withMessage('Required', required)
          }
        })
      }
    }
  }
})

const v$ = useVuelidate(rules, state)

const addFormStage = () => {
  state.form.stages.push({
    no: state.form.stages.length + 1,
    name: '',
    type_sla_id: '',
    sla_id: '',
    sla_custom: { sla_low: 0, sla_medium: 0, sla_height: 0, sla_unit: '', same_sla: false },
    agents: [],
    is_updated: false,
    is_deleted: false,
    is_show: true,
    path_report: '',
    tag: ''
  })
}

const removeFormStage = (index) => {
  state.form.stages.splice(index, 1)
}

const resetForm = () => {
  state.form = {
    service_id: '',
    stages: [
      {
        no: 1,
        name: '',
        type_sla_id: null,
        sla_id: '',
        sla_custom: { sla_low: 0, sla_medium: 0, sla_height: 0, sla_unit: '', same_sla: false },
        agents: [],
        is_updated: false,
        is_deleted: false,
        is_show: true,
        path_report: '',
        tag: ''
      }
    ]
  }
}

const alertTitle = ref('')

const changeAlert = (title) => {
  alertTitle.value = title
  alert.open()
}

const alert = useModal({
  component: ModalInfo,
  attrs: {
    title: alertTitle.value,
    info: true,
    type: 'change',
    onCloseInfo () {
      alert.close()
    },
    onCloseAll () {
      alert.close()
      v$.value.$reset()
      resetForm()
      emits('close')
    }
  }
})

const loading = ref(false)

const submitData = async () => {
  v$.value.$validate()

  if (!v$.value.$error) {
    const payload = {
      service_id: state.form.service_id,
      stages: state.form.stages.map((val) => {
        return {
          ...(val.type_sla_id?.code === 'fixed_sla' && { sla_id: val.sla_id.id }),
          ...(val.type_sla_id?.code === 'fixed_flow' && { sla_custom: { ...val.sla_custom } }),
          type_sla_id: val.type_sla_id?.id,
          name: val.name,
          agents: val.agents.map(val => ({ user_id: val.id })),
          path_report: val.path_report,
          tag: val.tag
        }
      })
    }

    loading.value = true

    const { data, error, pending } = await $api.flow.postFlow(payload)

    if (data.value) {
      $toast.success('Berhasil', { position: 'bottom-right' })
      resetForm()
      emits('submitted', true)
      v$.value.$reset()
    }

    if (error.value) {
      $toast.error(error.value.data.message, { position: 'bottom-right' })
    }

    if (pending.value) {
      loading.value = pending.value
    }

    loading.value = false
  } else {
    $toast.warning('Lengkapi form dulu', { position: 'bottom-right' })
  }
}

const collapseAll = () => {
  state.form.stages.forEach((val, index) => {
    val.is_show = false
  })
}

const units = ref([
  { label: 'Hari', value: 'day' },
  { label: 'Jam', value: 'hour' },
  { label: 'Menit', value: 'minute' }
])

watch(() => state.form.stages, (val) => {
  if (val) {
    val.forEach((el, i) => {
      if (el.sla_custom.same_sla) {
        state.form.stages[i].sla_custom.sla_height = el.sla_custom.sla_low
        state.form.stages[i].sla_custom.sla_medium = el.sla_custom.sla_low
      }
    })
  }
}, { deep: true })
</script>

<template>
  <ModalFullscreen title="Tambah Alur" :width="4" @close-fullscreen="changeAlert('Keluar tanpa menyimpan?')" @keypress.enter="submitData">
    <div class="p-4 overflow-auto">
      <div class="flex flex-col space-y-4">
        <div>
          <label for="layanan">Layanan <span class="text-error">*</span></label>
          <ApiSelectLayanan
            v-model="state.form.service_id"
            placeholder="Pilih layanan"
          />
          <ReErrorText :text="v$.form.service_id.$error ? v$.form.service_id.$errors[0].$message : ''" />
        </div>
        <div class="flex justify-end">
          <CButton text="Collapse All" @click="collapseAll" />
        </div>
        <div class="px-4 py-3">
          <VueDraggableNext class="cursor-move" :list="state.form.stages">
            <transition-group>
              <div v-for="(stage, index) in state.form.stages" :key="index">
                <div class="mb-4 border-b pb-2">
                  <div class="flex flex-row items-center justify-between">
                    <div class="flex flex-row space-x-2 items-center">
                      <Icon v-show="index != 0" name="carbon:menu" size="16" class="text-gray-400" />
                      <h1 class="text-lg text-primary uppercase font-bold">
                        Tahapan {{ index+1 }}
                      </h1>
                    </div>
                    <div class="flex flex-row items-center space-x-2">
                      <button v-show="index != 0" class="p-2" @click="removeFormStage(index)">
                        <Icon name="ph:trash-fill" size="24" class="text-error" />
                      </button>
                      <button class="p-2" @click="stage.is_show = !stage.is_show">
                        <Icon name="bytesize:chevron-bottom" size="24" class="text-primary" :class="[stage.is_show ? 'rotate-180' : '0']" />
                      </button>
                    </div>
                  </div>
                </div>
                <div v-show="stage.is_show" class="px-2.5">
                  <div class="mb-4">
                    <ReInputText v-model="stage.name" label="Nama Tahapan" placeholder="Masukan nama tahapan" />
                    <div v-if="v$.form.stages.$error">
                      <ReErrorText v-for="error in v$.form.stages.$each.$response.$errors[index].name" :key="error" :text="error.$message" />
                    </div>
                  </div>
                  <div class="mb-4">
                    <label for="sla">Jenis SLA <span class="text-error">*</span></label>
                    <ApiSelectJenisSla v-model="stage.type_sla_id" placeholder="Pilih jenis SLA" />
                    <div v-if="v$.form.stages.$error">
                      <ReErrorText v-for="error in v$.form.stages.$each.$response.$errors[index].type_sla_id" :key="error" :text="error.$message" />
                    </div>
                  </div>
                  <div v-show="stage.type_sla_id && stage.type_sla_id.code == 'fixed_sla'" class="mb-4">
                    <label for="sla">SLA <span class="text-error">*</span></label>
                    <ApiSelectSla v-model="stage.sla_id" placeholder="Pilih SLA" />
                  </div>
                  <div v-show="stage.type_sla_id && stage.type_sla_id.code == 'fixed_flow'" class="mb-4 space-y-2">
                    <DropDown
                      label="Satuan SLA"
                      :data="units"
                      @input="stage.sla_custom.sla_unit = $event.value"
                    />
                    <div class="flex justify-between">
                      <label for="custom_sla">SLA <span class="text-error">*</span></label>
                      <div class="h-full items-center" style="justify-content: flex-end; gap: 8px; display: inline-flex">
                        <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
                          <div style="width: 8px; height: 8px; background: #009376; border-radius: 90px" />
                          <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; letter-spacing: 0.36px; word-wrap: break-word">
                            Rendah
                          </div>
                        </div>
                        <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
                          <div style="width: 8px; height: 8px; background: #2953A1; border-radius: 90px" />
                          <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; letter-spacing: 0.36px; word-wrap: break-word">
                            Sedang
                          </div>
                        </div>
                        <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
                          <div style="width: 8px; height: 8px; background: #B01030; border-radius: 90px" />
                          <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; word-wrap: break-word">
                            Tinggi
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="stage.sla_custom.sla_unit" class="inline-flex items-center space-x-2">
                      <Icon name="material-symbols-light:info" class="text-primary" size="20" />
                      <span class="text-sm text-primary">Inputan dalam satuan {{ localeString(stage.sla_custom.sla_unit) }}</span>
                    </div>
                    <div class="flex flex-row justify-between space-x-4 mb-1">
                      <ReInputText
                        v-model="stage.sla_custom.sla_low"
                        style="background: rgba(0, 147, 118, 0.15);"
                        placeholder="Rendah"
                        :require="false"
                      />
                      <ReInputText
                        v-model="stage.sla_custom.sla_medium"
                        style="background: rgba(41, 83, 161, 0.12);"
                        placeholder="Sedang"
                        :require="false"
                        :disabled="stage.sla_custom.same_sla"
                      />
                      <ReInputText
                        v-model="stage.sla_custom.sla_height"
                        style="background: rgba(176, 16, 48, 0.12);"
                        placeholder="Tinggi"
                        :require="false"
                        :disabled="stage.sla_custom.same_sla"
                      />
                    </div>
                    <div class="text-sm">
                      <CheckBox
                        :id="index + 'same'"
                        v-model="stage.sla_custom.same_sla"
                        label="Samakan Nilai"
                      />
                    </div>
                  </div>
                  <div class="relative mb-4">
                    <label for="agent">Pelaksana <span class="text-error">*</span></label>
                    <ApiSelectAgent v-model="stage.agents" placeholder="Pilih Agent" />
                    <div v-if="v$.form.stages.$error">
                      <ReErrorText v-for="error in v$.form.stages.$each.$response.$errors[index].agents" :key="error" :text="error.$message" />
                    </div>
                  </div>
                  <div class="mb-4">
                    <label for="form_report">Form Laporan</label>
                    <ApiSelectJenisLaporan
                      v-model="stage.path_report"
                      param-type="ds_report"
                      class="style-select"
                      placeholder="Pilih form laporan"
                    />
                  </div>
                  <div class="mb-4">
                    <ReInputText v-model="stage.tag" label="Tag" placeholder="Tag" :require="false" />
                  </div>
                </div>
                <div class="flex justify-center mb-3">
                  <svg width="8" height="25" viewBox="0 0 8 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line
                      x1="3"
                      y1="24"
                      x2="3"
                      y2="1"
                      stroke="#7F98C7"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-dasharray="6 6"
                    />
                  </svg>
                </div>
              </div>
            </transition-group>
          </VueDraggableNext>
          <div class="flex justify-center">
            <button class="bg-primary-100 text-primary rounded-full" @click="addFormStage">
              <Icon name="ic:round-plus" size="24" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <CButton text="Simpan" class="w-full" :loading="loading" @click="submitData" />
    </template>
  </ModalFullscreen>
</template>

<style scoped>
.select-custom {
  --vs-search-input-placeholder-color: #B4B4B4;
  --vs-line-height: 36px;
  --vs-dropdown-max-height: 435px;
  --vs-border-radius: 0.5rem;
  --vs-dropdown-option-padding: 12px 20px;
}

.dp__theme_light {
  --dp-input-padding: 10px
}
</style>

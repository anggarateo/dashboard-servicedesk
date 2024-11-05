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
import Toggle from '@vueform/toggle'
import ApiSelectJenisLaporan from '@/pages/laporan/components/ApiSelectJenisLaporan.vue'

definePageMeta({
  alias: '/alur' // sesuai dari api/role-menu
})

const { $toast, $api } = useNuxtApp()
const emits = defineEmits(['close', 'submitted'])
const route = useRoute()
const router = useRouter()
const state = reactive({
  dataLayanan: [],
  dataJenisSLA: [],
  form: {
    service_id: '',
    is_flow_show_in_user: false,
    stages: []
  }
})
const deletedAgents = ref([])

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
    sequence: (state.form.stages.length + 1).toString().padStart(3, '0'),
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

const units = ref([
  { label: 'Hari', value: 'day' },
  { label: 'Jam', value: 'hour' },
  { label: 'Menit', value: 'minute' }
])

const alertTitle = ref('')

const changeAlert = (title) => {
  alertTitle.value = title
  alert.open()
}

const alertRemoveStage = useModal({
  component: ModalInfo,
  attrs: {
    title: 'Apakah Anda yakin?',
    info: true,
    type: 'delete',
    onCloseInfo () {
      alertRemoveStage.close()
    },
    onCloseAll () {
      alertRemoveStage.close()
      removeStage()
    }
  }
})

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
      useRouter().back()
    }
  }
})

const stageId = ref('')
const openAlertRemoveStage = (id) => {
  alertRemoveStage.open()
  stageId.value = id
}
const removeStage = () => {
  const filteredData = state.form.stages.filter(el => !el.is_deleted)
  const findByIndex = filteredData.findIndex(el => el.id === stageId.value)

  filteredData[findByIndex].is_deleted = true
  filteredData[findByIndex].is_updated = false
}

async function getListById () {
  const { data, error } = await $api.flow.getListById(route.params.id, null, null)

  if (data.value) {
    const result = {
      id: data.value.data.id,
      service_id: data.value.data.service,
      is_flow_show_in_user: data.value.data.is_flow_show_in_user,
      stages: data.value.data.stages.map(stage => ({
        ...stage,
        agents: stage.agents.map(val => ({
          ...val,
          is_updated: true,
          is_deleted: false
        })),
        type_sla_id: stage.type_sla,
        sla_id: stage.sla,
        is_show: true,
        is_updated: true,
        is_deleted: false,
        sla_custom: {
          ...stage.sla_custom,
          sla_unit: units.value.filter(el => el.value === stage.sla_custom?.sla_unit),
          same_sla: false
        }
      }))
    }

    state.form = result
  }

  if (error.value) {
    $toast.error('Unable to get data.', { position: 'bottom-right' })
  }
}

const submitData = async () => {
  v$.value.$validate()

  if (!v$.value.$error) {
    await deletedAgents.value.forEach((dAgent) => {
      state.form.stages.forEach((stage) => {
        if (stage.id === dAgent.stage_id) {
          stage.agents.push(...dAgent.agents)
        }
      })
    })

    const payload = {
      id: state.form.id,
      service_id: state.form.service_id?.id,
      is_flow_show_in_user: state.form.is_flow_show_in_user,
      stages: state.form.stages.map((val) => {
        return {
          ...(val.type_sla_id?.code === 'fixed_sla' && { sla_id: val.sla_id.id }),
          ...(val.type_sla_id?.code === 'fixed_flow' && {
            sla_custom: {
              sla_low: val.sla_custom.sla_low,
              sla_medium: val.sla_custom.sla_medium,
              sla_height: val.sla_custom.sla_height,
              sla_unit: typeof val.sla_custom.sla_unit === 'string' ? val.sla_custom.sla_unit : val.sla_custom.sla_unit[0].value,
            }
          }),
          id: val.id,
          sequence: Number(val.sequence),
          type_sla_id: val.type_sla_id?.id,
          name: val.name,
          agents: val.agents.map(val => ({ id: val.flow_agent_id, user_id: val.id, is_updated: val.is_updated, is_deleted: val.is_deleted })),
          is_updated: val.is_updated,
          is_deleted: val.is_deleted,
          path_report: val.path_report,
          tag: val.tag
        }
      })
    }

    const { data, error } = await $api.flow.updateFlow(useRoute().params.id, payload)

    if (data.value) {
      $toast.success('Berhasil', { position: 'bottom-right' })
      router.go(-1)
      emits('submitted', true)
      v$.value.$reset()
    }

    if (error.value) {
      $toast.error(error.value.data.message, { position: 'bottom-right' })
    }
  } else {
    $toast.warning('Lengkapi form dulu', { position: 'bottom-right' })
  }
}

onMounted(() => {
  getListById()
})

const filteredData = computed(() => {
  return state.form.stages.filter(el => !el.is_deleted)
})

const updateOrder = () => {
  filteredData.value.forEach((field, index) => {
    field.sequence = (index + 1).toString().padStart(3, '0')
  })
}

const collapseAll = () => {
  state.form.stages.forEach((val) => {
    val.is_show = false
  })
}

const optionDeselectingAgent = (val, index, stageId, sequence) => {
  const findByIndex = filteredData.value[index].agents.findIndex(el => el.id === val.id)
  if (findByIndex !== -1) {
    const findStageIndex = deletedAgents.value.findIndex(el => el.stage_id === stageId)
    if (findStageIndex !== -1) {
      deletedAgents.value[findStageIndex].agents.push({
        ...filteredData.value[index].agents[findByIndex],
        is_deleted: true,
        is_updated: false
      })

      return
    }

    deletedAgents.value.push({
      stage_id: stageId,
      sequence,
      agents: [{
        ...filteredData.value[index].agents[findByIndex],
        is_deleted: true,
        is_updated: false
      }]
    })
  }
}

const optionSelected = (val) => {
  console.log(val)
}

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
  <div class="p-4">
    <div class="bg-white shadow border p-4 rounded-xl">
      <div class="flex flex-row justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">
          Edit Alur
        </h1>
        <div class="flex flex-col sm:flex-row gap-4 gap-y-2">
          <CButton text="Batalkan" color="error" @click="changeAlert" />
          <CButton text="Simpan" @click="submitData" />
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <div>
          <label for="layanan">Layanan <span class="text-error">*</span></label>
          <ApiSelectLayanan
            v-model="state.form.service_id"
            :disabled="true"
          />
          <ReErrorText :text="v$.form.service_id.$error ? v$.form.service_id.$errors[0].$message : ''" />
        </div>
        <div class="flex gap-2">
          <h1>
            Tampilkan di halaman depan?
          </h1>
          <Toggle v-model="state.form.is_flow_show_in_user" />
        </div>
        <div class="flex justify-end">
          <CButton text="Collapse All" @click="collapseAll" />
        </div>
        <div class="px-4 py-3">
          <VueDraggableNext
            :list="state.form.stages"
            class="cursor-move"
            @end="updateOrder"
          >
            <div
              v-for="(stage, index) in filteredData"
              :key="index"
            >
              <div class="mb-4 border-b pb-2">
                <div class="flex flex-row items-center justify-between">
                  <div class="flex flex-row space-x-2 items-center">
                    <Icon v-show="index != 0" name="carbon:menu" size="16" class="text-gray-400" />
                    <h1 class="text-lg text-primary uppercase font-bold">
                      Tahapan {{ index + 1 }}
                    </h1>
                  </div>
                  <div class="flex flex-row items-center space-x-2">
                    <button v-show="index != 0" class="p-2" @click="openAlertRemoveStage(stage.id)">
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
                  <ReInputText v-model="stage.name" label="Nama Tahapan" />
                  <div v-if="v$.form.stages.$error">
                    <ReErrorText v-for="error in v$.form.stages.$each.$response.$errors[index].name" :key="error" :text="error.$message" />
                  </div>
                </div>
                <div class="mb-4">
                  <label for="sla">Jenis SLA <span class="text-error">*</span></label>
                  <ApiSelectJenisSla v-model="stage.type_sla_id" />
                  <div v-if="v$.form.stages.$error">
                    <ReErrorText v-for="error in v$.form.stages.$each.$response.$errors[index].name" :key="error" :text="error.$message" />
                  </div>
                </div>
                <div v-show="stage.type_sla_id.code == 'fixed_sla'" class="mb-4">
                  <label for="sla">SLA <span class="text-error">*</span></label>
                  <ApiSelectSla v-model="stage.sla_id" />
                </div>
                <div v-show="stage.type_sla_id && stage.type_sla_id.code == 'fixed_flow'" class="mb-4 space-y-4">
                  <DropDown
                    v-if="(stage.type_sla_id && stage.type_sla_id.code == 'fixed_flow') || stage.sla_custom.sla_unit"
                    label="Satuan SLA"
                    :value="stage.sla_custom.sla_unit"
                    :data="units"
                    @input="stage.sla_custom.sla_unit = $event.value"
                  />
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <label for="custom_sla">SLA <span class="text-error">*</span></label>
                      <div v-if="stage.sla_custom?.sla_unit?.length" class="inline-flex items-center space-x-2 ml-2">
                        <Icon name="material-symbols-light:info" class="text-primary" size="20" />
                        <span class="text-sm text-primary">Inputan dalam satuan {{ typeof stage.sla_custom.sla_unit === 'string' ? localeString(stage.sla_custom.sla_unit) : localeString(stage.sla_custom.sla_unit[0].value) }}</span>
                      </div>
                    </div>
                    <div class="flex flex-row justify-between space-x-4 mb-1">
                      <ReInputText v-model="stage.sla_custom.sla_low" placeholder="Rendah" :require="false" />
                      <ReInputText v-model="stage.sla_custom.sla_medium" placeholder="Sedang" :require="false" :disabled="stage.sla_custom.same_sla" />
                      <ReInputText v-model="stage.sla_custom.sla_height" placeholder="Tinggi" :require="false" :disabled="stage.sla_custom.same_sla" />
                    </div>
                    <div class="text-sm">
                      <CheckBox
                        :id="index + 'same'"
                        v-model="stage.sla_custom.same_sla"
                        label="Samakan Nilai"
                      />
                    </div>
                  </div>
                </div>
                <div class="relative mb-4">
                  <label for="agent">Pelaksana <span class="text-error">*</span></label>
                  <ApiSelectAgent v-model="stage.agents" @option:selected="optionSelected" @option:deselecting="optionDeselectingAgent($event, index, stage.id, stage.sequence)" />
                  <div v-if="v$.form.stages.$error">
                    <ReErrorText v-for="error in v$.form.stages.$each.$response.$errors[index].name" :key="error" :text="error.$message" />
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
          </VueDraggableNext>
          <div class="flex justify-center">
            <button class="bg-primary-100 text-primary rounded-full" @click="addFormStage">
              <Icon name="ic:round-plus" size="24" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
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

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const props = defineProps({
  modelValue: Boolean,
  idTicket: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['update:modelValue', 'success'])
const shownModal = ref(props.modelValue)
const units = ref([
  { label: 'Hari', value: 'day' },
  { label: 'Jam', value: 'hour' },
  { label: 'Menit', value: 'minute' }
])
const form = ref({
  sla_low: null,
  sla_medium: null,
  sla_height: null,
  sla_unit: '',
  same: false
})
const rules = computed(() => {
  return {
    sla_low: {
      required
    },
    sla_medium: {
      required
    },
    sla_height: {
      required
    },
    sla_unit: {
      required
    }
  }
})
const v$ = useVuelidate(rules, form.value)
const { $api, $toast } = useNuxtApp()
const loading = ref(false)

function closeConfirm () {
  v$.value.$reset()
  shownModal.value = false
  emits('update:modelValue', false)
}
function checkForm () {
  v$.value.$validate()
  if (v$.value.$error) {
    $toast.warn('Pastikan form sudah terisi')
  } else {
    onConfirm()
  }
}
async function onConfirm () {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.defineSlaAgent(props.idTicket, form.value)
  if (data.value) {
    emits('success', data.value.message)
    closeConfirm()
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}

watch(() => form.value, (val) => {
  if (val.same) {
    form.value.sla_height = val.sla_low
    form.value.sla_medium = val.sla_low
  }
}, { deep: true })
</script>
<template>
  <ModalInfo
    v-model="shownModal"
    info
    type="preview"
    title="Tentukan SLA"
    :disabled-button="loading"
    @close-info="closeConfirm()"
    @close-all="checkForm()"
  >
    <template #content>
      <DropDown
        label="Satuan SLA"
        :data="units"
        class="mb-4"
        :error="v$.sla_unit.$error ? v$.sla_unit.$errors[0].$message : ''"
        @change="v$.sla_unit.$touch"
        @input="form.sla_unit = $event.value"
      />
      <div class="flex justify-between">
        <label>SLA <span class="text-error">*</span></label>
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
      <div v-if="form.sla_unit" class="my-1 text-sm text-primary">
        <Icon name="material-symbols:info" color="#2953A1" size="18" />
        Inputan dalam satuan {{ localeString(form.sla_unit) }}
      </div>
      <div class="flex">
        <ReInputText
          v-model="form.sla_low"
          style="background: rgba(0, 147, 118, 0.15);"
          type="text"
          placeholder="Rendah"
          :require="false"
          :error="v$.sla_low.$error ? v$.sla_low.$errors[0].$message : ''"
          @change="v$.sla_low.$touch"
        />
        <ReInputText
          v-model="form.sla_medium"
          style="background: rgba(41, 83, 161, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Sedang"
          :require="false"
          :disabled="form.same"
          :error="v$.sla_medium.$error ? v$.sla_medium.$errors[0].$message : ''"
          @change="v$.sla_medium.$touch"
        />
        <ReInputText
          v-model="form.sla_height"
          style="background: rgba(176, 16, 48, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Tinggi"
          :require="false"
          :disabled="form.same"
          :error="v$.sla_height.$error ? v$.sla_height.$errors[0].$message : ''"
          @change="v$.sla_height.$touch"
        />
      </div>
      <div class="text-sm mt-1">
        <CheckBox
          id="same"
          v-model="form.same"
          label="Samakan Nilai"
        />
      </div>
    </template>
  </ModalInfo>
</template>
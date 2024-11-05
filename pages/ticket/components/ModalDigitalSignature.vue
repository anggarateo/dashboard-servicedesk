<script lang="ts" setup>
import { ModalDigitalSignature } from 'constants/types'

const props = defineProps<ModalDigitalSignature>()
const emits = defineEmits(['update:modelValue', 'success'])
const baseUrl = useRequestURL()
const shown = ref(props.modelValue)
const path = '/auth/login'
const redirectTo = '?redirectTo=digital-signature'
const cdTicket = '&cdTicket=' + props.cdTicket
const formType = '&form=' + props.formType
const url = ref(baseUrl.host.replace('-admin', '') + path + redirectTo + cdTicket + formType)

watch(() => shown.value, (val) => {
  emits('update:modelValue', val)
})

function closed () {
  shown.value = false
}
</script>

<template>
  <ModalInfo
    v-model="shown"
    title="Ajukan Tanda Tangan"
    info
    :icon="false"
    type="oke"
    no-buttons
    @close-info="closed()"
    @close-all="closed()"
  >
    <template #content>
      <div class="p-8 flex flex-col items-center gap-2">
        <div class="flex items-center gap-2 w-full">
          <h1 class="w-full max-w-full truncate border-2 rounded-xl p-2">
            {{ url }}
          </h1>

          <div
            class="w-28 flex flex-row items-center p-1 px-2 gap-2 rounded-xl bg-primary/10 hover:bg-primary-100 text-primary-500 text-xs font-medium cursor-pointer select-none"
            @click="$copyToClipboard(url)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7.61922 6.38159C8.93172 7.69409 8.93172 9.81743 7.61922 11.1241C6.30672 12.4308 4.18339 12.4366 2.87672 11.1241C1.57005 9.81159 1.56422 7.68826 2.87672 6.38159" stroke="#2953A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.17805 7.82256C4.81305 6.45756 4.81305 4.24089 6.17805 2.87005C7.54305 1.49922 9.75971 1.50505 11.1305 2.87005C12.5014 4.23505 12.4955 6.45172 11.1305 7.82256" stroke="#2953A1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1>
              Salin URL
            </h1>
          </div>
        </div>

        <h1>
          atau
        </h1>

        <a
          :href="`whatsapp://send?text=${encodeURIComponent(url)}`"
          data-action="share/whatsapp/share"
        >
          <CButton
            text="Bagikan via Whatsapp"
            icon="ic:baseline-whatsapp"
            icon-position="right"
            rounded
            color="success"
          />
        </a>
      </div>
    </template>
  </ModalInfo>
</template>

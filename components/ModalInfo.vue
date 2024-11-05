<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  info: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'delete' // delete, change, preview, yesOrNo, code, oke
  },
  btnColor: {
    type: String,
    default: null // primary, error
  },
  icon: {
    type: Boolean,
    default: true
  },
  disabledButton: {
    type: Boolean,
    default: false
  },
  onKeyEnter: {
    type: Boolean,
    default: true
  },
  noButtons: {
    type: Boolean,
    default: false
  }
})

const disButton = ref(props.disabledButton)
const inputCode = ref([])
const outputCode = ref()
const fieldCode = ref()

watch(() => inputCode.value, (val) => {
  if (val) {
    val.forEach((value, i) => {
      if (!value && val[i+1]) {
        inputCode.value[i] = val[i+1]
        inputCode.value.splice(i+1, 1)
      }
      if (value && i < 3) fieldCode.value[i+1].focus()

      if (val.length === 4 && value) {
        outputCode.value = `${val[0]}${val[1]}${val[2]}${val[3]}`
        disButton.value = false
      } else {
        disButton.value = true
      }
    })
  }
}, { deep: true })
watch(() => fieldCode.value, (val) => {
  if (!inputCode.value.length) {
    val[0]?.focus()
    disButton.value = true
  }
}, { deep: true })
watch(() => props.disabledButton, (val) => {
  disButton.value = val
})

const isFocus = (i) => {
  if (i > 0 && !inputCode.value[i-1]) fieldCode.value[i-1].focus()
}
const deleted = (i) => {
  if (i > 0 && !inputCode.value[i]) fieldCode.value[i-1].focus()
}
</script>

<template>
  <VueFinalModal
    :class="{ 'flex justify-center items-center': info }"
    content-class="w-3/4 mx-4 p-4 bg-white border rounded-lg"
    content-transition="vfm-fade"
    @keypress.enter="type === 'code' ? $emit('closeAll', outputCode) : onKeyEnter ? $emit('closeAll') : ''"
  >
    <div v-if="info" class="flex flex-col space-y-2">
      <div>
        <svg v-if="icon" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" />
          <path d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z" stroke="#B01030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FEF3F2" stroke-width="8" />
        </svg>
        <slot v-else name="icon"/>
      </div>
      <h1 class="text-xl font-semibold">
        {{ title }}
      </h1>
      <slot name="content" />

      <h1 v-if="type === 'delete'">
        Apakah Anda yakin ingin menghapusnya? Tindakan ini <span class="text-error">tidak dapat dibatalkan</span> dan semua informasi terkait akan dihapus secara permanen.
      </h1>
      <h1 v-else-if="type === 'change'">
        Apakah Anda yakin ingin keluar tanpa menyimpan perubahan?
      </h1>
      <div v-else-if="type === 'code'" class="mt-5 py-6">
        <div class="flex flex-row justify-between">
          <input
            v-for="(num, i) in 4"
            :key="num"
            v-model="inputCode[i]"
            ref="fieldCode"
            type="text"
            inputmode="numeric"
            class="h-20 w-20 text-4xl outline-none text-center border rounded-lg border-primary-300 px-2 text-primary-500 font-medium"
            maxlength="1"
            @focus="isFocus(i)"
            @keyup.delete="deleted(i)"
          >
        </div>
      </div>
      <div
        v-if="!noButtons"
        class="pt-6 flex gap-3"
        :class="type === 'change' ? 'flex-col-reverse' : type === 'delete' ? 'flex-row' : ''"
      >
        <CButton
          v-if="type !== 'oke'"
          class="w-full"
          :text="type === 'change' ? 'Tidak, tetap di halaman' : type === 'delete' || type === 'preview' || type === 'code' ? 'Batalkan' : type === 'yesOrNo' ? 'Tidak' : ''"
          type="outlined"
          @click="$emit('closeInfo')"
        />
        <CButton
          class="w-full"
          :text="
            type === 'change' ?
            'Ya, keluar tanpa menyimpan' : type === 'delete' ?
              'Hapus' : type === 'preview' ?
                'Konfirmasi' : type === 'yesOrNo' ?
                  'Ya' : type === 'code' ?
                    'Kirim' : 'Oke'"
          :color="btnColor ? btnColor : type === 'change' || type === 'delete' ? 'error' : 'primary'"
          :loading="disButton"
          @click="type === 'code' ? $emit('closeAll', outputCode) : $emit('closeAll')"
        />
      </div>
    </div>
  </VueFinalModal>
</template>

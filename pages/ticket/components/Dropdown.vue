<script setup>
const props = defineProps({
  fetchData: {
    type: String,
    default: 'onMounted' // onMounted | watch
  },
  apiModule: {
    type: String,
    required: true
  },
  apiMethod: {
    type: String,
    required: true
  },
  apiParams: {
    type: Object,
    default: null
  },
  optionLabel: {
    type: String,
    required: true
  },
  optionValue: {
    type: [String, Array],
    required: true
  },
  label: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: null
  },
  clearable: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  styles: {
    type: String,
    default: null
  },
  modelValue: {
    type: String,
    default: null
  },
  optionCustom: {
    type: Boolean,
    default: false
  },
  styleChooser: {
    type: Boolean,
    default: true
  },
  responseData: {
    type: String,
    default: null
  }
})
const { $api, $toast } = useNuxtApp()

const options = ref([])
const observer = ref(null)
const page = ref(1)
const limit = ref(1000)
const itemsRef = ref([])
const search = ref('')
const onPending = ref(false)

const getData = async () => {
  const {
    data,
    error,
    pending
  } = await $api[props.apiModule][props.apiMethod]({ page: page.value, ...props.apiParams, q: search.value, per_page: 1000 })
  if (data.value) {
    if (props.responseData) {
      options.value = data.value.data[props.responseData]
    } else {
      options.value = data.value.data
    }
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) onPending.value = pending.value
}

const filtered = computed(() => {
  return options.value
})

const paginated = computed(() => {
  return filtered.value.slice(0, limit.value)
})

const hasNextPage = computed(() => {
  return paginated.length < filtered.value.length
})

const onOpen = async () => {
  if (hasNextPage.value) {
    await getData()
    observer.value.observe(itemsRef.value)
  }
}

const onClose = () => {
  observer.value.disconnect()
}

async function infiniteScroll ([{ isIntersecting, target }]) {
  if (isIntersecting) {
    const ul = target.offsetParent
    const scrollTop = target.offsetParent.scrollTop

    page.value = page.value + 1
    limit.value += 10

    await getData()

    ul.scrollTop = scrollTop
  }
}

onMounted(() => {
  observer.value = new IntersectionObserver(infiniteScroll)

  if (props.fetchData === 'onMounted') getData()
})
watch(() => props.apiParams, (val, oldVal) => {
  const entriesVal = Object.entries(val).filter(el => el[1])
  const entriesOldVal = Object.entries(oldVal).filter(el => el[1])
  if (props.fetchData === 'watch' && entriesVal.length && !entriesOldVal.length) {
    options.value = []
    getData()
  }
  if (props.fetchData === 'watch' && entriesVal.length && entriesOldVal.length && entriesVal[0] && entriesOldVal[0] && entriesVal[0][1] !== entriesOldVal[0][1]) {
    selected.value = null
    options.value = []
    getData()
  }
})
watch(() => search.value, () => {
  page.value = 1
  getData()
})

const emit = defineEmits(['update:modelValue'])
const selected = ref()
watch(() => selected.value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  selected.value = val  
})

const classes = computed(() => {
  return props.styles
})
</script>

<template>
  <div class="space-y-2">
    <div v-if="label || required" class="flex flex-row">
      <label>{{ label }} <span v-if="required" class="text-error">*</span></label>
    </div>
    <div>
      <v-select
        id="ticket"
        v-model="selected"
        :label="optionLabel"
        class="style-chooser ticket text-xs"
        :class="[
          classes,
          { 'border border-red-500 ring ring-offset-2 ring-offset-white ring-red-500 rounded-xl': error }
        ]"
        :placeholder="placeholder"
        :reduce="Array.isArray(optionValue) ? option => `${option[optionValue[0]]},${option[optionValue[1]][optionValue[2]]}` : option => option[optionValue]"
        :options="paginated"
        :clearable="clearable"
        :disabled="disabled"
        @search="(query) => (search = query)"
        @open="onOpen"
        @close="onClose"
      >
        <template #list-footer>
          <li v-show="hasNextPage" ref="itemsRef" class="loader">
            Loading more options...
          </li>
        </template>
        <template #no-options="{ searching }">
          <em v-if="!searching && onPending">Pending...</em>
        </template>
        <template v-if="optionCustom" #option="{ name, service_category }">
          {{ name }}
          <h1 class="text-sm text-secondary-text font-medium">
            {{ service_category.name }}
          </h1>
        </template>
      </v-select>
      <ReErrorText v-if="error" :text="error" />
    </div>
  </div>
</template>
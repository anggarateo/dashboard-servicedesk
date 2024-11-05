<script setup>
import { endOfMonth, endOfYear, startOfMonth, startOfYear, startOfWeek, endOfWeek, startOfYesterday, endOfYesterday } from 'date-fns'

const date = ref()

defineProps({
  range: {
    type: Boolean,
    default: false
  },
  time: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Pilih Tanggal'
  },
  locale: {
    type: String,
    default: 'id'
  },
  position: {
    type: String,
    default: 'center' // left, center, right
  },
  presetRange: {
    type: Boolean,
    default: true
  },
  hideInputIcon: {
    type: Boolean,
    default: false
  },
  textInput: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: null
  },
  maxDate: {
    type: [String, Date],
    default: null
  }
})

const defaultPresetRanges = ref([
  { label: 'Hari ini', range: [new Date(), new Date()] },
  { label: 'Kemarin', range: [startOfYesterday(new Date()), endOfYesterday(new Date())] },
  { label: 'Minggu ini', range: [startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })] },
  { label: 'Bulan ini', range: [startOfMonth(new Date()), endOfMonth(new Date())] },
  { label: 'Tahun ini', range: [startOfYear(new Date()), endOfYear(new Date())] }
])
</script>

<template>
  <vue-datepicker
    v-model="date"
    class="border-2 border-primary rounded-lg"
    :range="range"
    :placeholder="placeholder"
    :enable-time-picker="time"
    :preset-ranges="presetRange ? defaultPresetRanges : null"
    :locale="locale"
    select-text="Gunakan"
    cancel-text="Batalkan"
    :position="position"
    :hide-input-icon="hideInputIcon"
    :month-change-on-scroll="false"
    :text-input="textInput"
    :format="format"
    :max-date="maxDate"
  >
    <template #arrow-left>
      <div class="hover:bg-primary/5 p-1.5 rounded">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2106_184)">
            <path d="M11.625 6.375H0.375" stroke="#193261" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.125 2.625L0.375 6.375L4.125 10.125" fill="#333333" />
            <path d="M4.125 2.625L0.375 6.375L4.125 10.125" stroke="#193261" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_2106_184">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </template>
    <template #arrow-right>
      <div class="hover:bg-primary/5 p-1.5 rounded">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2106_192)">
            <path d="M0.375 6.375H11.625" stroke="#193261" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.875 2.625L11.625 6.375L7.875 10.125" fill="#333333" />
            <path d="M7.875 2.625L11.625 6.375L7.875 10.125" stroke="#193261" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_2106_192">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </template>
  </vue-datepicker>
</template>

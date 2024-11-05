<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: [{
      name: null,
      author: null,
      status: null,
      time: null,
      flows: [{
        name: null,
        status: null,
        sla: null,
        user_agents: [],
        user_verified: null,
        is_flow_active: false,
        file_ds_report_id: null,
        path_report: null,
        trx_ticket_report_flow_stage_id: null
      }]
    }]
  },
  userActive: Boolean,
  handledBy: {
    type: Object,
    default: null
  },
  isCanReDS: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['modal', 're-ds'])

const shownChilds = ref(Array())

function toggleChild (id: any) {
  if (shownChilds.value.includes(id)) {
    const i = shownChilds.value.indexOf(id)
    if (i !== -1) shownChilds.value.splice(i, 1)
  } else {
    shownChilds.value.push(id)
  }
}

watch(() => props.items, (val) => {
  if (val.length) {
    shownChilds.value = []
    val.forEach((item, i) => {
      item.flows.forEach(child => {
        if (child.is_flow_active) {
          shownChilds.value.push(i)
        }
      })
    })
    if (!shownChilds.value.length) {
      shownChilds.value.push(val.length - 1)
    }
  }
})
</script>
<template>
  <div v-for="(item, i) in items" :key="i">
    <div class="w-full flex flex-row gap-4">
      <div class="relative">
        <svg
          class="absolute -left-1.5 top-[3px]"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
        >
          <circle opacity="0.5" cx="7" cy="7.5" r="7" fill="#2953A1" />
          <circle cx="7.00065" cy="7.50065" r="4.66667" fill="#2953A1" />
        </svg>
        <div
          class="border-l-2 border-dashed border-primary h-full mt-2"
          :class="{ 'border-none': items?.length === (i + 1) }"
        />
      </div>
      <div
        class="flex flex-col w-full"
        :class="shownChilds.includes(i) ? 'pb-0' : 'pb-6'"
      >
        <div
          class="w-full flex flex-row justify-between text-sm"
          :class="{ 'cursor-pointer': item?.flows?.length }"
          @click="toggleChild(i)">
          <h1 class="w-full font-bold">
            {{ item?.name }}
          </h1>
          <Icon
            v-if="item?.flows?.length && shownChilds.includes(i)"
            name="ic:baseline-keyboard-arrow-down"
            size="22"
          />
          <Icon
            v-else-if="item?.flows?.length"
            name="ic:baseline-keyboard-arrow-left"
            size="22"
          />
        </div>
        <h1>
          {{ item?.author }}
        </h1>
        <div class="pb-2">
          <span class="bg-primary-100 text-primary px-1 rounded w-fit text-xs text-center">
            {{ item?.note?.replace(/(<([^>]+)>)/ig, '') }}
          </span>
        </div>
        <span class="bg-error/10 text-error px-1 rounded w-fit text-xs">
          {{ item?.time }}
        </span>
      </div>
    </div>
    <div v-if="shownChilds.includes(i)" class="relative">
      <div
        class="absolute border-l-2 border-dashed border-primary h-full mt-1"
        :class="{ 'border-none': items?.length === (i + 1) }"
      />
      <div v-for="(child, j) in item?.flows" :key="j" class="flex flex-row gap-4 ml-6">
        <div class="relative">
          <svg
            v-if="child?.user_verified"
            class="absolute -left-1.5 top-[3px]"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="7.0002" cy="7.0002" r="6.3" fill="#2953A1"/>
            <path d="M7 14C6.04333 14 5.13917 13.8162 4.2875 13.4487C3.43583 13.0812 2.69208 12.5796 2.05625 11.9437C1.42042 11.3079 0.91875 10.5642 0.55125 9.7125C0.18375 8.86083 0 7.95667 0 7C0 6.03167 0.18375 5.12167 0.55125 4.27C0.91875 3.41833 1.42042 2.6775 2.05625 2.0475C2.69208 1.4175 3.43583 0.91875 4.2875 0.55125C5.13917 0.18375 6.04333 0 7 0C7.96833 0 8.87833 0.18375 9.73 0.55125C10.5817 0.91875 11.3225 1.4175 11.9525 2.0475C12.5825 2.6775 13.0812 3.41833 13.4487 4.27C13.8162 5.12167 14 6.03167 14 7C14 7.95667 13.8162 8.86083 13.4487 9.7125C13.0812 10.5642 12.5825 11.3079 11.9525 11.9437C11.3225 12.5796 10.5817 13.0812 9.73 13.4487C8.87833 13.8162 7.96833 14 7 14ZM7 12.95C8.65667 12.95 10.0625 12.3696 11.2175 11.2088C12.3725 10.0479 12.95 8.645 12.95 7C12.95 5.34333 12.3725 3.9375 11.2175 2.7825C10.0625 1.6275 8.65667 1.05 7 1.05C5.355 1.05 3.95208 1.6275 2.79125 2.7825C1.63042 3.9375 1.05 5.34333 1.05 7C1.05 8.645 1.63042 10.0479 2.79125 11.2088C3.95208 12.3696 5.355 12.95 7 12.95Z" fill="#2953A1"/>
            <path d="M10.9201 5.23281L5.96758 10.1853L3.08008 7.28031L3.86758 6.49281L5.96758 8.59281L10.1151 4.44531L10.9201 5.23281Z" fill="white"/>
          </svg>
          <svg
            v-else
            class="absolute -left-1.5 top-[3px]"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
          >
            <circle opacity="0.5" cx="7" cy="7.5" r="7" :fill="!child?.is_flow_active ? '#B4B4B4' : '#2953A1'" />
            <circle cx="7.00065" cy="7.50065" r="4.66667" :fill="!child?.is_flow_active ? '#B4B4B4' : '#2953A1'" />
          </svg>
          <div
            class="border-l-2 border-primary h-[calc(100%-26px)] mt-6"
            :class="{
              'border-none': item?.flows?.length === (j + 1),
              'border-neutral-300': !child?.is_flow_active
            }"
          />
        </div>
        <div class="flex flex-col gap-2 pb-6 text-xs">
          <h1
            class="font-bold"
            :class="{ 'text-neutral-300': !child?.is_flow_active }"
          >
            {{ child?.name }}
          </h1>
          <template v-if="child?.is_flow_active || child?.user_verified">
            <h1
              v-for="(agent, u) in child?.user_agents"
              :key="u"
              class="text-sm"
              :class="{ 'opacity-60': !child?.is_flow_active }"
            >
              <div class="flex flex-row gap-1">
                <h1
                  v-if="child?.user_verified?.id === agent.id || (child?.is_flow_active && agent.id === handledBy?.id)"
                  class="text-success-500"
                  :title="`${child?.is_flow_active && agent.id === handledBy?.id ? 'Ditangani' : 'Diverifikasi'} oleh ${agent.name}`"
                >
                  <Icon name="material-symbols:check-circle-rounded" />
                </h1>
                <h1 :class="{ 'font-semibold': child?.is_flow_active && agent.id === handledBy?.id }">
                  {{ agent.name }}
                </h1>
              </div>
            </h1>
            <span
              v-if="child?.user_verified"
              class="bg-primary/10 text-primary px-1 rounded w-fit text-center"
              :class="{ 'opacity-50': !child?.is_flow_active }"
            >
              {{ child?.status }}
            </span>
            <span
              v-if="child?.sla && child?.is_flow_active && !child?.resolve_flow_format && !child?.resolve_flow_limit"
              class="bg-error/10 text-error p-1 px-2 rounded-lg w-fit font-medium flex flex-row gap-2 items-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.99967 15.1663C4.04634 15.1663 0.833008 11.953 0.833008 7.99967C0.833008 4.04634 4.04634 0.833008 7.99967 0.833008C11.953 0.833008 15.1663 4.04634 15.1663 7.99967C15.1663 11.953 11.953 15.1663 7.99967 15.1663ZM7.99967 1.83301C4.59967 1.83301 1.83301 4.59967 1.83301 7.99967C1.83301 11.3997 4.59967 14.1663 7.99967 14.1663C11.3997 14.1663 14.1663 11.3997 14.1663 7.99967C14.1663 4.59967 11.3997 1.83301 7.99967 1.83301Z" fill="#B01030"/>
                <path d="M10.4731 10.6202C10.3864 10.6202 10.2998 10.6002 10.2198 10.5468L8.1531 9.3135C7.63977 9.00684 7.25977 8.3335 7.25977 7.74017V5.00684C7.25977 4.7335 7.48643 4.50684 7.75977 4.50684C8.0331 4.50684 8.25977 4.7335 8.25977 5.00684V7.74017C8.25977 7.98017 8.45977 8.3335 8.66643 8.4535L10.7331 9.68684C10.9731 9.82684 11.0464 10.1335 10.9064 10.3735C10.8064 10.5335 10.6398 10.6202 10.4731 10.6202Z" fill="#B01030"/>
              </svg>
              <h1>
                {{ child?.sla }}
              </h1>
            </span>
            <CButton
              v-if="userActive && child?.is_flow_active && child?.type_sla?.code === 'define_agent' && !child?.sla"
              text="Tentukan SLA"
              color="error"
              class="text-xs !p-1.5"
              @click="emits('modal', true)"
            />

            <span
              v-if="child?.last_change_status_at"
              class="p-1 px-2 rounded-lg w-fit font-medium flex flex-row gap-2 items-center bg-primary-100 text-primary"
            >
              <Icon name="material-symbols:check-circle-rounded" class="text-success-500 text-sm" />

              <h1>
                {{ $formatDate(child.last_change_status_at, 'dd/MM/yyyy HH:mm') }}
              </h1>
            </span>

            <span
              v-if="child?.resolve_flow_format || child?.resolve_flow_limit"
              class="p-1 px-2 rounded-lg w-fit font-medium flex flex-row gap-2 items-center"
              :class="{
                'bg-primary-100 text-primary': child?.user_verified,
                'bg-error-100 text-error': child?.is_flow_active
              }"
            >
              <span>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.99967 15.1663C4.04634 15.1663 0.833008 11.953 0.833008 7.99967C0.833008 4.04634 4.04634 0.833008 7.99967 0.833008C11.953 0.833008 15.1663 4.04634 15.1663 7.99967C15.1663 11.953 11.953 15.1663 7.99967 15.1663ZM7.99967 1.83301C4.59967 1.83301 1.83301 4.59967 1.83301 7.99967C1.83301 11.3997 4.59967 14.1663 7.99967 14.1663C11.3997 14.1663 14.1663 11.3997 14.1663 7.99967C14.1663 4.59967 11.3997 1.83301 7.99967 1.83301Z" fill="currentColor"/>
                  <path d="M10.4731 10.6202C10.3864 10.6202 10.2998 10.6002 10.2198 10.5468L8.1531 9.3135C7.63977 9.00684 7.25977 8.3335 7.25977 7.74017V5.00684C7.25977 4.7335 7.48643 4.50684 7.75977 4.50684C8.0331 4.50684 8.25977 4.7335 8.25977 5.00684V7.74017C8.25977 7.98017 8.45977 8.3335 8.66643 8.4535L10.7331 9.68684C10.9731 9.82684 11.0464 10.1335 10.9064 10.3735C10.8064 10.5335 10.6398 10.6202 10.4731 10.6202Z" fill="currentColor"/>
                </svg>
              </span>
              <h1 v-if="child?.user_verified">
                {{ child?.resolve_flow_format }} dari SLA {{ child?.resolve_flow_limit }}
              </h1>
              <h1 v-else-if="child?.is_flow_active">
                {{ child?.resolve_flow_limit }}
              </h1>
            </span>

            <CButton
              v-if="isCanReDS && !child?.is_flow_active && !child?.file_ds_report_id && child?.path_report && child?.trx_ticket_report_flow_stage_id"
              text="Tanda Tangan Ulang"
              color="secondary"
              class="text-xs !p-1.5"
              @click="emits('re-ds', { path_report: child.path_report, trx_ticket_report_flow_stage_id: child.trx_ticket_report_flow_stage_id })"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

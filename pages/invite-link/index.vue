<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'
import ModalForm from '@/pages/invite-link/components/ModalForm.vue'

definePageMeta({
  alias: '/invite_link' // sesuai dari api/role-menu
})

const { $api } = useNuxtApp()

const showFilter = ref(false)
const showModalForm = ref(false)

const headers: Header[] = [
  { text: 'Email', value: 'sending_mail' },
  { text: 'Role', value: 'role.name' },
  { text: 'Link', value: 'url' },
  { text: 'Expired', value: 'expired_date' },
  { text: 'Status', value: 'status', width: 170 },
  { text: '', value: 'action' }
]
const items = ref<Item[]>([])
const loading = ref(false)
const serverItemsLength: any = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 20
})

const searchQuery = ref('')
const debounce: any = ref(null)

const roles: any = ref([])

const openModal = () => {
  if (showModalForm.value) {
    showModalForm.value = false
  } else {
    showModalForm.value = true
  }
}

const copyLinkToClipboard = (link: string) => {
  navigator.clipboard.writeText(link)
    .then(() => {
      useNuxtApp().$toast.success('Copied')
    })
    .catch((error) => {
      useNuxtApp().$toast.success('Failed to copy: ', error)
    })
}

const fetchInviteLink = async () => {
  loading.value = true
  const { data, error } = await $api.inviteLink.getInviteLink(null, { ...serverOptions.value, q: searchQuery.value })

  if (data.value) {
    items.value = data.value?.data ?? []
    serverItemsLength.value = data.value?.meta?.total
    loading.value = false
  }

  if (error.value) {
    loading.value = false
    // useNuxtApp().$toast.error(error.value?.data?.message)
  }
}

function handleSearch (e: any) {
  clearTimeout(debounce.value)
  debounce.value = setTimeout(() => {
    searchQuery.value = e.target.value
    fetchInviteLink()
  }, 600)
}

async function fetchAgentRole () {
  const { data, error } = await $api.agent.getAgentRole(null, null)

  if (data.value) {
    roles.value = data.value.data.map((val: any) => ({
      ...val,
      is_selected: false
    }))
  }

  if (error.value) {
    useNuxtApp().$toast.error('Error!!!')
  }
}

async function resetAllFilter () {
  await roles.value.forEach((el: any) => {
    el.is_selected = false
  })

  fetchInviteLink()
}

onMounted(() => {
  fetchInviteLink()
  fetchAgentRole()
})

watch(serverOptions, () => { fetchInviteLink() }, { deep: true })

</script>

<template>
  <div class="p-4">
    <!-- Cards -->
    <div class="h-auto p-4 bg-white shadow-md rounded-xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold">
            Invite Link
          </h1>
          <h2 class="text-neutral">
            Buat link untuk mengundang agent
          </h2>
        </div>
        <div class="flex flex-col lg:flex-row items-end lg:items-center gap-2">
          <ReInputText placeholder="Cari nama" :require="false" icon="left" @keyup="handleSearch">
            <template #icon>
              <Icon icon="heroicons:magnifying-glass-20-solid" width="24" />
            </template>
          </ReInputText>
          <div v-show="false" class="relative">
            <CButton type="outlined" icon-position="left" icon="octicon:filter-16" @click="showFilter = !showFilter" />
            <div v-show="showFilter" class="w-[28rem] bg-white shadow-md rounded-b-lg border absolute top-16 right-0 z-50">
              <!-- Header -->
              <div class="flex flex-row justify-between px-4 py-3 shadow-md">
                <h1 class="text-xl font-bold">
                  Filter
                </h1>
                <CButton
                  text="Reset"
                  type="text"
                  size="small"
                  icon=""
                  class="!px-0 py-1"
                  @click="resetAllFilter"
                />
              </div>
              <!-- Content -->
              <div class="p-4 overflow-y-auto h-[26rem]">
                <div class="mb-4">
                  <h1 class="mb-2 text-sm font-bold text-neutral-500">
                    Role
                  </h1>
                  <ul class="flex flex-row flex-wrap gap-2">
                    <li v-for="(role, i) in roles" :key="i">
                      <CButton
                        type="outlined"
                        :text="role.name"
                        size="small"
                        :icon="role.is_selected ? 'ion:checkmark-outline' : ''"
                        :icon-position="'right'"
                        @click="role.is_selected = !role.is_selected"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <CButton text="Generate Link" @click="openModal" />
        </div>
      </div>

      <vue-table
        v-model:server-options="serverOptions"
        table-class-name="template-table"
        :table-height="420"
        :headers="headers"
        :items="items"
        :server-items-length="serverItemsLength"
        :loading="loading"
        :hide-rows-per-page="true"
        show-index
      >
        <template #empty-message>
          <EmptyState content="Menu" />
        </template>
        <template #expand="item">
          <ul class="flex flex-col gap-3">
            <li>Email: {{ item.sending_mail }}</li>
            <li>Role: {{ item.role.name }}</li>
            <li class="flex items-center gap-2">
              Link:
              <CLabelText
                v-if="item.status !== 'Menunggu Registrasi'"
                text-size="text-xs"
                :text="item.status === 'Registrasi' ? 'Link sudah digunakan' : `Link sudah ${item.status.toLowerCase()}`"
              />
              <div v-else class="flex items-center gap-2">
                <NuxtLink :to="item.url" class="text-sm cursor-pointer text-primary-500 hover:border-b hover:border-blue-500">
                  {{ item.url }}
                </NuxtLink>
                <CButton
                  class=""
                  icon-position="left"
                  icon="bi:clipboard"
                  size="small"
                  type="text"
                  @click="copyLinkToClipboard(item.url)"
                />
              </div>
            </li>
            <li>Expired: {{ item.expired_date.split(" ")[0] }}</li>
            <li class="flex items-center gap-2">
              Status:
              <CLabelText
                v-show="item.status == 'Menunggu Registrasi'"
                :text="'Menunggu'"
                text-size="text-xs"
                bg-color="bg-yellow-400"
                text-color="text-white"
              />
              <CLabelText
                v-show="item.status == 'Registrasi'"
                :text="item.status"
                text-size="text-xs"
                bg-color="bg-blue-400"
                text-color="text-white"
              />
              <CLabelText
                v-show="item.status == 'Kdaluarsa'"
                :text="item.status"
                text-size="text-xs"
                bg-color="bg-red-400"
                text-color="text-white"
              />
            </li>
          </ul>
        </template>
        <template #item-sending_mail="item">
          <p class="w-48 truncate">
            {{ item.sending_mail }}
          </p>
        </template>
        <template #item-status="item">
          <CLabelText
            v-show="item.status == 'Menunggu Registrasi'"
            :text="'Menunggu'"
            text-size="text-xs"
            bg-color="bg-yellow-400"
            text-color="text-white"
          />
          <CLabelText
            v-show="item.status == 'Registrasi'"
            :text="item.status"
            text-size="text-xs"
            bg-color="bg-blue-400"
            text-color="text-white"
          />
          <CLabelText
            v-show="item.status == 'Kdaluarsa'"
            :text="item.status"
            text-size="text-xs"
            bg-color="bg-red-400"
            text-color="text-white"
          />
        </template>
        <template #item-url="item">
          <div v-if="item.status !== 'Menunggu Registrasi'" class="text-center">
            <CLabelText
              text-size="text-xs"
              :text="item.status === 'Registrasi' ? 'Link sudah digunakan' : `Link sudah ${item.status.toLowerCase()}`"
            />
          </div>
          <div v-else class="flex items-center gap-2">
            <NuxtLink :to="item.url" class="w-48 text-sm truncate cursor-pointer text-primary-500 hover:border-b hover:border-blue-500">
              {{ item.url }}
            </NuxtLink>
            <CButton
              class=""
              icon-position="left"
              icon="bi:clipboard"
              size="small"
              type="text"
              @click="copyLinkToClipboard(item.url)"
            />
          </div>
        </template>
        <template #item-expired_date="item">
          <p class="text-sm">
            {{ item.expired_date.split(' ')[0] }}
          </p>
        </template>
        <template #item-action="item">
          <div v-if="item.status === 'Menunggu Registrasi'" class="flex flex-row gap-1">
            <CButton
              class="!bg-neutral-500 !p-1.5"
              icon-position="left"
              icon="solar:clipboard-bold"
              size="small"
              @click="copyLinkToClipboard(item.url)"
            />
          </div>
        </template>
      </vue-table>
    </div>

    <ModalForm :show="showModalForm" @submitted="fetchInviteLink" />
  </div>
</template>

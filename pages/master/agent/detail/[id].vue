<script setup>
import ApiSelectRole from '@/pages/master/agent/detail/components/ApiSelectRole.vue'
import ApiSelectUnitOfWork from '@/pages/master/agent/detail/components/ApiSelectUnitOfWork.vue'
import ApiSelectPosition from '@/pages/master/agent/detail/components/ApiSelectPosition.vue'
import ModalDelete from '@/pages/master/agent/detail/components/ModalDelete.vue'
import Tabs from '@/pages/master/agent/detail/components/Tabs.vue'

definePageMeta({
  alias: '/agent' // sesuai dari api/role-menu
})

const route = useRoute()

const { $api, $toast } = useNuxtApp()

const isSync = ref(false)

const detail = ref(null)

const showModalDelete = ref(false)

const isBpbatam = ref(false)

const beforeUnitOfWork = ref()
const beforePosition = ref()
const beforeName = ref()

const agent = reactive({
  id: '',
  name: ''
})

const formData = reactive({
  firstname: '',
  email: '',
  units_of_work_id: '',
  position_id: '',
  role_id: '',
  is_active: false,
  units_of_work: null,
  position: null
})

const loading = ref(false)

agent.id = route.params.id

const fetchDetailAgent = async () => {
  try {
    const { data } = await $api.agent.getDetailAgent(agent.id, null, null)

    agent.id = data.value?.data?.id
    agent.name = data.value?.data?.fullname

    formData.firstname = data.value?.data?.firstname
    formData.email = data.value?.data?.email
    formData.role_id = data.value?.data?.roles
    formData.units_of_work_id = data.value?.data?.units_of_work
    formData.position_id = data.value?.data?.position
    formData.is_active = data.value?.data?.is_active
    formData.units_of_work = data.value?.data?.units_of_work
    formData.position = data.value?.data?.position

    if (formData.email.split('@')[1] === 'bpbatam.go.id') {
      isBpbatam.value = true
    }

    detail.value = data.value?.data
  } catch (e) {
    $toast.error(e.value.data.message)
  }
}

const submitUpdateAgent = async () => {
  loading.value = true
  const { data, error } = await $api.agent.updateAgent(agent.id, {
    firstname: formData.firstname || null,
    position_id: formData.position_id?.id || formData.position?.id || null,
    units_of_work_id: formData.units_of_work_id?.id || formData.units_of_work?.id || null,
    roles: formData.role_id.map(val => ({
      role_id: val.id ?? val
    })),
    is_active: formData.is_active
  })

  if (data.value) {
    $toast.success(data.value?.message)
    fetchDetailAgent()
  }

  if (error.value) {
    const val = error.value
    $toast.error(val.data.message)
  }
  loading.value = false
}

const handleSyncAgent = async () => {
  isSync.value = true

  const param = {
    user_id: agent.id
  }

  const { data, error } = await $api.agent.syncAgent(param)

  if (data.value) {
    isSync.value = false

    if (data.value.data.sync_message === 'success') {
      $toast.success(data.value.data.sync_message, {
        position: $toast.POSITION.BOTTOM_RIGHT
      })
    } else {
      return $toast.error(data.value.data.sync_message.message, {
        position: $toast.POSITION.BOTTOM_RIGHT
      })
    }

    if (data.value?.data?.profile?.firstname !== data.value?.data?.sync?.name) {
      beforeName.value = data.value.data.profile.firstname
    }
    if (data.value?.data?.profile?.position?.id !== data.value?.data?.sync?.position?.id) {
      beforePosition.value = data.value.data.profile.position
    }
    if (data.value?.data?.profile?.units_of_work?.id !== data.value?.data?.sync?.units_of_work?.id) {
      beforeUnitOfWork.value = data.value.data.profile.units_of_work
    }


    if (data.value.data.sync) {
      formData.firstname = data.value?.data?.sync?.name
      formData.units_of_work_id = data.value?.data?.sync?.units_of_work?.id
      formData.position_id = data.value?.data?.sync?.position?.id
      formData.units_of_work = data.value?.data?.sync?.units_of_work
      formData.position = data.value?.data?.sync?.position
    }
  }

  if (error.value) {
    isSync.value = false
    $toast.error(error.value.data.message, {
      position: $toast.POSITION.BOTTOM_RIGHT
    })
  }
}

const disableAgent = () => {
  formData.is_active = !formData.is_active
  submitUpdateAgent()
}

// initial load
onMounted(() => {
  fetchDetailAgent()
})
</script>

<template>
  <div class="p-4">
    <div class="h-auto p-4 bg-white shadow-md rounded-xl">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-2">
        <h1 class="text-2xl font-bold">
          Master Agent
        </h1>
        <div class="flex flex-col md:flex-row items-end md:items-center gap-2">
          <div class="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <CButton
              text="Hapus Agent"
              color="error"
              :disabled="loading"
              @click="showModalDelete = true"
            />
            <CButton
              :text="`${detail?.is_active ? 'Nonaktifkan' : 'Aktifkan'} Agent`"
              :color="detail?.is_active ? 'error' : 'success'"
              :disabled="loading"
              @click="disableAgent"
            />
          </div>
          <div class="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <CButton
              :text="!isSync ? 'Sinkronisasi' : 'Loading....'"
              type="outlined"
              icon=""
              :loading="isSync"
              @click="handleSyncAgent"
            />
            <CButton
              text="Simpan Perubahan"
              icon=""
              :disabled="loading"
              @click="submitUpdateAgent"
            />
          </div>
        </div>
      </div>

      <ul class="flex flex-col gap-4 mb-4">
        <li class="flex flex-col sm:flex-row sm:items-center gap-1">
          <p class="w-1/3 lg:w-1/6 text-neutral-400">
            Nama Agent
          </p>
          <div class="inline-flex items-center w-full">
            <strike v-if="beforeName" class="mr-2">{{ beforeName || '' }}</strike>
            <h1>
              {{ formData.firstname || '-' }}
            </h1>
          </div>
        </li>
        <li class="flex flex-col sm:flex-row sm:items-center gap-1">
          <p class="w-1/3 lg:w-1/6 text-neutral-400">
            Email
          </p>
          <p v-if="detail" class="w-full">
            {{ detail.email || '-' }}
          </p>
        </li>
        <li class="flex flex-col sm:flex-row sm:items-center gap-1">
          <p class="w-1/3 lg:w-1/6 text-neutral-400">
            Unit Kerja
          </p>
          <div class="inline-flex items-center w-full">
            <strike v-if="beforeUnitOfWork?.name" class="mr-2">{{ beforeUnitOfWork?.name || '' }}</strike>
            <h1 v-if="isBpbatam">
              {{ formData.units_of_work?.name || '-' }}
            </h1>
            <ApiSelectUnitOfWork v-else v-model="formData.units_of_work_id" :disabled="isBpbatam ? true : false" />
          </div>
        </li>
        <li class="flex flex-col sm:flex-row sm:items-center gap-1 flex-shrink-0">
          <p class="w-1/3 lg:w-1/6 text-neutral-400">
            Jabatan
          </p>
          <div class="inline-flex items-center w-full">
            <strike v-if="beforePosition?.name" class="mr-2">{{ beforePosition?.name || '' }}</strike>
            <h1 v-if="isBpbatam">
              {{ formData.position?.name || '-' }}
            </h1>
            <ApiSelectPosition v-else v-model="formData.position_id" :disabled="isBpbatam ? true : false" />
          </div>
        </li>
        <li class="flex flex-col sm:flex-row sm:items-center gap-1">
          <p class="w-1/3 lg:w-1/6 text-neutral-400">
            Role
          </p>
          <ApiSelectRole v-model="formData.role_id" class="w-full" />
        </li>
      </ul>

      <!-- Tabs Section -->
      <Tabs />
    </div>

    <ModalDelete
      v-model="showModalDelete"
      :user="agent"
      @close-info="showModalDelete = false"
      @close="showModalDelete = false"
    />
  </div>
</template>

<style scoped>
.style-chooser {
  --vs-dropdown-max-height: 135px;
}

</style>

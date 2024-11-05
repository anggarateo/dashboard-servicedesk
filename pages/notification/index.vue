<script setup>
import NotifCategory from '~/utils/notifCategories'
import { useNotifStore } from '~/store/notif'

useHead({ title: 'Notifikasi' })
definePageMeta({
  alias: '/notifikasi'
})

const { $api, $toast } = useNuxtApp()
const router = useRouter()
const notifStore = useNotifStore()

const dataNotification = ref([])
const isLoading = ref(false)

const getNotif = async () => {
  const { data, error } = await $api.notification.getByUser(null, null)

  if (data.value) {
    notifStore.$patch({
      list: {
        data: data.value.data
      }
    })

    dataNotification.value = notifStore.list.data
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}
const readNotif = async (v) => {
  const { data, error } = await $api.notification.readNotif(v)

  if (data.value) {
    getNotif()
    getTotalUnread()
    goToPage(v)
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

const goToPage = (obj) => {
  if (obj.detail.data) {
    let param
    obj?.notification_category?.name === NotifCategory.MyTicket ? param = obj.detail.data.id + '/my-ticket' : param = obj.detail.data.id

    router.push('/ticket/' + param)
    showNotif.value = false
  }
}

function waktuYangLalu (waktu) {
  const waktuObj = new Date(waktu)
  const selisih = new Date() - waktuObj
  const detik = Math.floor(selisih / 1000)

  if (detik < 60) {
    return detik + ' detik yang lalu'
  } else if (detik < 3600) {
    const menit = Math.floor(detik / 60)
    return menit + (menit > 1 ? ' menit yang lalu' : ' menit yang lalu')
  } else if (detik < 86400) {
    const jam = Math.floor(detik / 3600)
    return jam + (jam > 1 ? ' jam yang lalu' : ' jam yang lalu')
  } else if (detik < 604800) {
    const hari = Math.floor(detik / 86400)
    return hari + (hari > 1 ? ' hari yang lalu' : ' hari yang lalu')
  } else if (detik < 2419200) { // 4 minggu
    const minggu = Math.floor(detik / 604800)
    return minggu + (minggu > 1 ? ' minggu yang lalu' : ' minggu yang lalu')
  } else {
    return waktuObj.toLocaleString()
  }
}

async function readAllNotif () {
  isLoading.value = true

  const {
    data,
    pending,
    error
  } = await $api.notification.readAll()

  if (data.value) {
    $toast.success(data.value.message)
    getNotif()
    getTotalUnread()
  }

  if (pending.value) isLoading.value = pending.value

  if (error.value) {
    $toast.error(error.value.data.message)
  }

  isLoading.value = false
}

async function getTotalUnread () {
  const {
    data,
    error
  } = await $api.notification.total({ is_read: false })

  if (data.value) {
    notifStore.$patch({
      totalUnread: {
        data: data.value.data
      }
    })
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  getNotif()
  getTotalUnread()
})
</script>

<template>
  <div>
    <div class="p-4 space-y-4">
      <div class="w-full h-full bg-white rounded-lg shadow">
        <div class="flex p-4">
          <div class="flex flex-col w-full">
            <div class="flex justify-between">
              <div class="text-2xl font-bold ">
                Notifikasi
              </div>

              <div
                v-if="dataNotification.filter(el => !el.is_read).length"
                class="text-sm"
                :class="isLoading ? 'cursor-progress' : 'cursor-pointer hover:underline'"
                @click="readAllNotif"
              >
                Read All
              </div>
            </div>
            <div class="flex flex-col gap-4 overflow-y-scroll" style="height: 479px;">
              <div
                v-for="(v, i) in dataNotification"
                :key="i"
                class="flex flex-col sm:flex-row gap-[10px] px-[20px] py-[16px] shadow-md cursor-pointer"
                @click="readNotif(v)"
              >
                <div class="flex sm:items-center sm:justify-center gap-[10px] w-full">
                  <div class="w-8 h-8 ">
                    <div class="w-full h-full rounded-full bg-neutral-300">
                      <div class="flex items-center justify-center w-full h-full ">
                        <Icon name="carbon:notification" color="black" size="18" />
                      </div>
                    </div>
                  </div>
                  <div class="w-full " style="flex: 1 1 0; flex-direction: column; justify-content: center; align-items: flex-start; display: inline-flex">
                    <div style="color: #444444; font-size: 16px; font-family: Poppins; font-weight: 600; line-height: 26px; word-wrap: break-word">
                      {{ v.title }}
                    </div>
                    <ChatBox v-if="v.detail?.content" :value="v.detail?.content" class-wrapper="text-sm text-secondary-text" />
                  </div>
                </div>
                <div class="w-full inline-flex flex-col items-end justify-end gap-2 ">
                  <div style="color: #444444; font-size: 14px; font-family: Poppins; font-weight: 600; line-height: 25.20px; word-wrap: break-word">
                    {{ waktuYangLalu(v.created_at) }}
                  </div>
                  <div v-show="!v.is_read" style="width: 10px; height: 10px; background: #C01048; border-radius: 9999px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModal } from 'vue-final-modal'
import { getMessaging, onMessage } from 'firebase/messaging'
import ModalInfo from '@/components/ModalInfo.vue'
import { useProfileStore } from '~/store/profile'
import { useTicketStore } from '~/store/ticket'
import { removeToken } from '~/composables/useToken'
import { useNotifStore } from '~/store/notif'
import NotifCategory from '~/utils/notifCategories'

const props = defineProps({
  menu: {
    type: String,
    default: null
  }
})

const { $api, $mitt, $localUser, $toast } = useNuxtApp()
const notifStore = useNotifStore()

const modalLogout = useModal({
  component: ModalInfo,
  attrs: {
    title: 'Keluar?',
    info: true,
    type: 'yesOrNo',
    btnColor: 'error',
    onCloseInfo () {
      modalLogout.close()
    },
    async onCloseAll () {
      let userLog
      if (localStorage.getItem('userLog')) userLog = localStorage.getItem('userLog')
      localStorage.clear()
      await removeToken()
      if (userLog) localStorage.setItem('userLog', userLog)
      useRouter().replace('/').then(() => {
        useRouter().go(0)
      })
      modalLogout.close()
    }
  },
  slots: {
    content: 'Apakah Anda yakin ingin keluar dari akun? Semua sesi yang sedang berjalan akan ditutup dan Anda akan dialihkan ke halaman login.'
  }
})
const popup = ref(false)

const profileStore: any = useProfileStore()
const router = useRouter()
const { data: { value: localAuth } } = await useFetch('/fakeapi/token')
const auth = ref()
localAuth ? auth.value = JSON.parse(localAuth) : auth.value = null
const showNotif = ref(false)
const hasNotif = ref(false)
const searchTicket = ref()
const ticketStore = useTicketStore()
const userProfile = ref($localUser())
const totalUnread = ref(0)
const isLoading = ref(false)

const getUserAvatar = () => {
  return profileStore?.user?.avatar || ''
}

const messaging = getMessaging()
onMessage(messaging, (payload) => {
  getNotif()
  getTotalUnread()
  hasNotif.value = true
})

const dataNotification: any = ref([])
const getNotif = async () => {
  const { data, error } = await $api.notification.getByUser(null, null)

  if (data.value) {
    notifStore.$patch({
      list: {
        data: data.value.data
      }
    })
  }

  if (error.value) {
    const err: any = error.value
    $toast.error(err.data.message)
  }
}

const readNotif = async (v: any) => {
  const { data, error } = await $api.notification.readNotif(v)

  if (data.value) {
    getNotif()
    getTotalUnread()
    goToPage(v)
  }

  if (error.value) {
    const err: any = error.value
    $toast.error(err.data.message)
  }
}

const handleOpenNotif = () => {
  hasNotif.value = false
  showNotif.value = !showNotif.value
}

const goToPage = (obj: any) => {
  if (obj.detail.data) {
    let param
    obj?.notification_category?.name === NotifCategory.MyTicket ? param = obj.detail.data.id + '/my-ticket' : param = obj.detail.data.id

    router.push('/ticket/' + param)
    showNotif.value = false
  }
}

function waktuYangLalu (waktu: any) {
  const waktuObj: any = new Date(waktu)
  const now: any = new Date()
  const selisih = now - waktuObj
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
    const err: any = error.value
    $toast.error(err.data.message)
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
    const err: any = error.value
    $toast.error(err.data.message)
  }

  isLoading.value = false
}

onMounted(() => {
  if (localAuth) {
    getNotif()
    getTotalUnread()
  }
})

watch(() => props.menu, (val) => {
  if (val === 'Dashboard') searchTicket.value = ''
})
watch(() => notifStore.totalUnread.data, (val: number) => {
  totalUnread.value = val
})
watch(() => notifStore.list.data, (val: any) => {
  dataNotification.value = val.slice(0, 3)
})

$mitt.on('profile', (val: any) => {
  if (JSON.stringify(val) !== JSON.stringify($localUser())) {
    userProfile.value = val
    localStorage.setItem('user', JSON.stringify(val))
  }
})
</script>
<template>
  <div class="sticky top-0 z-50 w-full mt-4 h-18">
    <nav class="flex items-center justify-end px-4">
      <div class="w-full h-full">
        <div class="flex items-center justify-between p-2 pl-4 pr-4 bg-white rounded-xl" style="box-shadow: 0px 2px 6px rgba(67, 89, 113, 0.20); gap: 10px;">
          <button class="block lg:hidden" @click="$mitt.emit('show-nav')">
            <Icon name="zondicons:stroke-width" color="black" size="24" />
          </button>
          <div class="items-center bg-white gap-4 hidden lg:flex">
            <template v-if="(menu === 'Dashboard' || $route.name === 'dashboard') && $route.name !== 'profile'">
              <ReInputText
                v-model="searchTicket"
                type="text"
                placeholder="Masukkan Kode Tiket"
                icon="left"
                :require="false"
                @keypress.enter="
                  ticketStore.$patch({ codeTicket: searchTicket }),
                  $router.push('/ticket')
                "
              >
                <template #icon>
                  <Icon name="circum:search" color="black" size="22" />
                </template>
              </ReInputText>
              <CButton
                text="Cari"
                type="outlined"
                @click="
                  ticketStore.$patch({ codeTicket: searchTicket }),
                  $router.push('/ticket')
                "
              />
            </template>
            <template v-else>
              <Icon name="majesticons:home" class="text-primary" size="24" />
              <Icon name="grommet-icons:form-next" color="gray" size="22" />
              <div class="text-primary-500">
                {{ $route.name === 'profile' ? 'Profil' : $route.name === 'notification' ? 'Notifikasi' : menu }}
              </div>
            </template>
          </div>
          <div class="flex items-center justify-end" style=" gap: 14px;">
            <NuxtLink
              v-if="!userProfile?.phone || userProfile?.phone === '62'"
              to="/profile"
              class="flex items-center"
              title="Lengkapi profil Anda"
            >
              <CLabelText
                text="Lengkapi profil Anda"
                class="w-max hidden md:block"
                text-color="text-error-500"
                bg-color="bg-error-100"
              />
              <Icon name="ph:warning-circle-fill" class="text-2xl text-error-500"/>
            </NuxtLink>
            <div class="flex items-start gap-4">
              <div title="Notifikasi" class="relative cursor-pointer" @click="handleOpenNotif">
                <Icon name="carbon:notification" size="24px" class="text-primary" />
                <div
                  class="absolute inline-flex items-center justify-center w-3 h-3 border-2 border-white rounded-full top-[1px] end-[1px]"
                  :class="{ 'animate-ping bg-orange-500': hasNotif, 'hidden': !hasNotif }"
                />
                <div
                  class="absolute inline-flex items-center justify-center border-2 border-white rounded-full start-2 text-white text-xs"
                  :class="[
                    {
                      'bg-orange-500': totalUnread,
                      'hidden': !totalUnread
                    },
                    totalUnread > 99 ? 'w-7 h-7 -top-3' : 'w-6 h-6 -top-2'
                  ]"
                >
                  <h1>
                    {{ totalUnread > 99 ? '99+' : totalUnread }}
                  </h1>
                </div>
              </div>
              <div title="Profil" class="cursor-pointer" @click="$router.push('/profile'), searchTicket = ''">
                <Icon name="uil:setting" color="black" size="24" />
              </div>
              <div title="Keluar" class="cursor-pointer text-error-500" @click="modalLogout.open()">
                <Icon name="clarity:power-solid" size="24" />
              </div>
            </div>
            <div style="width: 20px; height: 0px; transform: rotate(90deg); border: 0.50px #E2E8F0 solid" />
            <div
              v-if="$localUser() && localAuth"
              class="flex items-center w-full max-w-[calc(100vh/3)] gap-4 truncate"
            >
              <Avatar
                :size="10"
                text-class="text-2xl"
                :name="userProfile.fullname"
                :avatar="getUserAvatar()"
              />
              <div class="flex-col w-2/3 hidden md:flex">
                <div :title="userProfile.fullname" class="font-bold text-neutral">
                  {{ userProfile.fullname }}
                </div>
                <div :title="userProfile.roles.map((el: any) => el.name).join(', ')" class="text-sm text-neutral-500">
                  {{ userProfile.roles.length > 1 ? `${userProfile.roles[0].name}...` : userProfile.roles[0].name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div
      v-if="$localUser() && localAuth && popup"
      class="fixed z-50 p-6 m-2 shadow-md bg-neutral-100 rounded-xl right-10 max-w-sm"
      @mouseleave="popup = false"
    >
      <svg
        class="absolute right-4 -top-1.5"
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="8"
        viewBox="0 0 23 8"
        fill="none"
      >
        <path d="M11.5 0.5L22.016 8H0.983982L11.5 0.5Z" fill="white" />
      </svg>
      <div
        class="flex flex-row gap-2 p-4 rounded-lg cursor-pointer hover:bg-primary-100"
        @click="modalLogout.open()"
      >
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
            <path d="M10.55 1.16663H9.03333C7.16667 1.16663 6 2.33329 6 4.19996V6.56246H9.64583C9.885 6.56246 10.0833 6.76079 10.0833 6.99996C10.0833 7.23913 9.885 7.43746 9.64583 7.43746H6V9.79996C6 11.6666 7.16667 12.8333 9.03333 12.8333H10.5442C12.4108 12.8333 13.5775 11.6666 13.5775 9.79996V4.19996C13.5833 2.33329 12.4167 1.16663 10.55 1.16663Z" fill="#F6F8FB" />
            <path d="M3.41003 6.56245L4.61753 5.35495C4.70503 5.26745 4.74586 5.15662 4.74586 5.04578C4.74586 4.93495 4.70503 4.81828 4.61753 4.73662C4.44836 4.56745 4.16836 4.56745 3.99919 4.73662L2.04503 6.69078C1.87586 6.85995 1.87586 7.13995 2.04503 7.30912L3.99919 9.26328C4.16836 9.43245 4.44836 9.43245 4.61753 9.26328C4.78669 9.09412 4.78669 8.81412 4.61753 8.64495L3.41003 7.43745H6.00003V6.56245H3.41003Z" fill="#F6F8FB" />
          </svg>
        </div>
        <div>
          <h1 class="font-semibold">
            Keluar
          </h1>
          <h1 class="text-xs text-neutral-500">
            Keluar dari akun dan mengakhiri sesi Anda saat ini
          </h1>
        </div>
      </div>
    </div>
    <div
      v-if="showNotif"
      class="fixed z-50 max-w-md px-6 pt-10 shadow-md bg-neutral-100 rounded-xl top-20 end-64"
      :class="auth ? 'right-[22%]' : 'right-[21%]'"
      @mouseleave="showNotif = false"
    >
      <!--
        <svg
          class="absolute right-4 -top-1.5"
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="8"
          viewBox="0 0 23 8"
          fill="none"
        >
          <path d="M11.5 0.5L22.016 8H0.983982L11.5 0.5Z" fill="white" />
        </svg>
      -->
      <h1 class="text-2xl font-bold">
        Notifikasi
      </h1>
      <div class="flex flex-col pt-4 text-sm divide-y">
        <div
          v-for="(v, i) in dataNotification"
          :key="i"
          class="p-4 space-y-2 cursor-pointer hover:bg-primary-100/20"
          :class="{'opacity-70': i === 2}"
          @click="readNotif(v), v.is_read = false"
        >
          <div class="flex flex-row items-center gap-6">
            <div v-show="!v.is_read" class="text-base">
              <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.5" width="7" height="7" rx="3.5" fill="#2953A1" />
              </svg>
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <h1 v-html="v.title" />
          </div>
          <h1 class="pl-8 text-neutral-300">
            {{ waktuYangLalu(v.created_at) }}
          </h1>
        </div>
      </div>
      <div
        class="p-3 text-sm flex"
        :class="dataNotification.filter((el: any) => !el.is_read).length ? 'justify-between' : 'justify-center'"
      >
        <NuxtLink to="/notification" class="hover:underline">
          View All
        </NuxtLink>

        <div
          v-if="dataNotification.filter((el: any) => !el.is_read).length"
          :class="isLoading ? 'cursor-progress' : 'cursor-pointer hover:underline'"
          @click="readAllNotif"
        >
          Read All
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MiniDropdown from '~/pages/ticket/components/Dropdown.vue'
import ModalConfirm from '~/pages/ticket/components/ModalConfirm.vue'
import AssigneeDropdown from '~/pages/ticket/components/AssigneeDropdown.vue'
import PrintForm from '~/pages/ticket/components/PrintForm.vue'
import ModalRating from '~/pages/ticket/components/ModalRating.vue'
import ModalDigitalSignature from '~/pages/ticket/components/ModalDigitalSignature.vue'
import { useTicketStore } from '~/store/ticket'

useHead({
  title: 'Detail Tiket'
})
definePageMeta({
  components: {
    MiniDropdown,
    ModalConfirm,
    AssigneeDropdown,
    PrintForm,
    ModalRating
  },
  alias: '/pengelolaan_tiket' // sesuai dari api/role-menu
})

const tabComments = ref([
  {
    id: 'umum',
    name: 'Komentar umum'
  },
  {
    id: 'log',
    name: 'Riwayat'
  }
])
const activeTabComment = ref('umum')

const showDetail = ref(true)
const detail = ref()
const flows = ref(Array())
const disButton = ref(false)
const idTicket: any = useRoute().params.idMyTicket
const chats = ref(Array())
const chatFiles = ref(Array())
const reply = ref()
const replyInternal = ref()
const onReplyInternal = ref(false)
const replyId = ref()
const replyChatId = ref()
const { $api, $toast, $localUser, $distanceDate, $localeId } = useNuxtApp()
const shownConfirm = ref(false)
const shownModal = ref()
const formInfoTicket = ref({
  impact_level_id: '',
  complaint_classification_id: '',
  complaint_category_id: '',
  it_asset_id: '',
  limit_ticket_resolve_by_agent: ''
})
const statusTicket = ref()
const initChatPagination = () => ({
  page: 1,
  pages: 1,
  perPage: 5
})
const chatPagination = ref(initChatPagination())
const subChats = ref(Array())
const subChatPagination = ref({
  page: 1,
  count: 0,
  perPage: 1
})
const logTicket = ref(Array())
const initLogPagination = () => ({
  page: 1,
  pages: 1,
  perPage: 5
})
const logPagination = ref(initLogPagination())
const loading = ref(false)
const scrollY = ref()
const y = ref()
const hscreen = ref()
const handleScroll = () => {
  scrollY.value = window.scrollY
  hscreen.value = document.body.offsetHeight
  y.value = window.innerHeight
}
const mobileTab = ref([
  { id: 'ticket', name: 'Tiket' },
  { id: 'flow', name: 'Alur' }
])
const activeMobileTab = ref('ticket')
const limitSLA = ref()
const showPrintForm = ref(false)
const shownRating = ref(false)
const shownDigitalSignature = ref(false)

const getDetail = async () => {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.ticket.detailMyTicket(idTicket)
  if (data.value) {
    detail.value = data.value.data
    formInfoTicket.value.impact_level_id = detail.value.impact_level.id
    formInfoTicket.value.complaint_classification_id = detail.value.complaint_classification.id
    formInfoTicket.value.complaint_category_id = detail.value.complaint_category.id
    formInfoTicket.value.it_asset_id = detail.value.it_asset?.id
    formInfoTicket.value.limit_ticket_resolve_by_agent = detail.value.limit_ticket_resolve_by_agent
    limitSLA.value = formInfoTicket.value.limit_ticket_resolve_by_agent
    statusTicket.value = statusTicketString(data.value.data.status_ticket.id)
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
const getFlows = async () => {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.getInfo(idTicket)
  if (data.value) flows.value = data.value.data
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
const listChat = async () => {
  chats.value = []
  const {
    data,
    error
  } = await $api.chat.list(
    idTicket,
    {
      category: activeTabComment.value,
      per_page: chatPagination.value.perPage,
      page: chatPagination.value.page
    }
  )
  if (data.value) {
    chats.value = data.value.data.result
    chatPagination.value.pages = data.value.data.total_page
  }
  if (error.value) $toast.error(error.value.data.message)
}
const listSubChat = async (idParentChat: string, page?: number) => {
  const findSubChat = subChats.value.find(el => el.idParentChat === idParentChat)
  const {
    data,
    error
  } = await $api.chat.listSub(
    idParentChat,
    {
      per_page: findSubChat.perPage,
      page: page || findSubChat.page
    }
  )
  if (data.value) {
    findSubChat.result.push(...data.value.data.result)
    findSubChat.count = data.value.data.total_count - findSubChat.result.length
  }
  if (error.value) $toast.error(error.value.data.message)
}
const fileChat = async (e: any) => {
  const file = {
    image: e.target.files[0]
  }
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.chat.uploadImage(jsonToFormData(file))
  if (data.value) chatFiles.value.push({ ...data.value.data, is_updated: false, is_deleted: false })
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}
const storeFile = async (chatId: String) => {
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.chat.storeImage({ trx_ticket_chat_id: chatId, image: chatFiles.value })
  if (data.value) chatFiles.value.pop()
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}
const chatting = async () => {
  let body
  let isSubChat
  if (activeTabComment.value === 'umum') {
    isSubChat = false
    body = { trx_ticket_id: idTicket, message: reply.value }
  }
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.chat.create(body)
  if (data.value) {
    if (chatFiles.value.length) await storeFile(data.value.data.id)
    reply.value = ''
    replyInternal.value = ''
    onReplyInternal.value = false
    if (isSubChat) {
      isSubChat.page++
      listSubChat(replyChatId.value, isSubChat.result.length + 1)
    } else {
      listChat()
    }
    if (!detail.value.is_response_agent) getDetail()
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}
const getLog = async () => {
  const {
    data,
    error
  } = await $api.ticket.getLogTicket(idTicket, {
    per_page: logPagination.value.perPage,
    page: logPagination.value.page
  })
  if (data.value) {
    logTicket.value = data.value.data
    logPagination.value.pages = data.value.meta.last_page
  }
  if (error.value) $toast.error(error.value.data.message)
}

onMounted(async () => {
  await getDetail()
  await getFlows()
  if (activeTabComment.value === 'umum') {
    chatPagination.value = initChatPagination()
    listChat()
  }
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
watch(() => activeTabComment.value, (val) => {
  if (val === 'log') {
    getLog()
  } else if (val) {
    chatPagination.value = initChatPagination()
    listChat()
  }
})
watch(() => chatPagination.value.page, (val) => {
  listChat()
})
watch(() => chatPagination.value.perPage, (val) => {
  chatPagination.value.page = 1
  listChat()
})
watch(() => logPagination.value.page, (val) => {
  getLog()
})
watch(() => logPagination.value.perPage, (val) => {
  logPagination.value.page = 1
  getLog()
})

function checkInfoTicket (action?: string) {
  shownConfirm.value = true
  if (action) {
    shownModal.value = action
  } else if (statusTicket.value !== 'open' && statusTicket.value !== 'progress' && statusTicket.value !== 're-open') {
    shownModal.value = 'close'
  } else {
    shownModal.value = 'confirm'
  }
}
function closeConfirm (message: any) {
  $toast.success(message)
  getDetail()
  getFlows()
  listChat()
}
function onRating (e: any) {
  if (e) {
    shownRating.value = false
    closeConfirm('Nilai berhasil diberikan')
  }
}
function dateDiff () {
  const diff = $distanceDate(
    tglToDate(detail.value?.last_confirmation?.change_status_at),
    new Date(tglToDate(detail.value?.limit_ticket_resolve_by_agent_format)),
    {
      addSuffix: true,
      locale: $localeId()
    }
  )
  
  if (diff.includes('yang lalu')) {
    return diff.replace('yang lalu', 'lebih cepat')
  } else if (diff.includes('dalam waktu')) {
    return diff.replace('dalam waktu', '') + ' lebih lama'
  }
}

</script>
<template>
  <div class="p-4 space-y-4">
    <CButton
      size="small"
      text="Kembali"
      color="neutral"
      icon="bytesize:chevron-left"
      @click="
        useTicketStore().$patch({ getStore: true }),
        $router.push('/ticket')
      "
    />

    <div
      v-if="loading"
      class="gap-4 flex flex-row"
    >
      <SKeleton class="w-full h-[calc(100vh-8rem)] rounded-lg" />
      
      <SKeleton class="hidden lg:block w-1/3 h-[calc(100vh-8rem)] rounded-lg" />
    </div>
    
    <div v-show="!loading" class="lg:gap-4 lg:flex lg:flex-row">
      <Tab
        :tabs="mobileTab"
        :active-tab="activeMobileTab"
        type="underlined-primary"
        styles="font-semibold rounded-lg m-2 mx-1"
        class="block lg:hidden"
        @switch-tab="activeMobileTab = $event.id"
      />
      <div :class="activeMobileTab === 'ticket' ? 'block' : 'hidden lg:block'" class="w-full shadow p-4 lg:p-7" style="align-self: stretch; background: white; border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px;">
        <div
          v-if="detail?.rating"
          class="max-h-24 overflow-y-auto"
        >
          <CRatingStar
            :rating="detail?.rating?.grade"
            readonly
          />
          <h1 class="text-neutral-400">
            {{ detail?.rating?.message }}
          </h1>
        </div>
        <CButton
          v-else-if="statusTicket === 'resolved'"
          text="Berikan Nilai"
          type="outlined"
          @click="shownRating = true"
        />
        <div class="flex justify-between mt-4">
          <div class="w-full">
            <div class=" text-secondary-text">
              {{ detail?.code_ticket }}
            </div>
            <div class=" text-neutral text-2xl font-bold">
              {{ detail?.title }}
            </div>
          </div>
          <div class="w-full flex flex-col items-end gap-2">
            <CLabelText
              v-if="detail?.limit_ticket_resolve_by_agent_format"
              :text="detail?.limit_ticket_resolve_by_agent_format"
              bg-color="bg-stroke"
              text-color="text-neutral-500"
              text-size="text-xs"
            />
            <CButton
              text=""
              class="!p-1.5 !text-xs"
              icon="material-symbols:print"
              :type="showPrintForm ? 'filled' : 'outlined'"
              @click="showPrintForm = !showPrintForm"
            />

            <CButton
              v-if="detail?.service?.path_report"
              text=""
              class="!p-1.5 !text-xs"
              icon="fluent:signature-20-filled"
              type="outlined"
              @click="shownDigitalSignature = !shownDigitalSignature"
            />
          </div>
        </div>
        <PrintForm
          v-if="showPrintForm"
          :code-ticket="detail.code_ticket"
        />
        <div class="p-2 lg:p-4" style="width: 100%; background: white; box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05); border-radius: 8px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 32px; display: flex">
          <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-end; gap: 16px; display: flex">
            <div style="align-self: stretch; justify-content: space-between; align-items: center; display: inline-flex">
              <div class="text-neutral text-xl font-semibold">
                Informasi Tiket
              </div>
              <div class="text-primary-500 text-xs cursor-pointer" @click="showDetail=!showDetail">
                {{ showDetail ? 'Sembunyikan detail' : 'Tampilkan detail'}}
              </div>
            </div>
            <div v-show="showDetail" class="flex flex-wrap text-sm gap-4 items-center">
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Nama Pemohon
              </div>
              <h1 class="overflow-hidden text-ellipsis w-[45%] lg:w-[23%]" :title="detail?.user?.name">
                {{ detail?.user?.name || '-' }}
              </h1>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Email Pemohon
              </div>
              <h1 class="overflow-hidden text-ellipsis w-[45%] lg:w-[23%]" :title="detail?.user?.email">
                {{ detail?.user?.email || '-' }}
              </h1>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                No. Telepon Pemohon
              </div>
              <h1 class="overflow-hidden text-ellipsis w-[45%] lg:w-[23%]" :title="detail?.user?.email">
                {{ detail?.user?.phone || '-' }}
              </h1>
              <template v-if="detail?.ticket_type?.toLowerCase() === 'internal'">
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Unit Kerja
                </div>
                <h1 class="overflow-hidden text-ellipsis w-[45%] lg:w-[23%]" :title="detail?.units_of_work?.name">
                  {{ detail?.units_of_work?.name || '-' }}
                </h1>
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Jabatan
                </div>
                <h1 class="overflow-hidden text-ellipsis w-[45%] lg:w-[23%]" :title="detail?.position?.name || detail?.position_text || '-'">
                  {{ detail?.position?.name || detail?.position_text || '-' }}
                </h1>
              </template>
              <template v-if="detail?.create_by_admin">
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Nama Pembuat
                </div>
                <h1 class="overflow-hidden text-ellipsis w-[45%] lg:w-[23%]" :title="detail?.create_by_admin?.fullname">
                  {{ detail?.create_by_admin?.fullname || '-' }}
                </h1>
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Email Pembuat
                </div>
                <h1 class="overflow-hidden text-ellipsis w-[45%] lg:w-[23%]" :title="detail?.create_by_admin?.email">
                  {{ detail?.create_by_admin?.email || '-' }}
                </h1>
              </template>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Status Tiket
              </div>
              <div class="w-[45%] lg:w-[23%] text-center">
                <CLabelText
                  :text="detail?.status_ticket.name"
                  :text-color="$colorLabel(detail?.status_ticket.id).text"
                  :bg-color="$colorLabel(detail?.status_ticket.id).bg"
                  text-size="text-xs"
                />
              </div>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Layanan
              </div>
              <div class="w-[45%] lg:w-[23%]">
                {{ detail?.service.name }}
              </div>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Tingkat Dampak
              </div>
              <MiniDropdown
                v-model="formInfoTicket.impact_level_id"
                api-module="ticket"
                api-method="getImpacts"
                option-label="name"
                option-value="id"
                :required="false"
                disabled
                class="w-[45%] lg:w-[23%]"
              />
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Klasifikasi Pengaduan
              </div>
              <MiniDropdown
                v-model="formInfoTicket.complaint_classification_id"
                api-module="classification"
                api-method="getList"
                option-label="name"
                option-value="id"
                :required="false"
                disabled
                response-data="result"
                class="w-[45%] lg:w-[23%]"
              />
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Kategori Pengaduan
              </div>
              <MiniDropdown
                v-model="formInfoTicket.complaint_category_id"
                api-module="complaintCategory"
                api-method="getList"
                option-label="name"
                option-value="id"
                :required="false"
                disabled
                response-data="result"
                class="w-[45%] lg:w-[23%]"
              />
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Sumber Laporan
              </div>
              <h1 class="mb-2 w-[45%] lg:w-[23%]">
                {{ detail?.report_source.name }}
              </h1>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Tiket Dibuat
              </div>
              <div class="w-[45%] lg:w-[23%]">
                {{ detail?.transaction_date_format || '-' }}
              </div>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                SLA Respon
              </div>
              <div v-if="detail?.is_response_agent && detail?.response_agent_date <= detail?.response_agent_limit_date" class="w-[45%] lg:w-[23%] text-center">
                <CLabelText
                  :title="detail?.response_agent_sla_format"
                  :text="detail?.response_agent_date ? $formatDate(detail?.response_agent_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : detail?.response_agent_sla_format"
                  bg-color="bg-success-100"
                  text-color="text-success-500"
                  text-size="text-xs"
                />
              </div>
              <vue-countdown
                v-else
                :time="new Date(detail?.response_agent_limit_date) - new Date()"
                v-slot="{ days, hours, minutes, seconds }"
                class="w-[45%] lg:w-[23%]"
              >
                <div
                  class="flex items-center text-center"
                  :title="days ? `${days} hari lagi` : hours ? `${hours} jam lagi` : minutes ? `${minutes} menit lagi` : seconds ? `${seconds} detik lagi` : 'Melewati SLA'"
                >
                  <CLabelText
                    :text="detail?.response_agent_date ? $formatDate(detail?.response_agent_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : detail?.response_agent_sla_format"
                    :bg-color="days || hours || minutes ? 'bg-primary-100' : seconds ? 'bg-secondary-100' : 'bg-error-100'"
                    :text-color="days || hours || minutes ? 'text-primary-500' : seconds ? 'text-secondary-500' : 'text-error-500'"
                    text-size="text-xs"
                  />
                  <Icon v-if="!days && !hours && !minutes && !seconds" name="ph:warning-circle-fill" class="text-error-500 text-xl" />
                </div>
              </vue-countdown>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Batas SLA Alur
              </div>
              <h1 class="w-[45%] lg:w-[23%]">
                {{ detail?.resolve_limit_date ? $formatDate(detail.resolve_limit_date, 'dd MMMM yyyy - HH:mm', { locale: $localeId() }).replace('-', 'Pukul') : detail?.resolve_sla_format ? detail.resolve_sla_format : '-' }}
              </h1>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                <h1>
                  Estimasi Penyelesaian Tiket
                </h1>
              </div>
              <h1 class="w-[45%] lg:w-[23%]">
                {{ detail?.limit_ticket_resolve_by_agent_format || '-' }}
              </h1>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Aset IT
              </div>
              <MiniDropdown
                v-model="formInfoTicket.it_asset_id"
                api-module="appAsset"
                api-method="getList"
                option-label="name"
                option-value="id"
                :required="false"
                disabled
                class="w-[45%] lg:w-[23%]"
              />
              <template v-if="statusTicket !== 'resolved'">
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Alur Ditangani pada
                </div>
                <h1 class="w-[45%] lg:w-[23%]">
                  {{ detail?.flow_progress_at ? $formatDate(detail.flow_progress_at, 'dd MMMM yyyy - HH:mm', { locale: $localeId() }).replace('-', 'Pukul') : '-' }}
                </h1>
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Alur Ditangani oleh
                </div>
                <AssigneeDropdown
                  class="w-[45%] lg:w-[23%]"
                  :id-ticket="idTicket"
                  :value="detail?.flow_progress_user"
                  :options="flows?.map(el => {
                    return el.flows.find(flow => flow.is_flow_active)?.user_agents
                  }).length ? flows?.map(el => {
                    return el.flows.find(flow => flow.is_flow_active)?.user_agents
                  })[0] : []"
                  disabled
                />
              </template>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                {{ statusTicket === 'resolved' ? 'Realisasi Penyelesaian Tiket' : 'Dikonfirmasi pada' }}
              </div>
              <h1 class="w-[45%] lg:w-[23%]">
                {{ detail?.last_confirmation?.change_status_at || '-' }}
              </h1>
              <template v-if="statusTicket === 'resolved'">
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Penyelesaian Tiket
                </div>
                <h1 class="w-[45%] lg:w-[23%]">
                  {{
                    detail?.limit_ticket_resolve_by_agent_format
                    && detail?.last_confirmation?.change_status_at
                    && dateDiff()
                  }}
                </h1>
              </template>
              <template v-else>
                <div class="font-semibold w-[45%] lg:w-[23%]">
                  Dikonfirmasi oleh
                </div>
                <h1 class="w-[45%] lg:w-[23%]">
                  {{ detail?.last_confirmation?.change_status_user?.name || '-' }}
                </h1>
              </template>
            </div>
          </div>
          <div v-show="showDetail" style="align-self: stretch; height: 0px; border: 2px #E2E8F0 solid" />
          <div class="w-full text-sm space-y-8">
            <div>
              <span class="font-semibold">
                Subjek Tiket
              </span>
              <div>
                {{ detail?.title }}
              </div>
            </div>
            <div>
              <div class="font-semibold">
                Deskripsi Tiket
              </div>
              <ChatBox v-if="detail?.content" :value="detail.content" class-wrapper="p-0" />
            </div>
            <div>
              <div class="font-semibold">
                Lampiran
              </div>
              <div v-if="!detail?.files.length">
                Tidak ada
              </div>
              <div
                v-for="(file, i) in detail?.files"
                :key="i"
                class="flex flex-wrap"
              >
                <Icon name="material-symbols:image" color="#2953A1" size="24" />
                <div
                  class="text-neutral-500 hover:underline cursor-pointer"
                  @click="$onPreviewFile(file)"
                >
                  <span class="text-primary-600">{{ file.filename }}</span> {{ file.size }} KB
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full" style="background: white; justify-content: flex-start; align-items: flex-start; gap: 10px;">
          <div class="w-10 h-10">
            <Avatar
              v-if="$localUser()"
              :size="10"
              text-class="text-2xl"
              :name="$localUser().fullname"
              class="w-full"
            />
          </div>
          <div>
            <Tab
              :tabs="tabComments"
              :active-tab="activeTabComment"
              type="underlined"
              styles="font-semibold"
              class="w-max"
              @switch-tab="activeTabComment = $event.id"
            />
            <ReTextEditor
              v-if="activeTabComment === 'umum'"
              v-model="reply"
              :inline-image="false"
              btn-confirm="Kirim Balasan"
              :disabled-btn="disButton"
              @upload="fileChat($event)"
              @cancel-upload="chatFiles.splice($event, 1)"
              @confirmed="chatting"
            />
          </div>
        </div>
        <div class="w-full h-full">
          <div class="text-sm" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
            <div class="font-semibold border-t-4 w-full pt-4">
              {{ activeTabComment === 'internal' ? 'Aktivitas' : activeTabComment === 'umum' && !chats.length ? 'Tidak ada chat' : activeTabComment === 'umum' ? 'Chat' : ''}}
            </div>
          </div>
          <div class="w-full mt-4 text-sm">
            <div
              v-if="activeTabComment === 'umum'"
              class="flex flex-col gap-8"
            >
              <div
                v-for="(chat) in chats"
                :key="chat.id"
                :class="{
                  'justify-end': chat.position === 'right',
                  'justify-start': chat.position === 'left'
                }"
                class="flex flex-row gap-2 items-start"
              >
                <Avatar
                  v-if="chat.position === 'left'"
                  :avatar="chat.user.avatar"
                  :name="chat.user.name"
                  :size="8"
                />
                <div class="flex flex-col gap-2">
                  <h1 class="font-medium" :class="{ 'text-right': chat.position === 'right' }">
                    {{ chat.user.id === $localUser().id ? 'Anda' : chat.user.name }}
                  </h1>
                  <ChatBox :value="chat.message" :position="chat.position" :files="chat.image" />
                  <h1 class="text-xs text-secondary-text">
                    {{ chat.send_date }}
                  </h1>
                </div>
                <Avatar
                  v-if="chat.position === 'right'"
                  :avatar="chat.user.avatar"
                  :name="chat.user.name"
                  :size="8"
                />
              </div>
              <div v-if="chats.length">
                <ButtonPagination
                  v-model="chatPagination.page"
                  :pages="chatPagination.pages"
                  :per-page="chatPagination.perPage"
                  @per-page="chatPagination.perPage = $event"
                />
              </div>
            </div>
            <div
              v-else-if="activeTabComment === 'log'"
              class="space-y-8"
            >
              <HistoryActivity
                :data="logTicket"
              />
              <ButtonPagination
                v-if="logTicket.length"
                v-model="logPagination.page"
                :pages="logPagination.pages"
                :per-page="logPagination.perPage"
                @per-page="logPagination.perPage = $event"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="shadow p-8 rounded-lg space-y-2 w-full lg:w-1/3 relative bg-white"
        :class="activeMobileTab === 'flow' ? 'block' : 'hidden lg:block'"
      >
        <h1 class="font-semibold">
          Alur Tiket
        </h1>
        <div class="p-2.5">
          <TimeLine
            :items="flows"
            :user-active="detail?.is_user_flow_active"
          />
        </div>
        <div
          class="flex flex-col lg:fixed lg:bottom-0 gap-2 bg-white p-4"
          :class="{
            'lg:bottom-4': Math.round(scrollY) + y === hscreen,
            'lg:right-16': statusTicket !== 'progress' && statusTicket !== 'open' && statusTicket !== 'req-open' && statusTicket !== 're-open'
          }"
        >
          <CButton
            v-if="statusTicket === 'close' || statusTicket === 'resolved' || statusTicket === 'rejected'"
            class="w-full"
            text="Re-Open Tiket"
            @click="checkInfoTicket('re-open')"
          />
          <CButton
            v-if="statusTicket === 'progress' || statusTicket === 'open'"
            class="w-full"
            text="Close Tiket"
            color="error"
            @click="checkInfoTicket('close')"
          />
        </div>
      </div>
    </div>
    <ModalConfirm
      v-if="shownConfirm"
      v-model="shownConfirm"
      :shown-modal="shownModal"
      :status-ticket="statusTicket"
      :id-ticket="idTicket"
      :form-info-ticket="formInfoTicket"
      @success="closeConfirm($event)"
      @closed="shownConfirm = false"
    />
    <ModalRating
      v-if="shownRating"
      v-model="shownRating"
      :id-ticket="idTicket"
      @success="onRating($event)"
    />

    <ModalDigitalSignature
      v-if="shownDigitalSignature"
      v-model="shownDigitalSignature"
      :cd-ticket="detail?.code_ticket"
      :form-type="detail?.service?.path_report"
    />
  </div>
</template>

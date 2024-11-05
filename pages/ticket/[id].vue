<script lang="ts" setup>
import MiniDropdown from '~/pages/ticket/components/Dropdown.vue'
import ModalConfirm from '~/pages/ticket/components/ModalConfirm.vue'
import ModalFormViewer from './components/ModalFormViewer.vue'
import { addDays } from 'date-fns'
// import { useVuelidate } from '@vuelidate/core'
// import { required } from '@vuelidate/validators'
import ModalDefineSla from '~/pages/ticket/components/ModalDefineSla.vue'
import AssigneeDropdown from './components/AssigneeDropdown.vue'
import PrintForm from './components/PrintForm.vue'
import Buttons from './components/Buttons.vue'
import { useTicketStore } from '~/store/ticket'
import TabCommentUmum from './components/TabCommentUmum.vue'
import TabFiles from './components/TabFiles.vue'
import ModalUpdateProfile from './components/ModalUpdateProfile.vue'
import ModalReDS from './components/ModalReDS.vue'
import { isIncident } from '~/utils/flowTag'

useHead({
  title: 'Detail Tiket'
})
definePageMeta({
  components: {
    MiniDropdown,
    ModalConfirm,
    ModalFormViewer,
    AssigneeDropdown,
    PrintForm,
    Buttons,
    TabCommentUmum,
    TabFiles
  },
  alias: '/pengelolaan_tiket' // sesuai dari api/role-menu
})

const route = useRoute()

const tabActivities = ref([
  {
    id: 'internal',
    name: 'Komentar Internal'
  },
  {
    id: 'log',
    name: 'Riwayat'
  }
])
const activeTabActivity = ref('internal')
const tabComments = ref([
  tabActivities.value[0],
  {
    id: 'umum',
    name: 'Komentar umum'
  },
  {
    id: 'files',
    name: 'Berkas'
  }
])
const activeTabComment = ref('internal')

const showDetail = ref(true)
const detail = ref()
const flows = ref(Array())
const disButton = ref(false)
const idTicket: any = useRoute().params.id
const chats = ref(Array())
const chatFiles = ref(Array())
const reply = ref()
const replyInternal = ref()
const onReplyInternal = ref(false)
const replyId = ref()
const replyChatId = ref()
const replyFiles = ref(Array())
const { $api, $toast, $checkPermission, $localUser, $formatDate, $distanceDate, $localeId } = useNuxtApp()
const shownConfirm = ref(false)
const shownModal = ref()
const showModalViewer = ref(false)
const initFormInfo = () => ({
  impact_level_id: '',
  complaint_classification_id: '',
  complaint_category_id: '',
  it_asset_id: '',
  limit_ticket_resolve_by_agent: ''
})
const formInfoTicket = ref(initFormInfo())
// const formRules = computed(() => {
//   return {
//     impact_level_id: {
//       required
//     },
//     complaint_classification_id: {
//       required
//     },
//     complaint_category_id: {
//       required
//     }
//   }
// })
// const vuelidate = useVuelidate(formRules, formInfoTicket.value)
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
const shownSla = ref(false)
const loading = ref(false)
const scrollY = ref()
const y = ref()
const hscreen = ref()
const handleScroll = () => {
  scrollY.value = window.scrollY
  hscreen.value = document.body.offsetHeight
  y.value = window.innerHeight
}
const showButtons = ref(false)
const mobileTab = ref([
  { id: 'ticket', name: 'Tiket' },
  { id: 'flow', name: 'Alur' }
])
const activeMobileTab = ref('ticket')
const onEditSLA = ref(false)
const limitSLA = ref()
const showPrintForm = ref(false)
const handlingAgents = ref(Array())
const loadingFormInfo = ref(initFormInfo())
const showModalNIK = ref(false)
const formRequest = ref('')
const showModalReDS = ref(false)
const flowStageId = ref('')
const activeFlow = ref()
const isFlowTagIncident = ref(false)

const getDetail = async () => {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.getById(idTicket)
  if (data.value) {
    detail.value = data.value.data
    formInfoTicket.value.impact_level_id = detail.value.impact_level.id
    formInfoTicket.value.complaint_classification_id = detail.value.complaint_classification?.id
    formInfoTicket.value.complaint_category_id = detail.value.complaint_category?.id
    formInfoTicket.value.it_asset_id = detail.value.it_asset?.id
    formInfoTicket.value.limit_ticket_resolve_by_agent = detail.value.limit_ticket_resolve_by_agent
    limitSLA.value = formInfoTicket.value.limit_ticket_resolve_by_agent
    onEditSLA.value = false
    statusTicket.value = statusTicketString(data.value.data.status_ticket.id)
    buttonCondition()
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
  if (data.value) {
    flows.value = data.value.data

    activeFlow.value = flows.value?.map((el: any) => el.flows.find((flow: any) => flow.is_flow_active))?.find(el => el)

    handlingAgents.value = activeFlow.value?.user_agents || []

    checkFlowTag()
  }
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
  if (activeTabComment.value === 'internal' && activeTabActivity.value === 'internal' && onReplyInternal.value) {
    isSubChat = subChats.value?.find(el => el.idParentChat === replyChatId.value)
    body = { trx_ticket_id: idTicket, message: replyInternal.value, category: 'internal', sub_chat_id: replyChatId.value }
  } else if (activeTabComment.value === 'internal') {
    isSubChat = false
    body = { trx_ticket_id: idTicket, message: reply.value, category: 'internal' }
  } else if (activeTabComment.value === 'umum') {
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
  if (activeTabActivity.value === 'internal' || activeTabComment.value === 'umum') {
    chatPagination.value = initChatPagination()
    listChat()
  }
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
watch(() => activeTabComment.value, (val) => {
  if (val && val !== 'files') {
    chatPagination.value = initChatPagination()
    listChat()
  }
})
watch(() => activeTabActivity.value, (val) => {
  if (val === 'internal') {
    chatPagination.value = initChatPagination()
    listChat()
  } else if (val === 'log') {
    logPagination.value = initLogPagination()
    getLog()
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
watch(() => limitSLA.value, async (val) => {
  if (val) { formInfoTicket.value.limit_ticket_resolve_by_agent = $formatDate(val, 'yyyy-MM-dd HH:mm')}
  else { formInfoTicket.value.limit_ticket_resolve_by_agent = '' }
  if (!loading.value && val !== detail.value?.limit_ticket_resolve_by_agent) {
    await updateTicket('limit_ticket_resolve_by_agent')
  }
})
watch(() => formInfoTicket.value.impact_level_id, async (val) => {
  if (!loading.value && val !== detail.value?.impact_level.id) {
    await updateTicket('impact_level_id')
  }
})
watch(() => formInfoTicket.value.complaint_classification_id, async (val) => {
  if (!loading.value && val !== detail.value?.complaint_classification?.id) {
    await updateTicket('complaint_classification_id')
  }
})
watch(() => formInfoTicket.value.complaint_category_id, async (val) => {
  if (!loading.value && val !== detail.value?.complaint_category?.id) {
    await updateTicket('complaint_category_id')
  }
})
watch(() => formInfoTicket.value.it_asset_id, async (val) => {
  if (!loading.value && val !== detail.value?.it_asset?.id) {
    await updateTicket('it_asset_id')
  }
})

function onReply (chatId: string) {
  replyChatId.value = chatId
  if (replyId.value === chatId) {
    onReplyInternal.value = false
    replyId.value = null
  } else {
    onReplyInternal.value = true
    replyId.value = chatId
  }
}
function checkInfoTicket (action?: string) {
  // vuelidate.value.$validate()
  // if (vuelidate.value.$error) {
  //   $toast.warn('Pastikan informasi tiket sudah lengkap')
  // } else {
    
    if (action === 'handled' && !activeFlow.value?.sla) {
      $toast.warn('SLA alur belum ditentukan')
    } else {
      if ($localUser().is_passphrase && !isCanDS()) return

      shownConfirm.value = true
      if (action) {
        shownModal.value = action
      } else if (statusTicket.value !== 'open' && statusTicket.value !== 're-open') {
        shownModal.value = 'close'
      } else {
        shownModal.value = 'confirm'
      }
    }
// }
}
function closeConfirm (message: any) {
  $toast.success(message)
  getDetail()
  getFlows()
  listChat()
  // vuelidate.value.$reset()
}
function toggleSubChat (idParentChat: string) {
  const finded = subChats.value.find(el => el.idParentChat === idParentChat)
  if (finded && !finded?.shown) {
    return finded.shown = true
  } else if (finded) {
    finded.page += 1
  } else {
    subChats.value.push({
      idParentChat: idParentChat,
      shown: true,
      ...subChatPagination.value,
      result: []
    })
  }
  listSubChat(idParentChat)
}
const onSubmitViewer = (val: any) => {
  if (val) {
    getDetail()
  }
}
const removeViewer = async (id: any) => {
  const { data, error } = await $api.ticket.addViewerTicket(route.params.id, {
    users: [
      {
        id,
        is_deleted: true
      }
    ]
  })

  if (data.value) {
    $toast.success('Viewer berhasil dihapus', { position: 'bottom-right' })
    getDetail()
  }

  if (error.value) {
    $toast.error('Gagal.', { position: 'bottom-right' })
  }
}
function buttonCondition () {
  if ($checkPermission('pengelolaan_tiket', 'confirm_all')) {
    if (
      $checkPermission('pengelolaan_tiket', 're-open') ||
      $checkPermission('pengelolaan_tiket', 'confirm') ||
      $checkPermission('pengelolaan_tiket', 'reject') ||
      $checkPermission('pengelolaan_tiket', 'close') ||
      $checkPermission('pengelolaan_tiket', 'assign_confirm') ||
      $checkPermission('pengelolaan_tiket', 'change-service') ||
      $checkPermission('pengelolaan_tiket', 'previous-flow')
    ) {
      showButtons.value = true
    } else {
      showButtons.value = false
    }
  } else {
    if (
      $checkPermission('pengelolaan_tiket', 're-open') ||
      (
        (
          $checkPermission('pengelolaan_tiket', 'confirm') ||
          $checkPermission('pengelolaan_tiket', 'reject') ||
          $checkPermission('pengelolaan_tiket', 'close') ||
          $checkPermission('pengelolaan_tiket', 'assign_confirm') ||
          $checkPermission('pengelolaan_tiket', 'change-service') ||
          $checkPermission('pengelolaan_tiket', 'previous-flow')
        )
        && detail.value?.is_user_flow_active
      )
    ) {
      showButtons.value = true
    } else {
      showButtons.value = false
    }
  }
}
async function updateTicket (field: string) {
  loadingFormInfo.value[field] = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.updateTicket(idTicket, jsonToFormData(formInfoTicket.value))
  if (data.value) {
    await getDetail()
    $toast.success(data.value.message)
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loadingFormInfo.value[field] = pending.value
  loadingFormInfo.value[field] = false
}
function dateDiff () {
  const diff = $distanceDate(
    tglToDate(detail.value?.last_confirmation?.change_status_at),
    new Date(detail.value?.limit_ticket_resolve_by_agent),
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
function isCanDS (isReDS: boolean = false) {
  let result = true

  if (isReDS) {
    if ($localUser().is_passphrase && !$localUser().id_card_number) {
      showModalNIK.value = true
      result = false
    } else if ($localUser().is_passphrase && $localUser().id_card_number) {
      result = true
    }
  } else {
  
    if ($localUser().is_passphrase && $localUser().id_card_number) {
      formRequest.value = activeFlow.value?.path_report || ''
    }
  
    if ($localUser().is_passphrase && !$localUser().id_card_number && activeFlow.value?.path_report) {
      showModalNIK.value = true
      return result = false
    }
  }

  return result
}
function onSigned (link: string) {
  if (link) window.open(link, '_blank')
}
function onReDS (e: { path_report: string, trx_ticket_report_flow_stage_id: string }) {
  if (isCanDS(true)) {
    formRequest.value = e.path_report
    flowStageId.value = e.trx_ticket_report_flow_stage_id
    showModalReDS.value = true
  }
}
function checkFlowTag () {
  if (activeFlow.value && activeFlow.value?.tag) {
    isFlowTagIncident.value = isIncident(activeFlow.value.tag)
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
      class="flex gap-4 flex-row"
    >
      <SKeleton class="w-full h-[calc(100vh-8rem)] rounded-lg" />
      <SKeleton class="hidden lg:block w-1/3 h-[calc(100vh-8rem)] rounded-lg" />
    </div>
    <div v-show="!loading" class="lg:gap-4 lg:flex lg:flex-row w-full">
      <Tab
        :tabs="mobileTab"
        :active-tab="activeMobileTab"
        type="underlined-primary"
        styles="font-semibold rounded-lg m-2 mx-1"
        class="block lg:hidden"
        @switch-tab="activeMobileTab = $event.id"
      />
      <div :class="activeMobileTab === 'ticket' ? 'block' : 'hidden lg:block'" class="w-full lg:max-w-[calc(100vw*(3/5))] shadow p-4 lg:p-7" style="align-self: stretch; background: white; border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px;">
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
              <div class="w-[45%] lg:w-[23%]">
                <SKeleton v-if="loadingFormInfo.impact_level_id" class="w-full h-6 rounded-xl" />
                <MiniDropdown
                  v-show="!loadingFormInfo.impact_level_id"
                  v-model="formInfoTicket.impact_level_id"
                  api-module="ticket"
                  api-method="getImpacts"
                  option-label="name"
                  option-value="id"
                  :required="false"
                  :disabled="!($checkPermission('pengelolaan_tiket', 'confirm') && detail?.is_user_flow_active && statusTicket === 'open')"
                />
              </div>
              <!--
                :error="vuelidate.impact_level_id.$error ? vuelidate.impact_level_id.$errors[0].$message : ''"
                @change="vuelidate.impact_level_id.$touch"
              -->
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Klasifikasi Pengaduan
              </div>
              <div class="w-[45%] lg:w-[23%]">
                <SKeleton v-if="loadingFormInfo.complaint_classification_id" class="w-full h-6 rounded-xl" />
                <MiniDropdown
                  v-show="!loadingFormInfo.complaint_classification_id"
                  v-model="formInfoTicket.complaint_classification_id"
                  api-module="classification"
                  api-method="getList"
                  option-label="name"
                  option-value="id"
                  :required="false"
                  :disabled="!($checkPermission('pengelolaan_tiket', 'confirm') && detail?.is_user_flow_active && (statusTicket === 'open' || statusTicket === 're-open' || statusTicket === 'progress'))"
                  response-data="result"
                />
              </div>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Kategori Pengaduan
              </div>
              <div class="w-[45%] lg:w-[23%]">
                <SKeleton v-if="loadingFormInfo.complaint_category_id" class="w-full h-6 rounded-xl" />
                <MiniDropdown
                  v-show="!loadingFormInfo.complaint_category_id"
                  v-model="formInfoTicket.complaint_category_id"
                  api-module="complaintCategory"
                  api-method="getList"
                  option-label="name"
                  option-value="id"
                  :required="false"
                  :disabled="!($checkPermission('pengelolaan_tiket', 'confirm') && detail?.is_user_flow_active && (statusTicket === 'open' || statusTicket === 're-open' || statusTicket === 'progress'))"
                  response-data="result"
                />
              </div>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                Sumber Laporan
              </div>
              <h1 class="w-[45%] lg:w-[23%]">
                {{ detail?.report_source.name }}
              </h1>
              <div class="w-[45%] lg:w-[23%]">
                <div class="font-semibold mb-1">
                  Viewer
                </div>
                <button
                  v-show="!detail?.is_viewer"
                  class="text-primary underline"
                  @click="showModalViewer = true"
                >
                  [Tambah Viewer]
                </button>
              </div>
              <div class="w-[45%] lg:w-[23%]">
                <div v-if="detail?.user_viewers.length > 0" class="flex flex-row flex-wrap gap-2">
                  <div v-for="(v, i) in detail?.user_viewers" :key="i" class="relative">
                    <CLabelText :text="v.fullname" />
                    <button v-show="!detail?.is_viewer" class="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 absolute -right-2 -top-2 text-white" @click="removeViewer(v.id)">x</button>
                  </div>
                </div>
                <div v-else>Tidak Ada Viewer.</div>
              </div>
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
                <CButton
                  v-if="$checkPermission('pengelolaan_tiket', 'confirm') && detail?.is_user_flow_active && (statusTicket === 'open' || statusTicket === 're-open' || statusTicket === 'progress')"
                  type="text"
                  text="[Ubah]"
                  size="small"
                  class="underline !p-1 !font-normal"
                  @click="onEditSLA = !onEditSLA"
                />
              </div>
              <div class="w-[45%] lg:w-[23%]">
                <SKeleton v-if="loadingFormInfo.limit_ticket_resolve_by_agent" class="w-full h-6 rounded-xl" />
                <template v-else>
                  <div
                    v-if="onEditSLA"
                  >
                    <DatePicker
                      v-model="limitSLA"
                      :preset-range="false"
                      format="HH:mm-d/M/yy"
                      time
                      hide-input-icon
                    />
                  </div>
                  <h1
                    v-else
                  >
                    {{ detail?.limit_ticket_resolve_by_agent_format || '-' }}
                  </h1>
                </template>
              </div>
              <div class="font-semibold w-[45%] lg:w-[23%]">
                <h1>
                  Aset IT
                </h1>
                <div class="flex text-primary-400 text-xs gap-1">
                  <Icon name="icon-park-solid:attention" class="text-base"/>
                  <h1>
                    Hanya untuk keperluan IT
                  </h1>
                </div>
              </div>
              <div class="w-[45%] lg:w-[23%]">
                <SKeleton v-if="loadingFormInfo.it_asset_id" class="w-full h-6 rounded-xl" />
                <MiniDropdown
                  v-show="!loadingFormInfo.it_asset_id"
                  v-model="formInfoTicket.it_asset_id"
                  api-module="appAsset"
                  api-method="getList"
                  option-label="name"
                  option-value="id"
                  :required="false"
                  :disabled="!($checkPermission('pengelolaan_tiket', 'confirm') && detail?.is_user_flow_active && (statusTicket === 'open' || statusTicket === 're-open' || statusTicket === 'progress'))"
                />
              </div>
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
                  :options="handlingAgents"
                  @success="closeConfirm($event)"
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
                    detail?.limit_ticket_resolve_by_agent
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
              class="w-full sm:w-max"
              @switch-tab="activeTabComment = $event.id"
            />
            <ReTextEditor
              v-if="!detail?.is_viewer && activeTabComment !== 'files'"
              class="w-full"
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
        <div class="w-full h-full pb-40">
          <div class="text-sm" style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
            <div class="font-semibold border-t-4 w-full pt-4">
              {{ activeTabComment === 'internal' ? 'Aktivitas' : activeTabComment === 'umum' && !chats.length ? 'Tidak ada chat' : activeTabComment === 'umum' ? 'Chat' : ''}}
            </div>
            <div v-if="activeTabComment === 'internal'" style="background: white; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
              <span class="text-neutral-300 text-sm">Tampilkan:</span>
              <Tab
                styles="text-xs"
                :tabs="tabActivities"
                :active-tab="activeTabActivity"
                @switch-tab="activeTabActivity = $event.id"
              />
            </div>
          </div>
          <div class="w-full mt-4 text-sm">
            <div
              v-if="activeTabComment === 'umum'"
              class="flex flex-col gap-8"
            >
              <TabCommentUmum :chats="chats" />
              <div v-if="chats.length">
                <ButtonPagination
                  v-model="chatPagination.page"
                  :pages="chatPagination.pages"
                  :per-page="chatPagination.perPage"
                  @per-page="chatPagination.perPage = $event"
                />
              </div>
            </div>
            <TabFiles
              v-else-if="activeTabComment === 'files'"
              :id-ticket="idTicket"
            />
            <div
              v-else-if="activeTabActivity === 'internal'"
              class="flex flex-col gap-8"
            >
              <div
                v-for="(chat) in chats"
                :key="chat.id"
                class="space-y-4"
              >
                <div class="space-y-1">
                  <div class="flex flex-col lg:flex-row justify-between items-end lg:items-center font-medium">
                    <div class="flex flex-row gap-2 items-center">
                      <Avatar
                        :avatar="chat.user.avatar"
                        :name="chat.user.name"
                        :size="8"
                      />
                      <h1>
                        {{ chat.user.id === $localUser().id ? 'Anda' : chat.user.name }}
                        <span class="text-neutral-300">
                          menambahkan
                        </span>
                        Komentar
                      </h1>
                    </div>
                    <h1 class="text-neutral-400">
                      {{
                        addDays(new Date(tglToDate(chat.send_date)), 3) >= new Date() ?
                        $distanceDate(tglToDate(chat.send_date), new Date(), { addSuffix: true, locale: $localeId() })
                        : chat.send_date
                      }}
                    </h1>
                  </div>
                  <chatBox
                    class="ml-10"
                    :value="chat.message"
                    :files="chat.image"
                    position="right"
                    class-wrapper="px-2 py-4"
                    reply
                    @reply="onReply(chat.id)"
                  />
                  <div class="flex flex-row justify-end">
                    <ReTextEditor
                      v-if="onReplyInternal && replyId === chat.id"
                      class="w-full"
                      v-model="replyInternal"
                      :inline-image="false"
                      btn-confirm="Kirim Balasan"
                      :disabled-btn="disButton"
                      @upload="fileChat($event)"
                      @cancel-upload="replyFiles.splice($event, 1)"
                      @confirmed="chatting"
                    />
                  </div>
                </div>
                <div class="ml-10 border-l-2 border-stroke pl-4 space-y-4">
                  <template v-if="subChats.length && subChats.find(el => el.idParentChat === chat.id)?.shown">
                    <div
                      v-for="(subChat) in subChats.find(el => el.idParentChat === chat.id)?.result"
                      :key="subChat.id"
                    >
                      <div class="flex flex-row gap-2 font-medium items-center">
                        <Avatar
                          :avatar="subChat.user.avatar"
                          :name="subChat.user.name"
                          :size="8"
                        />
                        <h1>
                          {{ subChat.user.id === $localUser().id ? 'Anda' : subChat.user.name }}
                        </h1>
                      </div>
                      <chatBox
                        class="ml-10"
                        :value="subChat.message"
                        :files="subChat.image"
                        position="right"
                        class-wrapper="px-2 py-4"
                        :time="subChat.send_date"
                      />
                    </div>
                  </template>
                  <div
                    v-if="chat.sub_chat.total_count || subChats.find(el => el.idParentChat === chat.id)?.count"
                    class="w-fit"
                  >
                    <h1
                      v-if="
                        chat.sub_chat.total_count === chat.sub_chat.result.length ||
                        (
                          subChats.find(el => el.idParentChat === chat.id)?.result.length - subChats.find(el => el.idParentChat === chat.id)?.count
                          === subChats.find(el => el.idParentChat === chat.id)?.result.length
                          && subChats.find(el => el.idParentChat === chat.id)?.shown
                        )
                      "
                      class="hover:underline cursor-pointer"
                      @click="subChats.find(el => el.idParentChat === chat.id).shown = false"
                    >
                      Sembunyikan balasan
                    </h1>
                    <h1
                      v-else
                      class="hover:underline cursor-pointer"
                      @click="toggleSubChat(chat.id)"
                    >
                      Tampilkan {{
                        !subChats.length || !subChats.find(el => el.idParentChat === chat.id) ?
                          chat.sub_chat.total_count - chat.sub_chat.result.length :
                          !subChats.find(el => el.idParentChat === chat.id)?.shown ?
                            subChats.find(el => el.idParentChat === chat.id)?.result.length :
                            subChats.find(el => el.idParentChat === chat.id)?.count
                      }} balasan
                    </h1>
                  </div>
                </div>
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
              v-else-if="activeTabActivity === 'log'"
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
        class="shadow p-8 rounded-lg space-y-2 w-[calc(100vw-2.5rem)] lg:w-1/3 relative bg-white"
        :class="activeMobileTab === 'flow' ? 'block' : 'hidden lg:block'"
      >
        <h1 class="font-semibold">
          Alur Tiket
        </h1>
        <div class="p-2.5 pb-40">
          <TimeLine
            :items="flows"
            :user-active="detail?.is_user_flow_active"
            :handled-by="detail?.flow_progress_user"
            :is-can-re-d-s="$localUser().is_passphrase"
            @modal="shownSla = $event"
            @re-ds="onReDS"
          />
        </div>
        <Buttons
          v-if="showButtons"
          class="hidden lg:block"
          :detail="detail"
          :status-ticket="statusTicket"
          @check-info-ticket="checkInfoTicket($event)"
          @reject-ticket="checkInfoTicket('reject')"
        />
      </div>
      <div
        v-if="showButtons"
        class="relative lg:hidden"
      >
        <Buttons
          :detail="detail"
          :status-ticket="statusTicket"
          @check-info-ticket="checkInfoTicket($event)"
          @reject-ticket="checkInfoTicket('reject')"
        />
      </div>
    </div>
    <ModalConfirm
      v-if="shownConfirm"
      v-model="shownConfirm"
      :shown-modal="shownModal"
      :status-ticket="statusTicket"
      :id-ticket="idTicket"
      :cd-ticket="detail.code_ticket"
      :form-request="formRequest"
      :is-flow-tag-incident="isFlowTagIncident"
      :trx-flow-stage-id="activeFlow?.trx_ticket_report_flow_stage_id"
      @success="closeConfirm($event)"
      @closed="shownConfirm = false"
      @signed="onSigned($event)"
    />
    <!--
      :form-info-ticket="formInfoTicket"
      @closed="vuelidate.$reset(), shownConfirm = false"
    -->
    <ModalFormViewer
      v-if="showModalViewer"
      v-model="showModalViewer"
      @close="showModalViewer = false"
      @submitted="onSubmitViewer"
    />
    <ModalDefineSla
      v-if="shownSla"
      v-model="shownSla"
      :id-ticket="idTicket"
      @success="closeConfirm($event)"
    />

    <ModalUpdateProfile
      v-if="showModalNIK"
      v-model="showModalNIK"
      :id-ticket="idTicket"
    />

    <ModalReDS
      v-if="showModalReDS"
      v-model="showModalReDS"
      :cd-ticket="detail.code_ticket"
      :form-request="formRequest"
      :flow-stage-id="flowStageId"
      @signed="onSigned($event)"
      @success="closeConfirm($event)"
    />
  </div>
</template>

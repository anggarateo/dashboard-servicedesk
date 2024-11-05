import { format, formatDistance, formatDuration, intervalToDuration } from 'date-fns' // https://date-fns.org/
import localId from 'date-fns/locale/id'
import { useModal } from 'vue-final-modal'
import ModalPreview from '~/components/ModalPreview.vue'

const filePreview = ref()
const preview = useModal({
  component: ModalPreview,
  attrs: {
    file: filePreview,
    onCloseInfo () {
      preview.close()
    }
  }
})
const { host } = useRequestURL()

export default defineNuxtPlugin((nuxtApp: any) => {
  return {
    provide: {
      checkPermission: (menu: String, action: String) => {
        let result = null
        const user = localStorage.getItem('user')
        if (!user) return
        const localRole = localStorage.getItem('permissions')
        if (!localRole) return
        const role = JSON.parse(localRole)
        if (role.menus) {
          result = role.menus.find(
            (permit: {
              code: String,
              action: String,
              is_active: Boolean
            }) => permit.code === menu && permit.action === action && permit.is_active)
        }
        return result
      },
      copyToClipboard: async (text: string) => {
        return await navigator.clipboard.writeText(text)
          .then(() => {
            nuxtApp.$toast.success('Copied')
          })
          .catch((error) => {
            nuxtApp.$toast.success('Failed to copy: ', error)
          })
      },
      isLoggedIn: async () => {
        const { data: { value } } = await useFetch('/fakeapi/token')
        return value ? true : false
      },
      localUser: () => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null
      },
      formatDate: (date: Date, formatTo: string, options?: Object) => {
        return format(new Date(date), formatTo, options)
      },
      distanceDate: (date: Date, compareDate: Date, options?: Object) => {
        return formatDistance(new Date(date), compareDate, options)
      },
      durationDate (startDate: Date, endDate: Date, options?: Object) {
        return formatDuration(
          intervalToDuration({
            start: new Date(startDate),
            end: new Date(endDate)
          }), options
        )
      },
      localeId () {
        return localId
      },
      onPreviewFile (file: { type: string, path: string }) {
        const fileType = file.type.toLowerCase()
        if (fileType === 'pdf' && nuxtApp.$isMobile()) {
          nuxtApp.$downloadFile(file, nuxtApp.$baseURL() + file.path)
        } else if (
          fileType === 'pdf' ||
          fileType === 'png' ||
          fileType === 'jpg' ||
          fileType === 'jpeg' ||
          fileType === 'gif' ||
          fileType === 'webp' ||
          fileType === 'svg'
        ) {
          filePreview.value = file
          preview.open()
        } else {
          nuxtApp.$downloadFile(file, nuxtApp.$baseURL() + file.path)
        }
      },
      colorLabel (uuidStatusTicket: String) {
        let colors = {
          text: '',
          bg: ''
        }

        switch (uuidStatusTicket) {
          // STATUS_OPEN | tiket baru
          case 'd147c874-f231-4320-b117-e49cc5c999fa':
            colors.text = 'text-success-500'
            colors.bg = 'bg-success-100'
            break;
          //  STATUS_PROGRESS | sedang ditangani
          case '00644976-9ef7-4c20-9e4a-3015052d542b':
            colors.text = 'text-secondary-500'
            colors.bg = 'bg-secondary-100'
            break;
          // STATUS_REJECTED | ditolak
          case '087e9769-591c-4347-84cf-199466e7cdd2':
            colors.text = 'text-error-700'
            colors.bg = 'bg-error-200'
            break;
          // STATUS_RESOLVED | selesai
          case '9109b131-fe03-47bb-8a0c-98d3af7673e0':
            colors.text = 'text-primary-500'
            colors.bg = 'bg-primary-100'
            break;
          // STATUS_CLOSE | tutup
          case '811ac344-de01-491b-a6c3-fae39a3b0539':
            colors.text = 'text-red-500'
            colors.bg = 'bg-red-100'
            break;
          // STATUS_REOPEN | buka kembali
          case '12f8c9b1-718c-443d-af4b-5775316de8da':
            colors.text = 'text-success-700'
            colors.bg = 'bg-neutral-300'
            break;
          // STATUS_REQOPEN | permintaan buka kembali
          case 'fb7010a8-507a-4881-b155-f8bea3e52e9f':
            colors.text = 'text-neutral-500'
            colors.bg = 'bg-stroke'
            break;
          // impact level
          // rendah
          case 'b911049b-e7e9-4f89-b235-7c0d8932ce23':
            colors.text = 'text-success-500'
            colors.bg = 'bg-success-100'
            break;
          // sedang
          case '027fd414-eea4-480f-bd34-acd3a4a1425e':
            colors.text = 'text-secondary-600'
            colors.bg = 'bg-secondary-100'
            break;
          // tinggi
          case 'f7a899b9-d6f2-4f8a-ae4d-8c8e7d0d3224':
            colors.text = 'text-error-500'
            colors.bg = 'bg-error-100'
            break;
          default:
            break;
        }
        return colors
      },
      baseURL () {
        const baseURL = nuxtApp.$config.public.host === 'localhost' || nuxtApp.$config.public.host === '0.0.0.0'
        ? nuxtApp.$config.public.apiBaseUrl.replace('/api', '')
        : host + '/'

        return baseURL
      },
      downloadFile (file: any, fullPath?: string, target?: string) {
        const link = document.createElement('a')
        link.href = fullPath || file.full_path
        link.setAttribute('download', file.filename)
        if (target) link.target = target
        document.body.appendChild(link)
        link.click()
      },
      isMobile () {
        let check = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent)) {
          check = true
        }
      
        return check
      },
      handlePathMedia (path?: string) {
        return path?.replace('//media', '/media')
      }
    }
  }
})

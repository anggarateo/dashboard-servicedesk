<script setup>
import ModalInfo from '@/components/ModalInfo.vue'
import { useModal } from 'vue-final-modal'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

const titleInfo = ref()
const modalChange = useModal({
  component: ModalInfo,
  attrs: {
    title: titleInfo,
    info: true,
    type: 'change',
    onCloseInfo () {
      modalChange.close()
    },
    onCloseAll () {
      modalChange.close()
      closeFullscreen()
    }
  }
})

const emits = defineEmits(['close', 'submit'])

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  detail: {
    type: Object,
    default: null
  }
})

const shown = toRef(props, 'show')
const formChange = ref(false)
const initForm = () => ({
  name: null,
  is_active: true,
  menus: [
    {
      code: null,
      name: null,
      is_active: false,
      is_deleted: false,
      permissions: [
        {
          action: null,
          is_active: false,
          is_deleted: false
        }
      ]
    }
  ]
})

const form = reactive(initForm())
const formMenus = reactive([])
const disButton = ref(false)

watch(() => props.detail, (val) => {
  if (val) {
    form.name = val.name
    formChange.value = true
  } else {
    formChange.value = false
  }
})
watch(() => form.name, (val, oldVal) => {
  if (val && props.detail && val !== props.detail.name) {
    formChange.value = true
  } else if (val && !props.detail) {
    formChange.value = true
  } else {
    formChange.value = false
  }
})
watch(() => shown.value, (val) => {
  if (val) {
    getListMenu()
  }
})

const changeAlert = (title) => {
  titleInfo.value = title
  if (formChange.value) {
    modalChange.open()
  } else {
    closeFullscreen()
  }
}

const closeFullscreen = () => {
  Object.assign(form, initForm())
  v$.value.$reset()
  emits('close')
}

const { $toast, $api } = useNuxtApp()

const getListMenu = async () => {
  let roleId
  props.detail?.id ? roleId = { role_id: props.detail?.id } : roleId = null

  const {
    data,
    pending,
    error
  } = await $api.role.get.getMenu(roleId)

  if (pending.value) disButton.value = pending.value
  if (error.value) $toast.error(error.value.data.message)
  form.menus = data.value?.data?.menus
  if (props.detail?.update || !props.detail) {
    form.menus.map(menu => {
      if (menu) {
        menu.permissions.push({
          action: null,
          is_active: false,
          is_deleted: false
        })
        menu?.children.map(child => {
          if (child) {
            child.permissions.push({
              action: null,
              is_active: false,
              is_deleted: false
            })
          }
          child?.children.map(grandChild => {
            if (grandChild) {
              grandChild.permissions.push({
                action: null,
                is_active: false,
                is_deleted: false
              })
            }
          })
        })
      }
    })
  }
}

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('The role field is required', required)
    }
  }
})

const v$ = useVuelidate(rules, form)

const submit = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    disButton.value = true
    form.menus.forEach(menu => {
      const parent = menu.permissions.filter(el => el.action), child = [], grandChild = []
      if (parent.length) {
        if (menu.children?.length) {
          menu.children?.forEach(submenu => {
            const children = submenu.permissions.filter(el => el.action)
            if (children.length) {
              submenu.children?.forEach(childSubMenu => {
                const grandChildren = childSubMenu.permissions.filter(el => el.action)
                if (grandChildren.length) {
                  grandChild.push({ ...childSubMenu, permissions: grandChildren })
                }
              })
              child.push({ ...submenu, permissions: children, children: grandChild })
            }
          })
          formMenus.push({ ...menu, permissions: parent, children: child })
        } else {
          formMenus.push({ ...menu, permissions: parent})
        }
      }
    })
    form.menus = formMenus
    if (props.detail?.id) Object.assign(form, { role_id: props.detail?.id })

    const {
      data,
      pending,
      error
    } = await $api.role.post.addRoles(form)

    if (data.value) {
      props.detail ? $toast.success('Berhasil mengubah role ' + data.value?.data?.name) : $toast.success('Berhasil menambah role ' + data.value?.data?.name)
      emits('submit')
      closeFullscreen()
    }
    if (pending.value) disButton.value = pending.value
    if (error.value) $toast.error(error.value.data.message)
    disButton.value = false
  } else {
    $toast.warn('pastikan form sudah terisi!')
  }
}

const addEvent = (idParent, idChild, idGrandChild) => {
  let menu, idEvent
  if (idGrandChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu].children[idGrandChild.idMenu]
    idEvent = idGrandChild.idEvent
  } else if (idChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu]
    idEvent = idChild.idEvent
  } else if (idParent?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu]
    idEvent = idParent.idEvent
  }
  
  menu.permissions.push({
    action: null,
    is_active: false,
    is_deleted: false
  })
  menu.permissions[idEvent].is_active = true
  formChange.value = true
}

const activateAct = (idParent, idChild, idGrandChild) => {
  let menu, idEvent
  if (idGrandChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu].children[idGrandChild.idMenu]
    idEvent = idGrandChild.idEvent
  } else if (idChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu]
    idEvent = idChild.idEvent
  } else if (idParent?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu]
    idEvent = idParent.idEvent
  }
  
  menu.permissions[idEvent].is_active = true
  $toast.success(`${menu.permissions[idEvent].action} pada ${menu.name} diaktifkan`)
  formChange.value = true
}
const deactivateAct = (idParent, idChild, idGrandChild) => {
  let menu, idEvent
  if (idGrandChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu].children[idGrandChild.idMenu]
    idEvent = idGrandChild.idEvent
  } else if (idChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu]
    idEvent = idChild.idEvent
  } else if (idParent?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu]
    idEvent = idParent.idEvent
  }
  
  menu.permissions[idEvent].is_active = false
  $toast.warn(`${menu.permissions[idEvent].action} pada ${menu.name} dinonaktifkan`)
  formChange.value = true
}
const deleteAct = (idParent, idChild, idGrandChild) => {
  let menu, idEvent
  if (idGrandChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu].children[idGrandChild.idMenu]
    idEvent = idGrandChild.idEvent
  } else if (idChild?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu].children[idChild.idMenu]
    idEvent = idChild.idEvent
  } else if (idParent?.idMenu >= 0) {
    menu = form.menus[idParent.idMenu]
    idEvent = idParent.idEvent
  }
  
  menu.permissions[idEvent].is_deleted = true
  $toast.warn(`${menu.permissions[idEvent].action} pada ${menu.name} dihapus`)
  formChange.value = true
}

const childShown = ref(false)
const childIdShown = ref()
const showChild = (id) => {
  childShown.value = !childShown.value
  childIdShown.value = id
}
const grandChildShown = ref(false)
const grandChildIdShown = ref()
const showGrandChild = (id) => {
  grandChildShown.value = !grandChildShown.value
  grandChildIdShown.value = id
}
</script>
<template>
  <ModalFullscreen v-model="shown" :title="detail?.update ? 'Ubah Role' : detail ? 'Detail Role' : 'Tambah Role'" :width="7" @close-fullscreen="changeAlert('Keluar tanpa menyimpan?')" @keypress.enter="submit">
    <div v-if="disButton" class="px-14 space-y-6">
      <SKeleton class="w-full h-12 rounded-lg" />
      <div class="flex flex-row gap-4">
        <SKeleton class="w-1/3 h-12 rounded-lg" />
        <SKeleton v-for="i in 4" :key="i" class="w-24 h-12 rounded-lg" />
      </div>
    </div>
    <div v-else class="px-14 space-y-6 overflow-auto pb-40">
      <ReInputText
        v-if="detail?.update || !detail"
        v-model="form.name"
        class="w-full"
        label="Nama Role"
        placeholder="Masukkan nama role"
        :error="v$.name.$error ? v$.name.$errors[0].$message : null"
        @change="v$.name?.$touch"
      />
      <div v-else class="flex flex-row">
        <h1 class="w-1/3">Nama Role</h1>
        <h1 class="font-semibold">
          {{ form.name }}
        </h1>
      </div>
      <div class="flex flex-col gap-2">
        <h1>
          Permissions
        </h1>
        <div v-for="(item, i) in form.menus" :key="i" class="ml-4" :class="{ 'border-l-2': childShown && childIdShown === i }">
          <div class="flex flex-row gap-4 items-center border-b p-2">
            <div class="w-1/3 flex flex-row gap-4">
              <div
                v-if="item.children?.length"
                :title="childIdShown === i && childShown ? 'Sembunyikan submenu' : 'Tampilkan submenu'"
                class="cursor-pointer text-primary/60"
                @click="showChild(i)"
              >
                <Icon
                  :name="childIdShown === i && childShown ? 'ic:baseline-keyboard-arrow-down' : 'grommet-icons:form-next'"
                  size="26"
                />
              </div>
              <h1>
                {{ item.name }}
              </h1>
            </div>
            <div class="flex flex-wrap w-full gap-2">
              <div v-for="(event, j) in item.permissions" :key="j" class="flex flex-row items-center">
                <template v-if="detail?.update || !detail">
                  <div
                    v-if="item.permissions.length === j + 1"
                    class="w-24 relative flex flex-row"
                  >
                    <ReInputText
                      v-model="event.action"
                      placeholder="event"
                      :require="false"
                      @keydown.space.prevent
                    />
                  </div>
                  <div
                    v-else-if="event.action && !event.is_deleted"
                    :title="detail ? `Dobelklik untuk hapus ${event.action} pada ${item.name}` : event.action"
                    class="select-none"
                    :class="{ 'cursor-pointer': detail }"
                    @dblclick="detail ? deleteAct({ idMenu: i, idEvent: j }) : null"
                  >
                    <CLabelText :text="event.action"/>
                  </div>
                  <div
                    v-if="item.permissions.length === j + 1"
                    title="Tambah event"
                    class="cursor-pointer ml-2"
                    @click="event.action ? addEvent({ idMenu: i, idEvent: j}) : $toast.warn('masukkan nama event dahulu!', { position: 'bottom-right' })"
                  >
                    <Icon
                      name="material-symbols:add-circle-outline"
                      size="18"
                      class="text-primary"
                    />
                  </div>
                  <div
                    v-if="event.action && item.permissions.length !== j + 1 && !event.is_deleted"
                    :title="`klik untuk ${event.is_active ? 'nonaktifkan' : 'aktifkan'} ${event.action} pada ${item.name}`"
                    class="cursor-pointer select-none relative"
                    @click="event.is_active ? deactivateAct({ idMenu: i, idEvent: j }) : activateAct({ idMenu: i, idEvent: j })"
                  >
                    <Icon v-if="event.is_active" name="material-symbols:check-circle" class="text-primary absolute -right-1 -top-5" size="18" />
                    <Icon v-else-if="event.action" name="material-symbols:check-circle-outline" class="text-primary absolute -right-1 -top-5" size="18" />
                  </div>
                </template>
                <CLabelText v-else-if="event.is_active" :text="event.action" />
              </div>
            </div>
          </div>
          <template v-if="childShown && childIdShown === i">
            <div v-for="(child, ic) in item.children" :key="ic" class="ml-12" :class="{ 'border-l-2': grandChildIdShown === ic && grandChildShown }">
              <div class="flex flex-row gap-4 items-center border-b p-2">
                <div
                  v-if="child.children?.length"
                  class="cursor-pointer text-primary/60"
                  @click="showGrandChild(ic)"
                >
                  <Icon
                    :name="grandChildIdShown === ic && grandChildShown ? 'ic:baseline-keyboard-arrow-down' : 'grommet-icons:form-next'"
                    size="26"
                  />
                </div>
                <h1 class="w-1/3">
                  {{ child.name }}
                </h1>
                <div class="flex flex-wrap w-full gap-2">
                  <div v-for="(event, iec) in child.permissions" :key="iec" class="flex flex-row items-center">
                    <template v-if="detail?.update || !detail">
                      <div
                        v-if="child.permissions.length === iec + 1"
                        class="w-24 relative flex flex-row"
                      >
                        <ReInputText
                          v-model="event.action"
                          placeholder="event"
                          :require="false"
                        />
                      </div>
                      <div
                        v-else-if="event.action && !event.is_deleted"
                        :title="detail ? `Dobelklik untuk hapus ${event.action} pada ${child.name}` : event.action"
                        class="select-none"
                        :class="{ 'cursor-pointer': detail }"
                        @dblclick="detail ? deleteAct({ idMenu: i }, { idMenu: ic, idEvent: iec }) : null"
                      >
                        <CLabelText :text="event.action"/>
                      </div>
                      <div
                        v-if="child.permissions.length === iec+1"
                        title="Tambah event"
                        class="cursor-pointer ml-2"
                        @click="event.action ? addEvent({ idMenu: i }, { idMenu: ic, idEvent: iec }) : $toast.warn('masukkan nama event dahulu!')"
                      >
                        <Icon
                          name="material-symbols:add-circle-outline"
                          size="18"
                          class="text-primary"
                        />
                      </div>
                      <div
                        v-if="event.action && child.permissions.length !== iec+1 && !event.is_deleted"
                        :title="`klik untuk ${event.is_active ? 'nonaktifkan' : 'aktifkan'} ${event.action} pada ${child.name}`"
                        class="cursor-pointer select-none relative"
                        @click="event.is_active ? deactivateAct({ idMenu: i }, { idMenu: ic, idEvent: iec }) : activateAct({ idMenu: i }, { idMenu: ic, idEvent: iec })"
                      >
                        <Icon v-if="event.is_active" name="material-symbols:check-circle" class="text-primary absolute -right-1 -top-5" size="18" />
                        <Icon v-else-if="event.action" name="material-symbols:check-circle-outline" class="text-primary absolute -right-1 -top-5" size="18" />
                      </div>
                    </template>
                    <CLabelText v-else-if="event.is_active" :text="event.action" />
                  </div>
                </div>
              </div>
              <template v-if="grandChildIdShown === ic && grandChildShown">
                <div v-for="(grandChild, ig) in child.children" :key="ig" class="flex flex-row gap-4 items-center border-b p-2 ml-20">
                  <h1 class="w-1/3">
                    {{ grandChild.name }}
                  </h1>
                  <div class="flex flex-wrap w-full gap-2">
                    <div v-for="(event, ieg) in grandChild.permissions" :key="ieg" class="flex flex-row items-center">
                      <template v-if="detail?.update || !detail">
                        <div
                          v-if="grandChild.permissions.length === ieg + 1"
                          class="w-24 relative flex flex-row"
                        >
                          <ReInputText
                            v-model="event.action"
                            placeholder="event"
                            :require="false"
                          />
                        </div>
                        <div
                          v-else-if="event.action && !event.is_deleted"
                          :title="detail ? `Dobelklik untuk hapus ${event.action} pada ${grandChild.name}` : event.action"
                          class="select-none"
                          :class="{ 'cursor-pointer': detail }"
                          @dblclick="detail ? deleteAct({ idMenu: i }, { idMenu: ic }, { idMenu: ig, idEvent: ieg }) : null"
                        >
                          <CLabelText :text="event.action"/>
                        </div>
                        <div
                          v-if="grandChild.permissions.length === ieg+1"
                          title="Tambah event"
                          class="cursor-pointer ml-2"
                          @click="event.action ? addEvent({ idMenu: i }, { idMenu: ic }, { idMenu: ig, idEvent: ieg }) : $toast.warn('masukkan nama event dahulu!')"
                        >
                          <Icon
                            name="material-symbols:add-circle-outline"
                            size="18"
                            class="text-primary"
                          />
                        </div>
                        <div
                          v-if="event.action && grandChild.permissions.length !== ieg+1 && !event.is_deleted"
                          :title="`klik untuk ${event.is_active ? 'nonaktifkan' : 'aktifkan'} ${event.action} pada ${grandChild.name}`"
                          class="cursor-pointer select-none relative"
                          @click="event.is_active ? deactivateAct({ idMenu: i }, { idMenu: ic }, { idMenu: ig, idEvent: ieg }) : activateAct({ idMenu: i }, { idMenu: ic }, { idMenu: ig, idEvent: ieg })"
                        >
                          <Icon v-if="event.is_active" name="material-symbols:check-circle" class="text-primary absolute -right-1 -top-5" size="18" />
                          <Icon v-else-if="event.action" name="material-symbols:check-circle-outline" class="text-primary absolute -right-1 -top-5" size="18" />
                        </div>
                      </template>
                      <CLabelText v-else-if="event.is_active" :text="event.action" />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <template v-if="detail?.update || !detail" #footer>
      <div class="flex flex-row gap-3 w-full">
        <CButton v-if="detail" class="w-full" text="Batal" type="outlined" @click="changeAlert('Batalkan perubahan?')" />
        <CButton class="w-full" text="Simpan" :loading="disButton" @click="submit()" />
      </div>
    </template>
  </ModalFullscreen>
</template>

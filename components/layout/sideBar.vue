<template>
  <div>
    <!-- Mobile -->
    <div v-if="showNav" class="w-full flex fixed z-[999] top-0 h-screen block lg:hidden backdrop-blur-[2px] bg-neutral-300/50">
      <div class="flex flex-col items-center w-max h-full text-indigo-300 bg-primary-500 shadow-2xl rounded-br-xl rounded-tr-2xl relative">
        <div
          class="block lg:hidden absolute right-5 top-5"
          @click="showNav = false"
        >
          <Icon
            name="material-symbols:close"
            class="text-white cursor-pointer hover:text-stroke text-2xl"
          />
        </div>
        <img src="/3(9)1.png" alt="Logo B-CARE" class="py-3">
        <div class="w-full px-2 overflow-auto">
          <div v-for="(items, indexs) in nav" :key="indexs" class="flex flex-col items-center w-full">
            <div v-for="(item, index) in items" :key="index" class="w-full h-full">
              <NuxtLink
                v-if="item?.name === 'Dashboard' || $checkPermission(item?.code, 'view_all') || $checkPermission(item?.code, 'view')"
                class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-secondary-500/50"
                :class="item?._tag==='CSidebarNavItem' ? routePath(item) : null"
                :to="item?._tag==='CSidebarNavItem'?item?.to:'#'"
                @click.prevent="item?._children?eventShowChilds(indexs,item):null"
              >
                <Icon :name="item?.icon" color="white" size="22" />
                <span class=" w-full ml-2 text-sm font-medium text-white">{{ item?.name }}</span>
                <span v-if="item?._children" class="flex flex-col items-end">
                  <Icon v-if="!item.show" name="bytesize:chevron-bottom" color="white" size="12" />
                  <Icon v-if="item.show" name="bytesize:chevron-top" color="white" size="12" />
                </span>
              </NuxtLink>
              <ul v-if="item?._children" v-show="item.show">
                <li v-for="(childs, i) in item?._children" :key="i" class="ml-4">
                  <NuxtLink
                    v-if="$checkPermission(childs?.code, 'view_all') || $checkPermission(childs?.code, 'view')"
                    class="flex items-center w-full h-10 px-3 rounded hover:bg-secondary-500/50"
                    :class="childs._tag==='CSidebarNavItem' ? routePath(childs) : null"
                    :to="childs._tag==='CSidebarNavItem'?childs.to:'#'"
                    @click.prevent="childs._children?showChild(indexs,index,childs):null"
                  >
                    <span class="ml-2 w-full text-sm font-medium text-white">{{ childs.name }}</span>
                    <span v-if="childs._children" class="flex flex-col items-end">
                      <Icon v-if="!childs.show" name="bytesize:chevron-bottom" color="white" size="12" />
                      <Icon v-if="childs.show" name="bytesize:chevron-top" color="white" size="12" />
                    </span>
                  </NuxtLink>
                  <ul v-if="childs?._children" v-show="childs?.show">
                    <li v-for="(child, idx) in childs?._children" :key="idx" class="ml-4">
                      <NuxtLink
                        v-if="$checkPermission(child?.code, 'view_all') || $checkPermission(child?.code, 'view')"
                        class="flex items-center w-full h-10 px-3 rounded hover:bg-secondary-500/50"
                        :class="routePath(child)"
                        :to="child.to"
                      >
                        <span class="ml-2 text-sm font-medium text-white">{{ child.name }}</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-full absolute z-[-1]" @click="showNav = false" />
    </div>
    <!-- Mobile -->

    <div class="w-full sticky z-[999] top-0 h-screen hidden lg:block">
      <div class="flex flex-col items-center w-max h-full text-indigo-300 bg-primary-500 shadow rounded-br-xl rounded-tr-2xl relative">
        <div
          class="block lg:hidden absolute right-5 top-5"
          @click="showNav = false"
        >
          <Icon
            name="material-symbols:close"
            class="text-white cursor-pointer hover:text-stroke text-2xl"
          />
        </div>
        <img src="/3(9)1.png" alt="Logo B-CARE" class="py-3">
        <div class="w-full px-2 overflow-auto">
          <div v-for="(items, indexs) in nav" :key="indexs" class="flex flex-col items-center w-full">
            <div v-for="(item, index) in items" :key="index" class="w-full h-full">
              <NuxtLink
                v-if="item?.name === 'Dashboard' || $checkPermission(item?.code, 'view_all') || $checkPermission(item?.code, 'view')"
                class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-secondary-500/50"
                :class="item?._tag==='CSidebarNavItem' ? routePath(item) : null"
                :to="item?._tag==='CSidebarNavItem'?item?.to:'#'"
                @click.prevent="item?._children?eventShowChilds(indexs,item):null"
              >
                <Icon :name="item?.icon" color="white" size="22" />
                <span class=" w-full ml-2 text-sm font-medium text-white">{{ item?.name }}</span>
                <span v-if="item?._children" class="flex flex-col items-end">
                  <Icon v-if="!item.show" name="bytesize:chevron-bottom" color="white" size="12" />
                  <Icon v-if="item.show" name="bytesize:chevron-top" color="white" size="12" />
                </span>
              </NuxtLink>
              <ul v-if="item?._children" v-show="item.show">
                <li v-for="(childs, i) in item?._children" :key="i" class="ml-4">
                  <NuxtLink
                    v-if="$checkPermission(childs?.code, 'view_all') || $checkPermission(childs?.code, 'view')"
                    class="flex items-center w-full h-10 px-3 rounded hover:bg-secondary-500/50"
                    :class="childs._tag==='CSidebarNavItem' ? routePath(childs) : null"
                    :to="childs._tag==='CSidebarNavItem'?childs.to:'#'"
                    @click.prevent="childs._children?showChild(indexs,index,childs):null"
                  >
                    <span class="ml-2 w-full text-sm font-medium text-white">{{ childs.name }}</span>
                    <span v-if="childs._children" class="flex flex-col items-end">
                      <Icon v-if="!childs.show" name="bytesize:chevron-bottom" color="white" size="12" />
                      <Icon v-if="childs.show" name="bytesize:chevron-top" color="white" size="12" />
                    </span>
                  </NuxtLink>
                  <ul v-if="childs?._children" v-show="childs?.show">
                    <li v-for="(child, idx) in childs?._children" :key="idx" class="ml-4">
                      <NuxtLink
                        v-if="$checkPermission(child?.code, 'view_all') || $checkPermission(child?.code, 'view')"
                        class="flex items-center w-full h-10 px-3 rounded hover:bg-secondary-500/50"
                        :class="routePath(child)"
                        :to="child.to"
                      >
                        <span class="ml-2 text-sm font-medium text-white">{{ child.name }}</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import _nav from '../../constants/_nav.js'

const nav = ref(_nav)
const showNav = ref(false)
const emit = defineEmits(['menu'])
const route = useRoute()

const { $mitt } = useNuxtApp()

$mitt.on('show-nav', () => {
  showNav.value = true
})

const routePath = (value) => {
  let classes
  if (route.path.includes(value.to)) {
    emit('menu', value.name)
    classes = ' bg-secondary text-white'
  } else {
    classes = 'hover:bg-secondary'
  }
  return classes
}

const eventShowChilds = (i, value) => {
  const itemNav = []
  const findNav = nav.value[i].filter(item => item.to === value.to)
  nav.value[i].map(item =>
    itemNav.push({
      _tag: item._tag,
      name: item.name,
      to: item.to,
      icon: item.icon,
      show: findNav.length > 0 && item._tag === 'CSidebarNavDropdown' && (item.show === null || item.show === undefined) ? true : !item.show,
      _children: item._children,
      code: item.code
    })
  )
  nav.value[i] = itemNav
}

const showChild = (i, idx, value) => {
  const itemNav = []
  const itemNavSub = []
  const findNav = nav.value[i][idx]._children.filter(itm => itm.to === value.to)
  // eslint-disable-next-line array-callback-return
  nav.value[i].map((item, index) => {
    if (index === idx && item._tag === 'CSidebarNavDropdown') {
      item._children?.map(data =>
        itemNavSub.push({
          _tag: data._tag,
          name: data.name,
          to: data.to,
          show: findNav.length > 0 && (data.show === null || data.show === undefined) ? true : !data.show,
          _children: data._children,
          code: data.code
        })
      )
    }
  })
  nav.value[i].map(item =>
    itemNav.push({
      _tag: item._tag,
      name: item.name,
      to: item.to,
      icon: item.icon,
      show: item.show,
      _children: item._children ? itemNavSub : null,
      code: item.code
    })
  )
  nav.value[i] = itemNav
}

const setnav = () => {
  showNav.value = !showNav.value
}

</script>

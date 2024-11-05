<script setup>
import ReTextEditorMenuItem from './ReTextEditorMenuItem.vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

const items = ref([
  {
    icon: 'align-left',
    title: 'Align Left',
    action: () => props.editor.chain().focus().setTextAlign('left').run(),
    isActive: () => props.editor.isActive({ textAlign: 'left' })
  },
  {
    icon: 'align-center',
    title: 'Align Center',
    action: () => props.editor.chain().focus().setTextAlign('center').run(),
    isActive: () => props.editor.isActive({ textAlign: 'center' })
  },
  {
    icon: 'align-right',
    title: 'Align Right',
    action: () => props.editor.chain().focus().setTextAlign('right').run(),
    isActive: () => props.editor.isActive({ textAlign: 'right' })
  },
  {
    icon: 'align-justify',
    title: 'Align Justify',
    action: () => props.editor.chain().focus().setTextAlign('justify').run(),
    isActive: () => props.editor.isActive({ textAlign: 'justify' })
  },
  {
    type: 'divider'
  },
  {
    icon: 'list-unordered',
    title: 'Bullet List',
    action: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive('bulletList')
  },
  {
    icon: 'list-ordered',
    title: 'Ordered List',
    action: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive('orderedList')
  },
  {
    type: 'divider'
  },
  {
    icon: 'bold',
    title: 'Bold',
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold')
  },
  {
    icon: 'italic',
    title: 'Italic',
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic')
  },
  {
    icon: 'underline',
    title: 'Underline',
    action: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: () => props.editor.isActive('underline')
  },
  {
    icon: 'font-size',
    title: 'Font Size',
    action: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => props.editor.isActive('heading', { level: 1 })
  }
])

</script>

<template>
  <div>
    <template v-for="(item, index) in items">
      <div v-if="item.type === 'divider'" :key="`divider${index}`" class="divider" />
      <ReTextEditorMenuItem v-else :key="index" v-bind="item" />
    </template>
    <div class="ml-auto">
      <slot name="btn" />
    </div>
  </div>
</template>

<style>
.divider {
  background-color: rgb(199, 199, 199);
  height: 1.25rem;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
  width: 1px;
}
</style>

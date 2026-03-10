<template>
  <VueFinalModal
    class="flex items-end justify-start bg-transparent"
    content-class="mb-4 ml-4 bg-gray-800 rounded p-4 shadow"
  >
    <form class="mb-2 flex gap-2">
      <textarea v-model="insertedNote" class="bg-sky-100"></textarea>
    </form>

    <button @click="submit" class="text-amber-50">Ok</button>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { onBeforeMount, ref, type Ref } from 'vue';
const emit = defineEmits(['resolve']);
const insertedNote: Ref<string | undefined> = ref(undefined);
const props = defineProps<{
  note?: string;
}>();

onBeforeMount(() => {
  insertedNote.value = props.note;
});

function submit() {
  emit('resolve', insertedNote.value);
}
</script>

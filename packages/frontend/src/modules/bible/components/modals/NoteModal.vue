<template>
  <VueFinalModal
    class="flex items-center justify-center bg-transparent"
    content-class="mb-4 ml-4 bg-secondary rounded p-4 shadow"
  >
    <form class="mb-2 flex gap-2">
      <textarea
        width="100px"
        height="100px"
        v-model="insertedNote"
        class="bg-sky-100"
      ></textarea>
    </form>

    <button
      @click="submit"
      class="bg-primary cursor-pointer rounded p-1 px-3 text-xl text-amber-50 hover:border-slate-950"
    >
      Ok
    </button>
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

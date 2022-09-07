<script setup lang="ts">
import { use8baseStorage } from "@/composables";
import { useBase64, useDropZone } from "@vueuse/core";
import { computed, ref } from "vue";

const props = defineProps<{
  image?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "upload", payload: { id: string }): void;
}>();

const image = ref<string | File | null | undefined>(props.image);
const dropZoneRef = ref<HTMLDivElement>();
const uploadingToFileStack = ref<boolean>(false);

//@ts-expect-error is checked in src for string type
const { base64 } = useBase64(image);
const src = computed(() => {
  return typeof image.value === "string" ? image.value : base64.value;
});

const onDrop = (files: File[] | null) => {
  handleFiles(files);
};
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

const onFileSelect = (e: Event) => {
  const inputFile = e.target as HTMLInputElement;
  handleFiles(inputFile.files);
};

const { uploadAsset } = use8baseStorage();
const handleFiles = async (files: FileList | File[] | null) => {
  if (!files) return;
  image.value = files[0];
  uploadingToFileStack.value = true;

  const result = await uploadAsset(files[0]);
  emit("upload", result?.data.fileCreate);

  uploadingToFileStack.value = false;
};
</script>

<script lang="ts">
export default {
  name: "AppImageDropZone",
};
</script>

<template>
  <div
    class="dropZone"
    :class="{
      'border-blue-200': isOverDropZone,
      'border-gray-100': !isOverDropZone,
    }"
    ref="dropZoneRef"
  >
    <label>
      <input
        accept="image/png, image/jpeg"
        class="hidden"
        type="file"
        @change="onFileSelect"
      />
    </label>
    <AppImage v-if="image" :src="src" />
    <template v-else>{{ "Click or drop to upload an image" }}</template>
    <AppLoader v-if="loading || uploadingToFileStack" :overlay="true" />
  </div>
</template>

<style scoped>
.dropZone {
  width: 300px;
  height: 200px;
  @apply bg-gray-100 p-2 flex justify-center items-center border-2 relative;
}

label {
  @apply absolute top-0 left-0 right-0 bottom-0 block;
}
</style>

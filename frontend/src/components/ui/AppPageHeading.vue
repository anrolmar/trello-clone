<script lang="ts" setup>
import { computed, nextTick, ref, toRefs, watch } from "vue";

const props = defineProps<{
  heading: string;
  title: string;
}>();

const emit = defineEmits<{
  (e: "update", value: string): void;
}>();

const { title } = toRefs(props);

const titleInput = ref<HTMLInputElement | null>(null);
const titleInputVisible = ref<boolean>(false);
const titleInputValue = ref<string>(title.value || "");
const titleValue = computed(() => titleInputValue.value || "");

watch(title, (newValue) => (titleInputValue.value = newValue));

const classTitle = computed(() => (props.heading === "h1" ? "text-3xl" : ""));

const updateTitle = () => {
  titleInputVisible.value = true;
  nextTick(() => titleInput.value?.focus());
};

const handleEnter = () => {
  emit("update", titleInputValue.value);
  titleInputVisible.value = false;
};

const handleCancel = () => {
  title.value = props.title || "";
  titleInputVisible.value = false;
};
</script>

<template>
  <div class="w-full" v-if="!titleInputVisible" @click="updateTitle">
    <h1 v-if="heading === 'h1'" class="text-3xl mb-5">
      {{ titleValue }}
    </h1>
    <h2 v-else>{{ titleValue }}</h2>
  </div>
  <input
    v-else
    type="text"
    ref="titleInput"
    class="mr-5 mb-5 w-full"
    :class="classTitle"
    v-model="titleInputValue"
    @keypress.enter="handleEnter"
    @keydown.esc="handleCancel"
    @blur="handleCancel"
  />
</template>

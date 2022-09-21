<script lang="ts" setup>
import { Input as KInput } from "@progress/kendo-vue-inputs";
import { nextTick, ref } from "vue";

const taskInput = ref<HTMLInputElement | null>(null);
const taskValue = ref<string>("");
const taskInputVisible = ref<boolean>(false);

const emit = defineEmits<{
  (e: "addTask", value: string): void;
}>();

const createTask = () => {
  taskInputVisible.value = true;
  nextTick(() => taskInput.value?.focus());
};

const handleEnter = () => {
  emit("addTask", taskValue.value);
  taskInputVisible.value = false;
};

const handleCancel = () => {
  taskValue.value = "";
  taskInputVisible.value = false;
};
</script>

<template>
  <AppButton v-if="!taskInputVisible" :fill-mode="'flat'" @click="createTask">
    <span class="k-icon k-i-plus"></span> Create task
  </AppButton>
  <KInput
    v-else
    type="text"
    ref="taskInput"
    v-model="taskValue"
    @keypress.enter="handleEnter"
    @keydown.esc="handleCancel"
    @blur="handleCancel"
  ></KInput>
</template>

<style scoped>
button {
  @apply text-left items-start justify-start;
}
</style>

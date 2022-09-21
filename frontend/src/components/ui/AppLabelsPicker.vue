<script setup lang="ts">
import type { Label } from "@/types";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Input as KInput } from "@progress/kendo-vue-inputs";
import { ref, watch } from "vue";

const props = defineProps<{
  labels: Partial<Label>[];
  selected: Partial<Label>[];
}>();

const emit = defineEmits<{
  (e: "select", payload: Partial<Label>): void;
  (e: "deselect", payload: Partial<Label>): void;
  (e: "create", payload: Partial<Label>): void;
  (e: "delete", payload: Partial<Label>): void;
  (e: "update", payload: Partial<Label>): void;
}>();

const labels = ref<Partial<Label>[]>(props.labels);
const selected = ref<Partial<Label>[]>(props.selected);

const showCreate = ref(false);
const newLabel = ref<Partial<Label>>({
  label: "",
  color: "red",
});

const clone = (object: Record<string, any>) =>
  JSON.parse(JSON.stringify(object));

const handleCreate = () => {
  const label = { ...newLabel.value };
  emit("create", clone(label));
  showCreate.value = false;
  resetNewLabel();
};

const handleUpdate = (labelText: string, index: number) => {
  labels.value = labels.value.map((label, labelIndex) => {
    if (labelIndex === index) return { ...label, label: labelText };
    return label;
  });

  emit("update", clone(labels.value[index]));
};

const handleDelete = (label: Partial<Label>) => {
  labels.value = labels.value?.filter((l) => l.id !== label.id);
  emit("delete", clone(label));
};

const handleToggle = (label: Partial<Label>) => {
  if (selected.value?.map((l) => l.id).includes(label.id)) {
    selected.value = selected.value.filter((l) => l.id !== label.id);
    emit("deselect", label);
  } else {
    selected.value = [...selected.value, label];
    emit("select", label);
  }
};

const resetNewLabel = () => {
  newLabel.value.label = "";
  newLabel.value.color = "red";
};

watch(
  () => props.labels,
  () => {
    labels.value = props.labels;
  }
);

watch(
  () => props.selected,
  () => {
    selected.value = props.selected;
  }
);
</script>
<template>
  <div>
    <div
      v-for="(label, index) in labels"
      :key="index"
      :class="`bg-${label.color}-500`"
      class="board-labels"
    >
      <div class="flex items-center w-full">
        <span
          @click.prevent="handleToggle(label)"
          class="w-4 h-4 mr-2 cursor-pointer"
          :class="
            selected?.map((s) => s.id).includes(label.id)
              ? `k-icon k-i-check`
              : ''
          "
        ></span>
        <input
          class="w-3/4 bg-transparent outline-none"
          type="text"
          :value="label.label"
          @change="
            handleUpdate(($event.target as HTMLInputElement).value, index),
              ($event.target as HTMLInputElement).blur()
          "
        />
      </div>
      <button
        class="k-icon k-i-trash"
        @click.prevent="handleDelete(label)"
      ></button>
    </div>
    <div>
      <button class="p-2" @click="showCreate = !showCreate">
        + Create Label
      </button>
      <div v-if="showCreate">
        <label class="block">
          Label
          <KInput :style="{ width: '230px' }" v-model="newLabel.label"></KInput>
        </label>
        <label class="block">
          Color
          <AppColorInput v-model="newLabel.color" />
        </label>
        <KButton @click="handleCreate" class="block mt-3" theme-color="primary"
          >Create</KButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-labels {
  @apply p-2 rounded text-white my-1 flex justify-between w-full;
}
</style>

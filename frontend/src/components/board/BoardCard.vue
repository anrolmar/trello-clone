<script setup lang="ts">
import type { Board } from "@/types";
import {
  Card as KCard,
  CardTitle as KCardTitle,
} from "@progress/kendo-vue-layout";
import { useRouter } from "vue-router";

const props = defineProps<{
  board: Board;
}>();

const router = useRouter();
const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

const onBoardClick = () => router.push(`/boards/${props.board.id}`);
</script>

<script lang="ts">
export default {
  name: "BoardCard",
};
</script>

<template>
  <KCard class="card" @click="onBoardClick">
    <AppImage
      v-if="board.image"
      class="image"
      :src="board.image?.downloadUrl"
    />
    <div v-else class="image" :style="{ backgroundColor: randomColor }" />
    <KCardTitle class="card-title">{{ board.title }}</KCardTitle>
  </KCard>
</template>

<style scoped>
.card {
  @apply m-5 cursor-pointer;
  max-width: 400px;
}

.card .image {
  @apply aspect-video;
  width: 100%;
  height: 200px;
}

.card-title {
  @apply m-2;
}

.card-title span {
  @apply text-gray-700 text-xl;
}
</style>

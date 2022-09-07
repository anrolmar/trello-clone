<script lang="ts" setup>
import { computed, toRefs } from "vue";

const props = defineProps<{
  src: string;
}>();

const { src } = toRefs(props);

const toTwicpicsURL = (url: string) =>
  url.replace("https://cdn.filestackcontent.com/", "");
const twicpicsURL = computed(() => toTwicpicsURL(src.value));
</script>

<template>
  <img v-if="src.startsWith('data:')" :src="src" />
  <TwicImg v-else :src="twicpicsURL" ratio="none" class="h-full w-full" />
</template>

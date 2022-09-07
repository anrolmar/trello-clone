<script setup lang="ts">
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import { ref } from "vue";

const show = ref<boolean>(false);
const showTeams = () => (show.value = !show.value);
</script>

<template>
  <div class="p-5 border-solid border-b">
    <div class="flex">
      <img
        class="block w-40"
        src="https://vuejsforge.com/images/logo.svg"
        alt="Vue.js Forge"
      />
      <div class="flex w-full justify-end">
        <AppButton
          class="my-team"
          :fill-mode="'flat'"
          ref="my-team"
          @click="showTeams"
        >
          <span class="k-icon k-i-ungroup"></span>
          My Team
        </AppButton>
        <AppButton class="logout" :theme-color="'secondary'">Logout</AppButton>
        <KPopup :anchor="'my-team'" :show="show" class="mt-5 cursor-pointer">
          <ul>
            <li class="px-5 py-2" @click="showTeams">Team 1</li>
            <li class="px-5 py-2" @click="showTeams">Team 2</li>
          </ul>
        </KPopup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-team {
  color: orangered;
}

.logout {
  @apply ml-3;
}
</style>

<script setup lang="ts">
import { useAuthUserStore } from "@/stores";

const auth = useAuthUserStore();
auth.login();
</script>

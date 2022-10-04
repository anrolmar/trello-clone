<script lang="ts" setup>
import { useAuthUserStore } from "@/stores";

const auth = useAuthUserStore();
auth.logout();
</script>

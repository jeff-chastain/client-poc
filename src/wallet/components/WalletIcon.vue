<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { Wallet } from "@/wallet/createWalletStore";

export default defineComponent({
  props: {
    wallet: Object as PropType<Wallet>,
  },
  setup(props) {
    return toRefs(props);
  },
});
</script>

<template>
  <i class="swv-button-icon">
    <img v-if="wallet" :src="wallet.icon" :alt="`${wallet.name} icon`" />
  </i>
</template>

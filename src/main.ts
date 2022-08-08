import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment'

const app = createApp(App)

app.config.globalProperties.$filters = {
  formatDate( value: Date ) {
    return moment( String(value) ).utc().format('MM/DD/YYYY hh:mm')
  }
}

/* -------------------------------------------------- */
/* vue router store creation */

import router from './router'
app.use( router )


/* -------------------------------------------------- */
/* pinia store creation */

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use( piniaPluginPersistedstate )

app.use( pinia )


/* -------------------------------------------------- */
/* solana wallet creation */

import SolanaWallets, { initWallet } from 'solana-wallets-vue';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import 'solana-wallets-vue/styles.css';

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
}

import { useWallet } from 'solana-wallets-vue';
initWallet( walletOptions );

const { publicKey } = useWallet();

app.use( SolanaWallets, walletOptions )


/* -------------------------------------------------- */
/* all done, let's roll ... */

app.mount('#app')
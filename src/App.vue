<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">ecoWarriors</router-link>
      <div class="navbar-nav mr-auto">
        <li v-if="this.isLoggedIn" class="nav-item">
          <router-link to="/user" class="nav-link">User Management</router-link>
        </li>
      </div>
      <div v-if="this.isLoggedIn">
        <router-link to="/login" class="nav-link">Log Out</router-link>
      </div>
      <div v-if="!this.isLoggedIn">
        <router-link to="/login" class="nav-link">Log In</router-link>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
  import 'solana-wallets-vue/styles.css';
  import { useSecurityStore } from "@/stores/security";

  export default {
    name: "app",
    setup() {
      const { isLoggedIn } = useSecurityStore()

      return {
        isLoggedIn
      }
    }
  };

</script>
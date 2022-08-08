<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card card-container">
        <div class="card-header">
          <h5 class="card-title">Profile: <strong>{{user.firstName}} {{user.lastName}} ({{user.username}})</strong></h5>
        </div>
        <div class="card-body">
          <p>
            <strong>Author Id:</strong>
            {{user.authorID}}
          </p>
          <p>
            <strong>Email:</strong>
            {{user.email}}
          </p>
        </div>
      </div>
    </div>
  </div>
  <br/>
  <!-- TODO:
  <div class="row">
    <div class="col-md-12">
      <div class="card card-container">
        <div class="card-header">
          <h5 class="card-title">Associated Wallets ({{this.user.wallets.length}})</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Wallet</th>
                  <th scope="col">Key</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="wallet in this.user.wallets" :key="wallet.id" >
                  <td>{{ wallet.wallet.name }}<br/><em>{{ wallet.wallet.description }}</em></td>
                  <td>{{ wallet.publicKey }}</td>
                  <td>{{ wallet.wallet.balance }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br/>
  <div class="row">
    <div class="col-md-12">
      <div class="card card-container">
        <div class="card-header">
          <h5 class="card-title">User Preferences</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Setting</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="preference in this.user.preferences" :key="preference.id" >
                  <td>{{ preference.setting }}</td>
                  <td>{{ preference.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  -->
</template>

<script>

  import { storeToRefs } from 'pinia'
  import { useSecurityStore } from "@/stores/security";

  export default {
    name: "application-dashboard",

    setup() {
      const { user, token, loading, error } = storeToRefs( useSecurityStore() )

      return {
        user, 
        token,
        loading,
        error,
      }
    }
  }

</script>

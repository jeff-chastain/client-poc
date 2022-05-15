import { acceptHMRUpdate, defineStore } from 'pinia'
import { AxiosRequestHeaders, AxiosResponse } from "axios";

import http from "@/http-common"
import { number } from 'yup'

import { UserProfile } from "@/models/user/user.profile";
import { Wallet } from '@/wallet';

export type SecurityState = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

export const useSecurityStore = defineStore( 'security', {

  state: (): SecurityState => ({
    user: null,
    token: "",
    loading: false,
    error: ""
  }),
  persist: true,

  getters: {
    isLoggedIn: (state) => {
      return ( state.user === null ) ? false : ( !!state.token );
    },
    getAuthHeader( state ): AxiosRequestHeaders {
      if( state.token !== null ){
        return { 'x-auth-token': state.token };
      }
      return {}
    }
  },

  actions: {

    async authenticateUser( username: string, password: string ) {
      this.user = null;
      this.token = null;
      this.loading = true;

      try {

        await http.post( `/api/login`, {
            username: username,
            password: password
          })
          .then( response => {
            // capture the JWT token from the response
            this.token = this.handleResponse( response ).data;

            // retrieve the user's profile
            http.get( `/api/user`, {
              headers: this.getAuthHeader,
              params: {
                username: username
              }
            })
            .then( response => {
              // capture the user's profile
              this.user = this.handleResponse( response ).data[0];

              // capture the user's preferences
              http.get( `/api/user/${this.user!.id}/preference`, {
                headers: this.getAuthHeader
              })
              .then( response => {
                this.user!.preferences = this.handleResponse( response ).data;
              })
  
              // capture the user's wallets
              http.get( `/api/user/${this.user!.id}/wallet`, {
                headers: this.getAuthHeader
              })
              .then( response => {
                this.user!.wallets = this.handleResponse( response ).data;

                // this arguably could (should) be done on the API side, but is included here for demonstration purposes ...
                this.user!.wallets!.forEach(( wallet ) => {
                  http.get( `/api/solana/account/balance/${wallet.publicKey}`, {
                    headers: this.getAuthHeader
                  })
                  .then( response => {
                    wallet.wallet.balance = this.handleResponse( response ).data.value;
                  })
                });
              })
  
              this.loading = false
            })

          })

      } catch( error ) {
        console.log( error );
        //this.error = error
      }
    },

    logout() {
      // remove the user and token from the store
      this.user = null;
      this.token = null;
    },
    
    handleResponse( response: AxiosResponse ) {

      const data = response.data;

      if( response.statusText !== "OK" ) {
        if ( response.status === 401 ){
          this.logout();
          location.reload();
        }

        const error = ( data && data.message ) || response.statusText;
        return Promise.reject( error );

      }

      return data;

    }

  }

})
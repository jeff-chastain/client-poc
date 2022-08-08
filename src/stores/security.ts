import { acceptHMRUpdate, defineStore } from 'pinia'
import { AxiosRequestHeaders, AxiosResponse } from "axios";

import http from "@/http-common"
import { number } from 'yup'

import { UserProfile } from "@/models/user/user.profile";
import { Wallet } from '@/wallet';

export type SecurityState = {
  user: UserProfile | null;
  access_token: string | null;
  refresh_token: string | null;
  loading: boolean;
  error: string | null;
};

export const useSecurityStore = defineStore( 'security', {

  state: (): SecurityState => ({
    user: null,
    access_token: "",
    refresh_token: "",
    loading: false,
    error: ""
  }),
  persist: true,

  getters: {
    isLoggedIn: (state) => {
      return ( state.user === null ) ? false : ( !!state.access_token );
    },
    getAuthHeader( state ): AxiosRequestHeaders {
      if( state.access_token !== null ){
        return { 'x-auth-token': state.access_token };
      }
      return {}
    }
  },

  actions: {

    async authenticateUser( username: string, password: string ) {
      this.user = null;
      this.access_token = null;
      this.refresh_token = null;
      this.loading = true;

      try {

        await http.post( `/v1/login`, {
            username: username,
            password: password
          })
          .then( response => {
            // capture the JWT token from the response
            this.access_token = this.handleResponse( response ).data.tokens.access_token;
            this.refresh_token = this.handleResponse( response ).data.tokens.refresh_token;

            // retrieve the user's profile
            http.get( `/v1/whoami`, {
              headers: this.getAuthHeader,
            })
            .then( response => {

              const responseData = this.handleResponse( response ).data;

              // capture the user's profile
              this.user = responseData;

              // the user's preferences come through as a JSON string, need to parse that and make it usable
              this.user!.preferences = JSON.parse( responseData.preferences );
  
              // capture the user's wallets
              /*
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
              */
  
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
      this.access_token = null;
      this.refresh_token = null;
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
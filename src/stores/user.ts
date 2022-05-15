import { acceptHMRUpdate, defineStore } from 'pinia'
import { useSecurityStore } from "@/stores/security";
const { logout, getAuthHeader } = useSecurityStore();

import { AxiosResponse } from "axios";
import http from "@/http-common"

import { number } from 'yup'

import { UserProfile } from "@/models/user/user.profile";
import { UserSearchFilter } from "@/models/user/user.searchFilter";

export type UserState = {
  users: UserProfile[] | null;
  currentUser: UserProfile | null;
  loading: boolean;
  error: string | null;
};

export const useUserStore = defineStore( 'user', {

  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: ""
  }),
  persist: true,

  getters: {},

  actions: {

    async fetchUsers( criteria: UserSearchFilter ) {
      this.users = [];
      this.loading = true;

      try {

        await http.get( `/api/user`, {
            headers: getAuthHeader,
            params: criteria
          })
          .then( response => {
            this.users = this.handleResponse( response ).data;
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    async fetchUser( id: number, preferences?: boolean, wallets?: boolean ) {
      this.currentUser = null;
      this.loading = true;

      try {

        await http.get( `/api/user/${id}`, {
            headers: getAuthHeader
          })
          .then( response => {
            this.currentUser = this.handleResponse( response ).data;

            // load the user preferences if requested
            if( preferences != null ) {
              this.fetchUserPreferences( id );
            }

            // load the user wallets if requested
            if( preferences != null ) {
              this.fetchUserWallets( id );
            }
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    async fetchUserPreferences( id: number ) {
      this.loading = true;

      try {

        if( this.currentUser == null ){
          this.fetchUser( id );
        }

        await http.get( `/api/user/${id}/preference`, {
            headers: getAuthHeader
          })
          .then( response => {
            this.currentUser!.preferences = this.handleResponse( response ).data;
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    async fetchUserWallets( id: number ) {
      this.loading = true;

      try {

        if( this.currentUser == null ){
          this.fetchUser( id );
        }

        await http.get( `/api/user/${id}/wallet`, {
            headers: getAuthHeader
          })
          .then( response => {
            this.currentUser!.wallets = this.handleResponse( response ).data;
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    async createUser( data: UserProfile ) {
      this.currentUser = null;
      this.loading = true;

      try {

        await http.post( `/api/user`, data, {
            headers: getAuthHeader
          })
          .then( response => {
            this.currentUser = this.handleResponse( response ).data;
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    async updateUser( id: number, data: UserProfile ) {
      this.currentUser = null;
      this.loading = true;

      try {

        await http.put( `/api/user/${id}`, data, {
            headers: getAuthHeader
          })
          .then( response => {
            this.currentUser = this.handleResponse( response ).data;
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    async deleteUser( id: number ) {
      this.currentUser = null;
      this.loading = true;

      try {

        await http.delete( `/api/user/${id}`, {
            headers: getAuthHeader
          })
          .then( response => {
            this.currentUser = this.handleResponse( response ).data;
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    async fetchWalletBalance( key: string ) {
      this.loading = true;

      try {

        await http.get( `/api/solana/account/balance/${key}`, {
            headers: getAuthHeader
          })
          .then( response => {
            return this.handleResponse( response ).data;
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    
    handleResponse( response: AxiosResponse ) {

      const data = response.data;

      if( response.statusText !== "OK" ) {
        if ( response.status === 401 ){
          logout();
          location.reload();
        }

        const error = ( data && data.message ) || response.statusText;
        return Promise.reject( error );

      }

      return data;

    },
  }
})
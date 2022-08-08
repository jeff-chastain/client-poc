import { acceptHMRUpdate, defineStore } from 'pinia'
import { useSecurityStore } from "@/stores/security";
const { logout, getAuthHeader } = useSecurityStore();

import { AxiosResponse } from "axios";
import http from "@/http-common"

import { number } from 'yup'

import { UserProfile } from "@/models/user/user.profile";
import { UserRole } from "@/models/user/user.role";
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

        await http.get( `/v1/authors`, {
            headers: getAuthHeader,
            params: criteria
          })
          .then( response => {
            this.users = this.handleResponse( response ).data;

            // the user's preferences come through as a JSON string, need to parse that and make it usable
            this.users?.forEach( user => {
              user.preferences = JSON.parse( user.preferences );
            });
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

        await http.get( `/v1/authors/${id}`, {
            headers: getAuthHeader
          })
          .then( response => {

            const responseData = this.handleResponse( response ).data;

            // capture the user's profile
            this.currentUser = responseData;

            // the user's preferences come through as a JSON string, need to parse that and make it usable
            this.currentUser!.preferences = JSON.parse( responseData.preferences );

            // load the user wallets if requested
            if( preferences != null ) {
              //this.fetchUserWallets( id );
            }
          })

      } catch( error ) {
        console.log( error );
        //this.error = error

      } finally {
        this.loading = false
      }
    },

    /*
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
    */

    async createUser( data: UserProfile ) {
      this.currentUser = null;
      this.loading = true;

      try {

        await http.post( `/v1/authors`, data, {
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

    async updateUser( id: string, data: UserProfile ) {
      this.currentUser = null;
      this.loading = true;

      try {

        // have to do a bit of transformation for the API
        const requestData = {
          "authorID": data.authorID,
          "email": data.email,
          "firstName": data.firstName,
          "lastName": data.lastName,
          "preferences": JSON.stringify( data.preferences ),
          "role": data.role.roleID
        }

        await http.put( `/v1/authors/${id}`, requestData, {
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

    async deleteUser( id: string ) {
      this.currentUser = null;
      this.loading = true;

      try {

        await http.delete( `/v1/authors/${id}`, {
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
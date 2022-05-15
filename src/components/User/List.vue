<template>
  <div class="col-md-12">
    <div class="card card-container">
      <div class="card-header">
        <h5 class="card-title">Search</h5>
      </div>
      <div class="card-body input-group">
        <input type="text" class="form-control" placeholder="Search by username" v-model="username"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="searchUsername" >
            Search
          </button>
        </div>
      </div>
    </div>
	<br/>

    <div class="card card-container">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title">Users List</h5>
        <router-link to="/user/add" class="badge badge-secondary" style="font-size:1.2rem; font-weight:300;">Add User</router-link>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Last Login</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in this.users" :key="index" @click="setActiveUser(user, index)" >
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ $filters.formatDate( user.lastlogin ) }}</td>
                <td>{{ user.isActive ? "Active" : "Inactive" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div> 
    <br/> 

    <div class="card card-container">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title">User Details</h5>
        <router-link :to="'/user/' + currentUser.id" v-if="currentUser" class="badge badge-primary" style="font-size:1.2rem; font-weight:300;">Edit</router-link>
      </div>
      <div class="card-body">
        <div v-if="currentUser">
          <div>
            <label><strong>Username:</strong></label> {{ currentUser.username }}
          </div>
          <div>
            <label><strong>First Name:</strong></label> {{ currentUser.firstName }}
          </div>
          <div>
            <label><strong>Last Name:</strong></label> {{ currentUser.lastName }}
          </div>
          <div>
            <label><strong>Email:</strong></label> {{ currentUser.email }}
          </div>
          <div>
            <label><strong>Status:</strong></label> {{ currentUser.isActive ? "Active" : "Inactive" }}
          </div>
        </div>
        <div v-else>
          <p>Please click on a User...</p>
        </div>
      </div>
    </div>
  </div>    
</template>

<script>

  import { storeToRefs } from 'pinia'
  import { useUserStore } from "@/stores/user";

  import { UserProfile } from "@/models/user/user.profile";

  export default {
    name: "user-list",

    data: () => {
      return {
        currentUser: UserProfile | null,
        username: ""
      };
    },

    methods: {
      retrieveUsers() {
        try {
          this.fetchUsers();
        }
        catch( error ) {
          this.loading = false;
          this.error = 
            ( error.response &&
              error.response.data &&
              error.response.data.message ) ||
              error.message ||
              error.toString();
        }
      },
      refreshList() {
        this.retrieveUsers();
        this.currentUser = null;
      },
      setActiveUser( user ) {
        this.currentUser = user;
      },
    
      searchUsername() {
        try {
          this.fetchUsers( { "username": this.username } );
          this.setActiveUser( null );
        }
        catch( error ) {
          this.loading = false;
          this.error = 
            ( error.response &&
              error.response.data &&
              error.response.data.message ) ||
              error.message ||
              error.toString();
        }
      }
    },

    mounted() {
      this.retrieveUsers();
    },

    setup() {
      const { users, loading, error } = storeToRefs( useUserStore() )
      const { fetchUsers } = useUserStore()

      return {
        users,
        loading,
        error,
        fetchUsers
      }
    }
  }
</script>
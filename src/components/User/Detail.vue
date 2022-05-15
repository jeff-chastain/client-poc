<template>
  <div class="col-md-12">
    <div class="card card-container">
      <div v-if="currentUser" class="card-body">
        <Form :validation-schema="schema">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <Field name="firstName" type="text" class="form-control" v-model="currentUser.firstName" />
            <ErrorMessage name="firstName" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="lastname">Last Name</label>
            <Field name="lastname" type="text" class="form-control" v-model="currentUser.lastName" />
            <ErrorMessage name="lastname" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <Field name="username" type="text" class="form-control" v-model="currentUser.username" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <Field name="email" type="text" class="form-control" v-model="currentUser.email" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <em>{{ currentUser.isActive ? "Active" : "Inactive" }}</em>
          </div>

          <div class="form-group">
            <button class="btn btn-primary" :disabled="loading" @click="persistUser">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span>Update</span>
            </button>
            <button v-if="currentUser.isActive" class="btn btn-secondary" :disabled="loading" @click="deactivateUser">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span>Delete</span>
            </button>
            <button v-else class="btn btn-secondary" :disabled="loading" @click="reactivateUser">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span>Reactivate</span>
            </button>
          </div>

          <div class="form-group">
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
          </div>
        </Form>
      </div>
      <div v-else class="card-body">
        <br />
        <p>No user found ...</p>
        <router-link :to="'/user/'">Return to User List</router-link>
      </div>
    </div>
  </div>
</template>

<script>

  import { storeToRefs } from 'pinia'
  import { useUserStore } from "@/stores/user";

  import { Form, Field, ErrorMessage } from "vee-validate";
  import * as yup from "yup";

  export default {
    name: "user-detail",
    components: {
      Form,
      Field,
      ErrorMessage,
    },

    data: () => {
      const schema = yup.object().shape({
        username: yup.string().required("Username is required!"),
        email: yup.string().required("Email address is required!")
      });

      return {
        schema
      };
    },

    methods: {
      retrieveUser( id ) {
        try {
          this.fetchUser( id );
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

      persistUser() {
        this.submitted = true;

        try {
          this.updateUser( this.currentUser.id, this.currentUser );
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

      deactivateUser() {
        this.submitted = true;

        try {
          this.deleteUser( this.currentUser.id );
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
        finally {
          this.$router.push( "/user/" );
        }
      },

      reactivateUser() {
        this.currentUser.isActive = true;
        this.persistUser();
      }

    },

    mounted() {
      this.retrieveUser( this.$route.params.id );
    },

    setup() {
      const { currentUser, loading, error } = storeToRefs( useUserStore() )
      const { fetchUser, updateUser, deleteUser } = useUserStore()

      return {
        currentUser,
        loading,
        error,
        fetchUser,
        updateUser,
        deleteUser
      }
    }
  }
</script>

<style scoped>
  label {
    display: block;
    margin-top: 10px;
  }

  .card-container.card {
    padding: 40px 40px;
  }

  .card {
    background-color: #f7f7f7;
    padding: 20px 25px 30px;
    margin: 0 auto 25px;
    margin-top: 50px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  }

  .btn {
    margin: 0 10px 0 0;
  }

  .error-feedback {
    color: red;
  }
</style>
<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card card-container">
        <Form @submit="processLogin" :validation-schema="schema">
          <div class="form-group">
            <label for="username">Username</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>

          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span>Login</span>
            </button>
          </div>

          <div class="form-group">
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>

  import router from '@/router'
  import { storeToRefs } from 'pinia'
  import { useSecurityStore } from "@/stores/security";

  import { Form, Field, ErrorMessage } from "vee-validate";
  import * as yup from "yup";

  export default {
    name: "system-login",
    components: {
      Form,
      Field,
      ErrorMessage
    },

    data: () => {
      const schema = yup.object().shape({
        username: yup.string().required("Username is required!"),
        password: yup.string().required("Password is required!"),
      });
      return {
        schema,
      };
    },

    created() {
      // reset login status
      this.logout();
    },

    methods: {
      processLogin( user ) {

        this.loading = true;

        try {
          this.authenticateUser( user.username, user.password )
            .then( () => {
              router.push( "/" );
            });
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

    setup() {
      const { loading, error } = storeToRefs( useSecurityStore() )
      const { authenticateUser, logout } = useSecurityStore()

      return {
        loading,
        error,
        authenticateUser,
        logout
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
    max-width: 350px !important;
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

  .error-feedback {
    color: red;
  }

  .wallet-button {
    display: inline-block;
    text-align: center;
    width: 100%;
  }
  .wallet-button button {
    margin: 0 auto;
  }  
</style>
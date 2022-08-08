<template>
  <div class="col-md-12">
    <div class="card card-container">
      <div v-if="!submitted">
        <Form @submit="saveUser" :validation-schema="schema">
          <div class="form-group">
            <label for="username">Username</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="firstName">First Name</label>
            <Field name="firstName" type="text" class="form-control" />
            <ErrorMessage name="firstName" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <Field name="lastName" type="text" class="form-control" />
            <ErrorMessage name="lastName" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <Field name="email" type="text" class="form-control" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <Field name="role" as="select" class="form-control">
              <option value="297e76bd8121651201812165fa010091">Administrator</option>
              <option value="297e76bd8121651201812165f9f90090">Editor</option>
            </Field>
            <ErrorMessage name="role" class="error-feedback" />
          </div>

          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <span>Submit</span>
            </button>
          </div>

          <div class="form-group">
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
          </div>
        </Form>
      </div>
      <div v-else>
        <h4>You submitted successfully!</h4>
        <button class="btn btn-success" @click="newUser">Add</button>
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
    name: "user-add",
    components: {
      Form,
      Field,
      ErrorMessage,
    },

    data: () => {
      const schema = yup.object().shape({
        username: yup.string().required("Username is required!"),
        email: yup.string().required("Email address is required!"),
        password: yup.string().required("Password is required!"),
      });

      return {
        schema,
        submitted: false
      };
    },

    methods: {
      newUser() {
        this.submitted = false;
      },

      saveUser( user ) {

        this.loading = true;
        this.submitted = true;

        try {
          this.createUser( user );
        }
        catch( error ) {
          this.loading = false;
          this.message = 
            ( error.response &&
              error.response.data &&
              error.response.data.message ) ||
              error.message ||
              error.toString();

        }
      }
    },

    setup() {
      const { loading, error } = storeToRefs( useUserStore() )
      const { createUser } = useUserStore()

      return {
        loading,
        error,
        createUser
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
</style>
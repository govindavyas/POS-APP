<template>
  <div class="container">
    <div class="form-container">
      <h2 class="text-center mb-4">Admin Login</h2>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <InputText 
            v-model="formData.username" 
            type="email" 
            class="form-control" 
            :class="{'is-invalid': v$.username.$invalid && v$.username.$dirty}"
            placeholder="Enter your email"
            @blur="v$.username.$touch()"
          />
          <small class="text-danger" v-if="v$.username.$error">
            {{ v$.username.$errors[0].$message }}
          </small>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <Password 
            v-model="formData.password" 
            class="w-100" 
            :class="{'is-invalid': v$.password.$invalid && v$.password.$dirty}"
            :feedback="false"
            toggleMask
            placeholder="Enter your password"
            @blur="v$.password.$touch()"
          />
          <small class="text-danger" v-if="v$.password.$error">
            {{ v$.password.$errors[0].$message }}
          </small>
        </div>
        <Button 
          type="submit" 
          :label="loading ? 'Logging in...' : 'Login'" 
          class="w-100 mt-3" 
          :loading="loading"
          severity="primary" 
        />
        <div class="text-center mt-3">
          <router-link to="/signup" class="text-primary">
            Don't have an account? Sign up
          </router-link>
        </div>
      </form>
      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email } from '@vuelidate/validators';
import api from '../api';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const formData = reactive({
  username: '',
  password: ''
});

const rules = {
  username: { 
    required,
    email
  },
  password: { 
    required,
    minLength: minLength(6)
  }
};

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  loading.value = true;
  try {
    const response = await api.post('/adminusers/login', {
      username: formData.username,
      password: formData.password
    });

    localStorage.setItem('token', response.data.token);
    
    toast.add({
      severity: 'success',
      summary: 'Login Successful',
      detail: 'Welcome back!',
      life: 2000
    });

    // Wait for the toast to be visible before redirecting
    setTimeout(() => router.push('/dashboard'), 2000);
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: err.response?.data?.message || 'Invalid username or password',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>

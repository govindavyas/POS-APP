<template>
  <div class="container">
    <div class="form-container">
      <h2 class="text-center mb-4">Admin Signup</h2>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <InputText 
            v-model="formData.username" 
            type="text" 
            class="form-control" 
            :class="{'is-invalid': errors.username}"
            placeholder="Enter your full name" 
            @blur="validateUsername"
          />
          <small class="text-danger" v-if="errors.username">
            {{ errors.username }}
          </small>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <InputText 
            v-model="formData.email" 
            type="email" 
            class="form-control"
            :class="{'is-invalid': errors.email}"
            placeholder="Enter email"
            @blur="validateEmail"
          />
          <small class="text-danger" v-if="errors.email">
            {{ errors.email }}
          </small>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <Password 
            v-model="formData.password" 
            class="w-100" 
            :class="{'is-invalid': errors.password}"
            :feedback="true"
            toggleMask 
            placeholder="Enter password"
            @blur="validatePassword"
            @input="validatePasswordMatch"
          />
          <small class="text-danger" v-if="errors.password">
            {{ errors.password }}
          </small>
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <Password 
            v-model="formData.confirmPassword" 
            class="w-100"
            :class="{'is-invalid': errors.confirmPassword}"
            toggleMask 
            placeholder="Confirm password"
            @blur="validatePasswordMatch"
            @input="validatePasswordMatch"
          />
          <small class="text-danger" v-if="errors.confirmPassword">
            {{ errors.confirmPassword }}
          </small>
        </div>
        <Button 
          type="submit" 
          :label="loading ? 'Signing up...' : 'Sign Up'" 
          class="w-100 mt-3" 
          :loading="loading"
          severity="success" 
        />
        <div class="text-center mt-3">
          <router-link to="/" class="text-primary">
            Already have an account? Login
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
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Clear all errors
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
};

// Validation functions
const validateUsername = () => {
  if (!formData.username) {
    errors.username = 'Full name is required';
    return false;
  }
  if (formData.username.length < 2) {
    errors.username = 'Full name must be at least 2 characters';
    return false;
  }
  errors.username = '';
  return true;
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = 'Email is required';
    return false;
  }
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
    return false;
  }
  errors.email = '';
  return true;
};

const validatePassword = () => {
  if (!formData.password) {
    errors.password = 'Password is required';
    return false;
  }
  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    return false;
  }
  errors.password = '';
  // Re-validate password match if confirm password is filled
  if (formData.confirmPassword) {
    validatePasswordMatch();
  }
  return true;
};

const validatePasswordMatch = () => {
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    return false;
  }
  errors.confirmPassword = '';
  return true;
};

const validateForm = () => {
  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isPasswordMatchValid = validatePasswordMatch();
  
  return isUsernameValid && isEmailValid && isPasswordValid && isPasswordMatchValid;
};

const handleSubmit = async () => {
  clearErrors();
  
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.post('/adminusers/signup', {
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    toast.add({
      severity: 'success',
      summary: 'Signup Successful',
      detail: 'Your account has been created successfully. You can now login.',
      life: 3000
    });

    // Wait for the toast to be visible before redirecting
    setTimeout(() => router.push('/'), 3000);
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Signup Failed',
      detail: err.response?.data?.message || 'An error occurred during signup. Please try again.',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Component-specific styles */
</style>

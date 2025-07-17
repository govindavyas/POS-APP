<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token && router.currentRoute.value.path !== '/') {
    router.push('/');
  }
});
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm" v-if="$route.path !== '/' && $route.path !== '/signup'">
      <div class="container">
        <router-link class="navbar-brand" to="/dashboard">POS Admin</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/businesses">Businesses</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/business-profile">Create Business</router-link>
            </li>
          </ul>
          <button @click="() => { localStorage.removeItem('token'); router.push('/'); }" 
                  class="btn btn-outline-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
    <main class="container py-4">
      <router-view />
    </main>
  </div>
</template>

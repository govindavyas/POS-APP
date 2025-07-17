<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="h2 mb-4">Dashboard</h1>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Welcome to POS Admin</h5>
            <p class="card-text">
              Welcome to the POS Admin Dashboard! Use the navigation above to access different sections.
            </p>
            <div class="d-flex gap-2">
              <router-link to="/profile" class="btn btn-primary">
                <i class="pi pi-user me-2"></i>Profile
              </router-link>
              <router-link to="/businesses" class="btn btn-outline-primary">
                <i class="pi pi-building me-2"></i>View Businesses
              </router-link>
              <router-link to="/business-profile" class="btn btn-success">
                <i class="pi pi-plus me-2"></i>Create Business
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dashboard component for POS Admin
</script>

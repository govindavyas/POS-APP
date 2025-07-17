<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h2 class="h3 mb-4">Profile Management</h2>
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">User Profile</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Role:</strong> Administrator</p>
                <p><strong>Last Login:</strong> Today</p>
              </div>
              <div class="col-md-6">
                <Button 
                  label="Change Password" 
                  class="btn me-2"
                  severity="primary"
                />
                <Button 
                  label="Update Profile" 
                  class="btn"
                  severity="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
</script>

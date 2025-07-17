<template>
  <div class="container-fluid">
    <div class="businesses-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Business Management</h2>
        <router-link to="/business-profile" class="btn btn-success">
          <i class="pi pi-plus me-2"></i>Create New Business
        </router-link>
      </div>

      <!-- Business Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-building"></i>
            </div>
            <div class="stat-info">
              <h3>{{ businesses.length }}</h3>
              <p>Total Businesses</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-check-circle" style="color: #28a745;"></i>
            </div>
            <div class="stat-info">
              <h3>{{ activeBusinesses }}</h3>
              <p>Active Businesses</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-verified" style="color: #007bff;"></i>
            </div>
            <div class="stat-info">
              <h3>{{ gstRegisteredCount }}</h3>
              <p>GST Registered</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="pi pi-calendar" style="color: #6f42c1;"></i>
            </div>
            <div class="stat-info">
              <h3>{{ recentBusinesses }}</h3>
              <p>This Month</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Business List -->
      <div class="business-list-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>All Businesses</h5>
          <div class="d-flex gap-3 align-items-center">
            <div class="search-container">
              <InputText 
                v-model="searchQuery" 
                placeholder="Search by business name, email, phone, city, or industry..." 
                class="search-input"
              />
              <i class="pi pi-search search-icon"></i>
            </div>
            <Dropdown 
              v-model="selectedSortBy" 
              :options="sortOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Sort by..."
              class="sort-dropdown"
              showClear
              filter
              filterPlaceholder="Search sort options..."
            />
          </div>
        </div>

        <div v-if="loading" class="text-center py-4">
          <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
          <p class="mt-2">Loading businesses...</p>
        </div>

        <div v-else-if="filteredBusinesses.length === 0" class="empty-state">
          <div class="text-center py-5">
            <i class="pi pi-building" style="font-size: 4rem; color: #ddd;"></i>
            <h4 class="mt-3 text-muted">
              {{ searchQuery ? 'No Matching Businesses Found' : 'No Businesses Found' }}
            </h4>
            <p class="text-muted">
              {{ searchQuery ? 'Try adjusting your search criteria or clear the search to see all businesses' : 'Get started by creating your first business profile' }}
            </p>
            <div class="mt-3">
              <Button 
                v-if="searchQuery" 
                label="Clear Search" 
                severity="secondary" 
                outlined
                @click="clearSearch"
                class="me-2"
              />
              <router-link to="/business-profile" class="btn btn-success">
                <i class="pi pi-plus me-2"></i>{{ searchQuery ? 'Create New Business' : 'Create Your First Business' }}
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="row">
          <div v-for="business in filteredBusinesses" :key="business.id" class="col-md-6 col-lg-4 mb-4">
            <div class="business-card">
              <div class="business-card-header">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="business-type-badge">
                    {{ business.business_type_name || 'Business' }}
                  </div>
                  <div class="business-status">
                    <span v-if="business.isgstregistered" class="badge bg-success">GST</span>
                  </div>
                </div>
              </div>
              
              <div class="business-card-body">
                <h6 class="business-name">{{ business.business_name }}</h6>
                <p class="business-email">
                  <i class="pi pi-envelope me-2"></i>{{ business.business_email }}
                </p>
                <p class="business-phone">
                  <i class="pi pi-phone me-2"></i>{{ business.business_phone }}
                </p>
                <p class="business-location" v-if="business.city || business.state">
                  <i class="pi pi-map-marker me-2"></i>
                  <span>{{ [business.city, business.state].filter(Boolean).join(', ') }}</span>
                </p>
                <p class="business-industry" v-if="business.industry_type_name">
                  <i class="pi pi-tag me-2"></i>{{ business.industry_type_name }}
                </p>
                <p class="business-registration" v-if="business.business_type_name">
                  <i class="pi pi-briefcase me-2"></i>{{ business.business_type_name }}
                </p>
              </div>

              <div class="business-card-footer">
                <div class="d-flex gap-2">
                  <Button 
                    label="View" 
                    size="small" 
                    severity="secondary" 
                    outlined
                    @click="viewBusiness(business.id)"
                  />
                  <Button 
                    label="Edit" 
                    size="small" 
                    severity="primary"
                    @click="editBusiness(business.id)"
                  />
                  <Button 
                    icon="pi pi-ellipsis-v" 
                    size="small" 
                    severity="secondary" 
                    text
                    @click="showBusinessOptions(business.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

// PrimeVue Components
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const searchQuery = ref('');
const businesses = ref([]);
const selectedSortBy = ref(null);

// Sort options for dropdown
const sortOptions = ref([
  { label: 'Business Name (A-Z)', value: 'name_asc' },
  { label: 'Business Name (Z-A)', value: 'name_desc' },
  { label: 'Recently Added', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc' },
  { label: 'GST Registered First', value: 'gst_first' },
  { label: 'City (A-Z)', value: 'city_asc' },
  { label: 'Industry Type', value: 'industry_asc' }
]);

// Load businesses
onMounted(async () => {
  await loadBusinesses();
});

const loadBusinesses = async () => {
  loading.value = true;
  try {
    const response = await api.get('/businesses');
    businesses.value = response.data;
  } catch (error) {
    console.error('Error loading businesses:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load businesses',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Computed properties for statistics
const activeBusinesses = computed(() => {
  return businesses.value.length; // Assuming all loaded businesses are active
});

const gstRegisteredCount = computed(() => {
  return businesses.value.filter(b => b.isgstregistered).length;
});

const recentBusinesses = computed(() => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return businesses.value.filter(b => {
    if (!b.created_at) return false;
    const businessDate = new Date(b.created_at);
    return businessDate.getMonth() === currentMonth && businessDate.getFullYear() === currentYear;
  }).length;
});

const filteredBusinesses = computed(() => {
  let filtered = businesses.value;
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(business => 
      business.business_name?.toLowerCase().includes(query) ||
      business.business_email?.toLowerCase().includes(query) ||
      business.business_phone?.includes(query) ||
      business.city?.toLowerCase().includes(query) ||
      business.state?.toLowerCase().includes(query) ||
      business.industry_type_name?.toLowerCase().includes(query) ||
      business.business_type_name?.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting
  if (selectedSortBy.value) {
    switch (selectedSortBy.value) {
      case 'name_asc':
        filtered.sort((a, b) => (a.business_name || '').localeCompare(b.business_name || ''));
        break;
      case 'name_desc':
        filtered.sort((a, b) => (b.business_name || '').localeCompare(a.business_name || ''));
        break;
      case 'date_desc':
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      case 'date_asc':
        filtered.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        break;
      case 'gst_first':
        filtered.sort((a, b) => (b.isgstregistered ? 1 : 0) - (a.isgstregistered ? 1 : 0));
        break;
      case 'city_asc':
        filtered.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      case 'industry_asc':
        filtered.sort((a, b) => (a.industry_type_name || '').localeCompare(b.industry_type_name || ''));
        break;
    }
  }
  
  return filtered;
});

// Event handlers
const clearSearch = () => {
  searchQuery.value = '';
  selectedSortBy.value = null;
};

const viewBusiness = (businessId) => {
  // Navigate to business view page (you can create this later)
  console.log('View business:', businessId);
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Business details view coming soon!',
    life: 2000
  });
};

const editBusiness = (businessId) => {
  // Navigate to edit business page
  router.push(`/business-profile?edit=${businessId}`);
};

const showBusinessOptions = (businessId) => {
  // Show context menu or options
  console.log('Show options for business:', businessId);
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Additional business options coming soon!',
    life: 2000
  });
};
</script>

<style scoped>
.businesses-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #007bff;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.stat-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.business-list-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-container {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding-right: 40px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
}

.sort-dropdown {
  min-width: 200px;
}

.business-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.business-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: #007bff;
}

.business-card-header {
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.business-type-badge {
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.business-card-body {
  padding: 20px;
  flex-grow: 1;
}

.business-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.3;
}

.business-email,
.business-phone,
.business-location,
.business-industry,
.business-registration {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.business-card-footer {
  padding: 15px 20px;
  border-top: 1px solid #f1f3f4;
  background: #fafbfc;
}

.empty-state {
  background: white;
  border-radius: 12px;
  border: 2px dashed #ddd;
  margin: 20px 0;
}

.badge {
  font-size: 0.7rem;
}

/* Custom PrimeVue Dropdown Styles */
:deep(.p-dropdown) {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #007bff;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

:deep(.p-dropdown-panel) {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  margin-top: 4px;
}

:deep(.p-dropdown-items) {
  padding: 8px 0;
}

:deep(.p-dropdown-item) {
  padding: 10px 16px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

:deep(.p-dropdown-item:hover) {
  background-color: #f8f9fa;
}

:deep(.p-dropdown-item.p-highlight) {
  background-color: #007bff;
  color: white;
}

:deep(.p-dropdown-filter-container) {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
}

:deep(.p-dropdown-filter) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
}

:deep(.p-dropdown-filter:focus) {
  border-color: #007bff;
  box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25);
  outline: none;
}
</style>
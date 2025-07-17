<template>
  <div class="container-fluid">
    <div class="business-settings-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Business Profile</h2>
        <div class="d-flex gap-2">
          <Button 
            label="Back to Businesses" 
            severity="secondary" 
            outlined
            icon="pi pi-arrow-left"
            @click="router.push('/businesses')"
          />
          <Button 
            label="Reset Form" 
            severity="warning" 
            outlined
            icon="pi pi-refresh"
            @click="resetForm"
          />
        </div>
      </div>

      <div class="business-form">
        <!-- GST Registration Priority Section -->
        <div class="gst-priority-section mb-4 p-4 rounded-3 position-relative overflow-hidden">
          <div class="gst-priority-gradient"></div>
          <div class="position-relative z-index-1">
            <div class="d-flex align-items-center mb-3">
              <div class="priority-icon-wrapper me-3">
                <i class="pi pi-star-fill text-warning" style="font-size: 1.5rem;"></i>
              </div>
              <div>
                <h5 class="mb-1 text-primary fw-bold">🚀 Quick Setup with GST</h5>
                <small class="text-muted">Save time with smart auto-fill technology</small>
              </div>
            </div>
            <div class="alert alert-info border-0 bg-light-info mb-3">
              <i class="pi pi-info-circle me-2"></i>
              <strong>Pro Tip:</strong> Have your GST number ready? We'll automatically fill business details, location, and even suggest the right business categories!
            </div>
          
          <!-- GST Registration Question -->
          <div class="form-group mb-4">
            <label class="form-label fw-bold mb-3" style="font-size: 1.1rem;">Do you have a GST Registration Number?</label>
            <div class="gst-option-cards">
              <div class="gst-option-card" :class="{ 'active': formData.isgstregistered === true }">
                <input 
                  class="form-check-input d-none" 
                  type="radio" 
                  name="gstRegistration" 
                  id="gstYes"
                  :value="true"
                  v-model="formData.isgstregistered"
                  @change="onGstRegistrationChange"
                >
                <label class="gst-option-label" for="gstYes">
                  <div class="gst-option-icon success">
                    <i class="pi pi-check-circle"></i>
                  </div>
                  <div class="gst-option-content">
                    <strong class="d-block">Yes, I have GST</strong>
                    <small class="text-muted">Auto-fill business details</small>
                  </div>
                  <div class="gst-option-badge">
                    <span class="badge bg-success">Recommended</span>
                  </div>
                </label>
              </div>
              
              <div class="gst-option-card" :class="{ 'active': formData.isgstregistered === false }">
                <input 
                  class="form-check-input d-none" 
                  type="radio" 
                  name="gstRegistration" 
                  id="gstNo"
                  :value="false"
                  v-model="formData.isgstregistered"
                  @change="onGstRegistrationChange"
                >
                <label class="gst-option-label" for="gstNo">
                  <div class="gst-option-icon secondary">
                    <i class="pi pi-pencil"></i>
                  </div>
                  <div class="gst-option-content">
                    <strong class="d-block">No, I don't have GST</strong>
                    <small class="text-muted">Fill details manually</small>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- GST Number Input (Priority) -->
          <div class="gst-input-section" v-if="formData.isgstregistered">
            <div class="row align-items-end">
              <div class="col-lg-8">
                <label class="form-label fw-bold mb-2">
                  <i class="pi pi-id-card me-2 text-primary"></i>Enter Your GST Number *
                </label>
                <div class="gst-input-wrapper position-relative">
                  <InputText 
                    v-model="formData.gst_number" 
                    class="form-control form-control-lg gst-input"
                    :class="{'is-invalid': errors.gst_number, 'is-valid': gstVerificationResult.verified}"
                    placeholder="Enter 15-digit GST number (e.g., 22AAAAA0000A1Z5)"
                    @blur="validateGstNumber"
                    @input="onGstNumberChange"
                  />
                  <div class="gst-input-icon" v-if="gstVerificationResult.verified">
                    <i class="pi pi-check-circle text-success"></i>
                  </div>
                </div>
                <small class="text-danger" v-if="errors.gst_number">
                  <i class="pi pi-exclamation-triangle me-1"></i>{{ errors.gst_number }}
                </small>
                <div class="gst-help-text mt-2">
                  <i class="pi pi-lightbulb me-2 text-warning"></i>
                  <span class="text-muted">We'll automatically fill business name, address, and suggest business categories</span>
                </div>
              </div>
              <div class="col-lg-4">
                <Button 
                  :label="gstVerifying ? 'Verifying...' : 'Verify & Auto-fill'"
                  severity="success"
                  size="large"
                  class="w-100 verify-btn"
                  :loading="gstVerifying"
                  :disabled="!formData.gst_number || formData.gst_number.length !== 15"
                  @click="verifyGstNumber"
                >
                  <template #icon>
                    <i class="pi pi-search-plus me-2"></i>
                  </template>
                </Button>
              </div>
            </div>
            
            <!-- GST Verification Result -->
            <div v-if="gstVerificationResult.verified" class="gst-verification-success mt-4 p-4 rounded-3 position-relative overflow-hidden">
              <div class="success-gradient"></div>
              <div class="position-relative z-index-1">
                <div class="d-flex align-items-center mb-3">
                  <div class="success-icon-wrapper me-3">
                    <i class="pi pi-check-circle text-success" style="font-size: 2rem;"></i>
                  </div>
                  <div>
                    <strong class="text-success d-block fs-5">✅ GST Number Verified Successfully!</strong>
                    <small class="text-muted">Business details loaded from government database</small>
                  </div>
                </div>
                
                <div class="verification-details-card bg-white bg-opacity-50 p-3 rounded-2 mb-3">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="detail-item mb-2">
                        <small class="text-muted d-block">Business Name</small>
                        <strong class="text-dark">{{ gstVerificationResult.legalName }}</strong>
                      </div>
                      <div class="detail-item mb-2">
                        <small class="text-muted d-block">Trade Name</small>
                        <strong class="text-dark">{{ gstVerificationResult.tradeName }}</strong>
                      </div>
                      <div class="detail-item mb-2">
                        <small class="text-muted d-block">Status</small>
                        <span class="badge" :class="gstVerificationResult.status === 'Active' ? 'bg-success' : 'bg-warning'">
                          {{ gstVerificationResult.status }}
                        </span>
                      </div>
                      <div class="detail-item mb-2" v-if="gstVerificationResult.city">
                        <small class="text-muted d-block">City</small>
                        <strong class="text-dark">{{ gstVerificationResult.city }}</strong>
                      </div>
                      <div class="detail-item" v-if="gstVerificationResult.pincode">
                        <small class="text-muted d-block">Pincode</small>
                        <strong class="text-dark">{{ gstVerificationResult.pincode }}</strong>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="detail-item mb-2">
                        <small class="text-muted d-block">Registration Date</small>
                        <strong class="text-dark">{{ gstVerificationResult.registrationDate }}</strong>
                      </div>
                      <div class="detail-item mb-2">
                        <small class="text-muted d-block">Business Type</small>
                        <strong class="text-dark">{{ gstVerificationResult.businessType }}</strong>
                      </div>
                      <div class="detail-item">
                        <small class="text-muted d-block">State</small>
                        <strong class="text-dark">{{ gstVerificationResult.state }}</strong>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3" v-if="gstVerificationResult.address">
                    <small class="text-muted d-block">Complete Address</small>
                    <p class="text-dark mb-0">{{ gstVerificationResult.address }}</p>
                  </div>
                </div>
                
                <!-- Smart Suggestions Section -->
                <div v-if="gstVerificationResult.suggestedBusinessType || gstVerificationResult.suggestedIndustryType" class="smart-suggestions-card bg-gradient-warning p-3 rounded-2 mb-3">
                  <div class="d-flex align-items-center mb-2">
                    <div class="suggestion-icon-wrapper me-2">
                      <i class="pi pi-lightbulb text-warning"></i>
                    </div>
                    <strong class="text-dark">🎯 Smart Business Suggestions</strong>
                    <span class="badge bg-dark ms-2" v-if="gstVerificationResult.confidence">
                      {{ gstVerificationResult.confidence }} confidence
                    </span>
                  </div>
                  <div class="row g-2">
                    <div class="col-md-4" v-if="gstVerificationResult.suggestedBusinessType">
                      <div class="suggestion-item p-2 bg-white bg-opacity-75 rounded">
                        <small class="text-muted d-block">Business Type</small>
                        <strong class="text-success">{{ gstVerificationResult.suggestedBusinessType }}</strong>
                      </div>
                    </div>
                    <div class="col-md-4" v-if="gstVerificationResult.suggestedIndustryType">
                      <div class="suggestion-item p-2 bg-white bg-opacity-75 rounded">
                        <small class="text-muted d-block">Industry Type</small>
                        <strong class="text-success">{{ gstVerificationResult.suggestedIndustryType }}</strong>
                      </div>
                    </div>
                    <div class="col-md-4" v-if="gstVerificationResult.suggestedRegistrationType">
                      <div class="suggestion-item p-2 bg-white bg-opacity-75 rounded">
                        <small class="text-muted d-block">Registration Type</small>
                        <strong class="text-success">{{ gstVerificationResult.suggestedRegistrationType }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex gap-3 flex-wrap">
                  <Button 
                    label="🚀 Auto-fill All Details" 
                    severity="success" 
                    class="auto-fill-btn flex-fill"
                    icon="pi pi-download"
                    @click="autoFillFromGst"
                  />
                  <Button 
                    label="Continue Below" 
                    severity="primary"
                    outlined
                    class="continue-btn"
                    icon="pi pi-arrow-down"
                    @click="scrollToAdditionalDetails"
                  />
                </div>
              </div>
            </div>

            <!-- GST Verification Error -->
            <div v-if="gstVerificationResult.error" class="gst-verification-error mt-4 p-3 rounded-2 bg-warning bg-opacity-10 border border-warning">
              <div class="d-flex align-items-center">
                <i class="pi pi-exclamation-triangle text-warning me-2 fs-5"></i>
                <div>
                  <strong class="text-warning d-block">Verification Failed</strong>
                  <span class="text-dark">{{ gstVerificationResult.error }}</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <!-- Additional Details Section -->
        <div ref="additionalDetailsSection" :class="{'opacity-50': formData.isgstregistered && !gstVerificationResult.verified && !showAllFields}">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="text-secondary">
              {{ formData.isgstregistered ? 'Additional Business Details' : 'Business Details' }}
            </h5>
            <Button 
              v-if="formData.isgstregistered && !gstVerificationResult.verified"
              label="Fill Manually Instead"
              severity="secondary"
              outlined
              size="small"
              @click="showAllFields = true"
            />
          </div>
          
          <div v-if="!formData.isgstregistered || gstVerificationResult.verified || showAllFields">
            <div class="row">
              <!-- Left Column -->
              <div class="col-md-6">
                <!-- Business Name -->
                <div class="form-group mb-3">
                  <label class="form-label">Business Name *</label>
                  <InputText 
                    v-model="formData.business_name" 
                    class="form-control"
                    :class="{'is-invalid': errors.business_name}"
                    placeholder="Enter your business name (e.g., ABC Textiles Pvt Ltd)"
                    @blur="validateBusinessName"
                  />
                  <small class="text-danger" v-if="errors.business_name">
                    {{ errors.business_name }}
                  </small>
                </div>

                <!-- Company Phone Number -->
                <div class="form-group mb-3">
                  <label class="form-label">Company Phone Number *</label>
                  <InputText 
                    v-model="formData.business_phone" 
                    class="form-control"
                    :class="{'is-invalid': errors.business_phone}"
                    placeholder="Enter 10-digit phone number (e.g., 9876543210)"
                    @blur="validatePhone"
                  />
                  <small class="text-danger" v-if="errors.business_phone">
                    {{ errors.business_phone }}
                  </small>
                </div>

                <!-- Company Email -->
                <div class="form-group mb-3">
                  <label class="form-label">Company E-Mail *</label>
                  <InputText 
                    v-model="formData.business_email" 
                    type="email"
                    class="form-control"
                    :class="{'is-invalid': errors.business_email}"
                    placeholder="Enter business email (e.g., business@company.com)"
                    @blur="validateEmail"
                  />
                  <small class="text-danger" v-if="errors.business_email">
                    {{ errors.business_email }}
                  </small>
                </div>

                <!-- Billing Address -->
                <div class="form-group mb-3">
                  <label class="form-label">Billing Address *</label>
                  <Textarea 
                    v-model="formData.company_address_line1" 
                    class="form-control"
                    :class="{'is-invalid': errors.company_address_line1}"
                    placeholder="Enter complete business address with building number, street, and landmarks"
                    rows="3"
                    @blur="validateAddress"
                  />
                  <small class="text-danger" v-if="errors.company_address_line1">
                    {{ errors.company_address_line1 }}
                  </small>
                </div>

                <!-- State, City, Pincode Row -->
                <div class="row mb-3">
                  <div class="col-md-4">
                    <label class="form-label">State *</label>
                    <Dropdown 
                      v-model="formData.state" 
                      :options="states" 
                      optionLabel="name" 
                      optionValue="value"
                      placeholder="Select your state"
                      class="w-100"
                      :class="{'is-invalid': errors.state}"
                      filter
                      filterPlaceholder="Search states..."
                      showClear
                      @change="onStateChange"
                    />
                    <small class="text-danger" v-if="errors.state">
                      {{ errors.state }}
                    </small>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">City *</label>
                    <Dropdown 
                      v-model="formData.city" 
                      :options="cities" 
                      optionLabel="name" 
                      optionValue="value"
                      placeholder="Select your city"
                      class="w-100"
                      :class="{'is-invalid': errors.city}"
                      :disabled="!formData.state"
                      filter
                      filterPlaceholder="Search cities..."
                      showClear
                      @change="onCityChange"
                    />
                    <small class="text-danger" v-if="errors.city">
                      {{ errors.city }}
                    </small>
                    <small class="text-muted" v-if="!formData.state">
                      Select state first
                    </small>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Pincode *</label>
                    <div class="position-relative">
                      <Dropdown 
                        v-if="availablePincodes.length > 0"
                        v-model="formData.pincode" 
                        :options="availablePincodes" 
                        optionLabel="name" 
                        optionValue="value"
                        placeholder="Select pincode"
                        class="w-100"
                        :class="{'is-invalid': errors.pincode}"
                        filter
                        filterPlaceholder="Search pincodes..."
                        showClear
                        @change="onPincodeChange"
                      />
                      <InputText 
                        v-else
                        v-model="formData.pincode" 
                        class="form-control"
                        :class="{'is-invalid': errors.pincode}"
                        placeholder="Enter 6-digit pincode (e.g., 400001)"
                        @blur="validatePincode"
                        @input="onPincodeChange"
                      />
                    </div>
                    <small class="text-danger" v-if="errors.pincode">
                      {{ errors.pincode }}
                    </small>
                    <small class="text-muted" v-if="!formData.state || !formData.city">
                      Or enter pincode to auto-fill city & state
                    </small>
                  </div>
                </div>

                <!-- PAN Number -->
                <div class="form-group mb-3">
                  <label class="form-label">PAN Number *</label>
                  <InputText 
                    v-model="formData.business_pancard" 
                    class="form-control"
                    :class="{'is-invalid': errors.business_pancard}"
                    placeholder="Enter 10-character PAN (e.g., ABCDE1234F)"
                    @blur="validatePan"
                  />
                  <small class="text-danger" v-if="errors.business_pancard">
                    {{ errors.business_pancard }}
                  </small>
                </div>
              </div>

              <!-- Right Column -->
              <div class="col-md-6">
                <!-- Business Type -->
                <div class="form-group mb-3">
                  <label class="form-label">Business Type *</label>
                  <Dropdown 
                    v-model="formData.business_type_id" 
                    :options="businessTypes" 
                    optionLabel="name" 
                    optionValue="id"
                    placeholder="Choose your business type"
                    class="w-100"
                    :class="{'is-invalid': errors.business_type_id}"
                    filter
                    filterPlaceholder="Search business types..."
                    showClear
                  />
                  <small class="text-danger" v-if="errors.business_type_id">
                    {{ errors.business_type_id }}
                  </small>
                </div>

                <!-- Industry Type -->
                <div class="form-group mb-3">
                  <label class="form-label">Industry Type *</label>
                  <Dropdown 
                    v-model="formData.industry_type_id" 
                    :options="industryTypes" 
                    optionLabel="name" 
                    optionValue="id"
                    placeholder="Select your industry category"
                    class="w-100"
                    :class="{'is-invalid': errors.industry_type_id}"
                    filter
                    filterPlaceholder="Search industry types..."
                    showClear
                  />
                  <small class="text-danger" v-if="errors.industry_type_id">
                    {{ errors.industry_type_id }}
                  </small>
                </div>

                <!-- Business Registration Type -->
                <div class="form-group mb-3">
                  <label class="form-label">Business Registration Type *</label>
                  <Dropdown 
                    v-model="formData.registration_type_id" 
                    :options="registrationTypes" 
                    optionLabel="name" 
                    optionValue="id"
                    placeholder="Choose registration type"
                    class="w-100"
                    :class="{'is-invalid': errors.registration_type_id}"
                    filter
                    filterPlaceholder="Search registration types..."
                    showClear
                  />
                  <small class="text-danger" v-if="errors.registration_type_id">
                    {{ errors.registration_type_id }}
                  </small>
                </div>

                <!-- Signature -->
                <div class="form-group mb-3">
                  <label class="form-label">Signature</label>
                  <div class="signature-upload-area border p-3 text-center">
                    <i class="pi pi-plus-circle" style="font-size: 2rem; color: #007bff;"></i>
                    <p class="mt-2 mb-0">+ Add Signature</p>
                    <input 
                      type="file" 
                      ref="signatureInput" 
                      @change="handleSignatureUpload" 
                      accept="image/*"
                      style="display: none;"
                    >
                    <Button 
                      label="Choose File" 
                      severity="secondary" 
                      outlined 
                      size="small"
                      class="mt-2"
                      @click="$refs.signatureInput.click()"
                    />
                  </div>
                </div>

                <!-- Website -->
                <div class="form-group mb-3">
                  <label class="form-label">Website</label>
                  <div class="input-group">
                    <span class="input-group-text">🌐</span>
                    <InputText 
                      v-model="formData.website" 
                      class="form-control"
                      placeholder="Enter website URL (e.g., www.yourcompany.com)"
                    />
                    <Button 
                      label="Add" 
                      severity="primary" 
                      class="input-group-text"
                      @click="addWebsite"
                    />
                  </div>
                </div>

                <!-- Business Details -->
                <div class="form-group mb-3">
                  <label class="form-label">Add Business Details</label>
                  <small class="form-text text-muted d-block">
                    Add additional business information such as MSME number, trademark registration, certifications, etc.
                  </small>
                  <Textarea 
                    v-model="formData.additional_details" 
                    class="form-control mt-2"
                    placeholder="Enter additional business details, certifications, MSME number, or any other relevant information"
                    rows="3"
                  />
                </div>

                <!-- TDS/TCS Toggles -->
                <div class="form-group mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label">Enable TDS</label>
                    <ToggleButton 
                      v-model="formData.enable_tds" 
                      onLabel="ON" 
                      offLabel="OFF"
                    />
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label">Enable TCS</label>
                    <ToggleButton 
                      v-model="formData.enable_tcs" 
                      onLabel="ON" 
                      offLabel="OFF"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>        </div>
        
        <!-- Submit Button -->
        <div class="d-flex justify-content-between mt-4">
          <Button 
            label="Clear Form" 
            severity="secondary" 
            outlined
            icon="pi pi-times"
            @click="resetForm"
          />
          <Button 
            :label="loading ? 'Creating Business...' : 'Create Business Profile'" 
            severity="primary"
            :loading="loading"
            size="large"
            icon="pi pi-check"
            @click="handleSubmit"
          />
        </div>
      </div>

      <!-- Other Businesses Section -->
      <div class="other-businesses-section mt-5">
        <h5>Other Businesses</h5>
        <div class="row mt-3">
          <div v-for="business in otherBusinesses" :key="business.id" class="col-md-6 mb-3">
            <div class="business-card p-3 border rounded">
              <div class="d-flex align-items-center">
                <div class="business-icon me-3">
                  <i class="pi pi-building" style="font-size: 1.5rem; color: #007bff;"></i>
                </div>
                <div>
                  <h6 class="mb-1">{{ business.business_name }}</h6>
                  <small class="text-muted">{{ business.business_type_name }}</small>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Show message if no other businesses -->
          <div v-if="otherBusinesses.length === 0" class="col-12">
            <div class="text-center text-muted py-4">
              <i class="pi pi-building" style="font-size: 3rem; color: #ddd;"></i>
              <p class="mt-2">No other businesses found</p>
            </div>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

// PrimeVue Components
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const gstVerifying = ref(false);
const showAllFields = ref(false);
const additionalDetailsSection = ref(null);

const formData = reactive({
  business_name: '',
  business_phone: '',
  business_email: '',
  business_pancard: '',
  company_address_line1: '',
  company_address_line2: '',
  state: '',
  city: '',
  pincode: '',
  isgstregistered: false,
  gst_number: '',
  business_type_id: '',
  industry_type_id: '',
  registration_type_id: '',
  website: '',
  signature_path: '',
  enable_tds: false,
  enable_tcs: false,
  additional_details: ''
});

const gstVerificationResult = reactive({
  verified: false,
  legalName: '',
  tradeName: '',
  status: '',
  registrationDate: '',
  businessType: '',
  state: '',
  city: '',
  pincode: '',
  address: '',
  suggestedBusinessType: '',
  suggestedIndustryType: '',
  suggestedRegistrationType: '',
  confidence: '',
  error: ''
});

const errors = reactive({
  business_name: '',
  business_phone: '',
  business_email: '',
  business_pancard: '',
  company_address_line1: '',
  state: '',
  city: '',
  pincode: '',
  gst_number: '',
  business_type_id: '',
  industry_type_id: '',
  registration_type_id: ''
});

// Dropdown options
const states = ref([]);
const cities = ref([]);
const availablePincodes = ref([]);
const businessTypes = ref([]);
const industryTypes = ref([]);
const registrationTypes = ref([]);
const otherBusinesses = ref([]);

// Load dropdown data
onMounted(async () => {
  try {
    // Load business types
    const businessTypesRes = await api.get('/business-types');
    businessTypes.value = businessTypesRes.data;

    // Load industry types
    const industryTypesRes = await api.get('/industry-types');
    industryTypes.value = industryTypesRes.data;

    // Load registration types
    const registrationTypesRes = await api.get('/business-registration-types');
    registrationTypes.value = registrationTypesRes.data;

    // Load locations/states
    const statesRes = await api.get('/locations/states');
    states.value = statesRes.data.map(item => ({ 
      name: item.state.trim(), 
      value: item.state.trim() 
    }));

    // Load existing businesses
    await loadOtherBusinesses();

  } catch (error) {
    console.error('Error loading dropdown data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load form data',
      life: 3000
    });
  }
});

// Load other businesses
const loadOtherBusinesses = async () => {
  try {
    const response = await api.get('/businesses');
    otherBusinesses.value = response.data;
  } catch (error) {
    console.error('Error loading businesses:', error);
    // Don't show error toast for this as it's not critical
  }
};

// Validation functions
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
};

const validateBusinessName = () => {
  if (!formData.business_name) {
    errors.business_name = 'Business name is required';
    return false;
  }
  errors.business_name = '';
  return true;
};

const validatePhone = () => {
  if (!formData.business_phone) {
    errors.business_phone = 'Phone number is required';
    return false;
  }
  if (!/^\d{10}$/.test(formData.business_phone)) {
    errors.business_phone = 'Phone number must be 10 digits';
    return false;
  }
  errors.business_phone = '';
  return true;
};

const validateEmail = () => {
  if (!formData.business_email) {
    errors.business_email = 'Email is required';
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(formData.business_email)) {
    errors.business_email = 'Email format is invalid';
    return false;
  }
  errors.business_email = '';
  return true;
};

const validateAddress = () => {
  if (!formData.company_address_line1) {
    errors.company_address_line1 = 'Address is required';
    return false;
  }
  errors.company_address_line1 = '';
  return true;
};

const validatePincode = () => {
  if (!formData.pincode) {
    errors.pincode = 'Pincode is required';
    return false;
  }
  if (!/^\d{6}$/.test(formData.pincode)) {
    errors.pincode = 'Pincode must be 6 digits';
    return false;
  }
  errors.pincode = '';
  return true;
};

const validateCity = () => {
  if (!formData.city) {
    errors.city = 'City is required';
    return false;
  }
  errors.city = '';
  return true;
};

const validatePan = () => {
  if (!formData.business_pancard) {
    errors.business_pancard = 'PAN number is required';
    return false;
  }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.business_pancard)) {
    errors.business_pancard = 'Invalid PAN format';
    return false;
  }
  errors.business_pancard = '';
  return true;
};

const validateGstNumber = () => {
  if (formData.isgstregistered && !formData.gst_number) {
    errors.gst_number = 'GST number is required';
    return false;
  }
  if (formData.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
    errors.gst_number = 'Invalid GST format';
    return false;
  }
  errors.gst_number = '';
  return true;
};

// GST Verification Functions
const resetGstVerification = () => {
  gstVerificationResult.verified = false;
  gstVerificationResult.legalName = '';
  gstVerificationResult.tradeName = '';
  gstVerificationResult.status = '';
  gstVerificationResult.registrationDate = '';
  gstVerificationResult.businessType = '';
  gstVerificationResult.state = '';
  gstVerificationResult.city = '';
  gstVerificationResult.pincode = '';
  gstVerificationResult.address = '';
  gstVerificationResult.suggestedBusinessType = '';
  gstVerificationResult.suggestedIndustryType = '';
  gstVerificationResult.suggestedRegistrationType = '';
  gstVerificationResult.confidence = '';
  gstVerificationResult.error = '';
};

const onGstNumberChange = () => {
  resetGstVerification();
  errors.gst_number = '';
};

const verifyGstNumber = async () => {
  if (!formData.gst_number || formData.gst_number.length !== 15) {
    toast.add({
      severity: 'warn',
      summary: 'Invalid GST',
      detail: 'Please enter a valid 15-digit GST number',
      life: 3000
    });
    return;
  }

  gstVerifying.value = true;
  resetGstVerification();

  try {
    // Call backend GST verification API
    const response = await api.post('/gst/verify', {
      gstNumber: formData.gst_number
    });

    if (response.data.success && response.data.data) {
      const gstData = response.data.data;
      
      // Populate verification result
      gstVerificationResult.verified = true;
      gstVerificationResult.legalName = gstData.legalName;
      gstVerificationResult.tradeName = gstData.tradeName;
      gstVerificationResult.status = gstData.status;
      gstVerificationResult.registrationDate = formatDate(gstData.registrationDate);
      gstVerificationResult.businessType = gstData.businessType;
      gstVerificationResult.state = gstData.state;
      gstVerificationResult.city = gstData.city || '';
      gstVerificationResult.pincode = gstData.pincode || '';
      gstVerificationResult.address = gstData.address;
      gstVerificationResult.suggestedBusinessType = gstData.suggestedBusinessType || '';
      gstVerificationResult.suggestedIndustryType = gstData.suggestedIndustryType || '';
      gstVerificationResult.suggestedRegistrationType = gstData.suggestedRegistrationType || '';
      gstVerificationResult.confidence = gstData.confidence || '';

      toast.add({
        severity: 'success',
        summary: 'GST Verified',
        detail: `${gstData.legalName} - GST number verified successfully`,
        life: 4000
      });
    } else {
      throw new Error(response.data.message || 'GST verification failed');
    }

  } catch (error) {
    console.error('GST verification error:', error);
    
    let errorMessage = 'Unable to verify GST number. Please check the number and try again.';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    gstVerificationResult.error = errorMessage;
    
    toast.add({
      severity: 'error',
      summary: 'Verification Failed',
      detail: errorMessage,
      life: 5000
    });
  } finally {
    gstVerifying.value = false;
  }
};

const autoFillFromGst = async () => {
  if (gstVerificationResult.verified) {
    let fieldsUpdated = [];
    
    // Auto-fill business name if empty
    if (!formData.business_name && gstVerificationResult.tradeName !== 'N/A') {
      formData.business_name = gstVerificationResult.tradeName;
      fieldsUpdated.push('Business Name');
    }
    
    // Auto-fill state if empty
    if (!formData.state && gstVerificationResult.state) {
      formData.state = gstVerificationResult.state;
      fieldsUpdated.push('State');
      
      // Load cities for the selected state
      await loadCitiesByState(gstVerificationResult.state);
    }
    
    // Auto-fill city if available from GST
    if (!formData.city && gstVerificationResult.city) {
      formData.city = gstVerificationResult.city;
      fieldsUpdated.push('City');
      
      // Load pincodes for the selected city and state
      if (gstVerificationResult.state) {
        await loadPincodesByCityAndState(gstVerificationResult.state, gstVerificationResult.city);
      }
    }
    
    // Auto-fill pincode if available from GST
    if (!formData.pincode && gstVerificationResult.pincode) {
      formData.pincode = gstVerificationResult.pincode;
      fieldsUpdated.push('Pincode');
    }
    
    // Auto-fill address if empty
    if (!formData.company_address_line1 && gstVerificationResult.address !== 'Address not available') {
      formData.company_address_line1 = gstVerificationResult.address;
      fieldsUpdated.push('Address');
    }

    // Try to extract PAN from GST number (characters 3-12)
    if (!formData.business_pancard && formData.gst_number) {
      const panFromGst = formData.gst_number.substring(2, 12);
      if (panFromGst.length === 10) {
        formData.business_pancard = panFromGst;
        fieldsUpdated.push('PAN Number');
      }
    }

    // Auto-select business type based on GST analysis
    if (!formData.business_type_id && gstVerificationResult.suggestedBusinessType) {
      const businessType = businessTypes.value.find(bt => bt.name === gstVerificationResult.suggestedBusinessType);
      if (businessType) {
        formData.business_type_id = businessType.id;
        fieldsUpdated.push('Business Type');
      }
    }

    // Auto-select industry type based on GST analysis
    if (!formData.industry_type_id && gstVerificationResult.suggestedIndustryType) {
      const industryType = industryTypes.value.find(it => it.name === gstVerificationResult.suggestedIndustryType);
      if (industryType) {
        formData.industry_type_id = industryType.id;
        fieldsUpdated.push('Industry Type');
      }
    }

    // Auto-select registration type based on GST analysis
    if (!formData.registration_type_id && gstVerificationResult.suggestedRegistrationType) {
      const registrationType = registrationTypes.value.find(rt => rt.name === gstVerificationResult.suggestedRegistrationType);
      if (registrationType) {
        formData.registration_type_id = registrationType.id;
        fieldsUpdated.push('Registration Type');
      }
    }

    if (fieldsUpdated.length > 0) {
      showAllFields.value = true; // Show all fields after auto-fill
      
      const confidenceText = gstVerificationResult.confidence === 'high' ? ' (High Confidence)' : 
                            gstVerificationResult.confidence === 'medium' ? ' (Medium Confidence)' : '';
      
      toast.add({
        severity: 'success',
        summary: 'Auto-filled Successfully' + confidenceText,
        detail: `Updated: ${fieldsUpdated.join(', ')}. Please review and complete the remaining fields.`,
        life: 5000
      });

      // Scroll to additional details
      setTimeout(() => {
        scrollToAdditionalDetails();
      }, 500);
    } else {
      toast.add({
        severity: 'info',
        summary: 'No Fields Updated',
        detail: 'All relevant fields are already filled',
        life: 2000
      });
    }
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

const validateForm = () => {
  clearErrors();
  
  const validations = [
    validateBusinessName(),
    validatePhone(),
    validateEmail(),
    validateAddress(),
    validatePincode(),
    validateCity(),
    validatePan(),
    validateGstNumber()
  ];

  // Check required dropdowns
  if (!formData.business_type_id) {
    errors.business_type_id = 'Business type is required';
    validations.push(false);
  }
  if (!formData.industry_type_id) {
    errors.industry_type_id = 'Industry type is required';
    validations.push(false);
  }
  if (!formData.registration_type_id) {
    errors.registration_type_id = 'Registration type is required';
    validations.push(false);
  }
  if (!formData.state) {
    errors.state = 'State is required';
    validations.push(false);
  }

  return validations.every(Boolean);
};

// Event handlers
const onGstRegistrationChange = () => {
  if (!formData.isgstregistered) {
    // Clear GST related data when user selects "No"
    formData.gst_number = '';
    resetGstVerification();
    showAllFields.value = true; // Show all fields immediately for manual entry
  } else {
    showAllFields.value = false; // Hide fields until GST is verified
  }
};

const loadCitiesByState = async (state) => {
  if (!state) {
    cities.value = [];
    return;
  }
  
  try {
    const response = await api.get(`/locations/cities/${encodeURIComponent(state)}`);
    cities.value = response.data.map(item => ({ 
      name: item.city.trim(), 
      value: item.city.trim() 
    }));
  } catch (error) {
    console.error('Error loading cities:', error);
    cities.value = [];
  }
};

const loadPincodesByCityAndState = async (state, city) => {
  if (!state || !city) {
    availablePincodes.value = [];
    return;
  }
  
  try {
    const response = await api.get(`/locations/pincodes/${encodeURIComponent(state)}/${encodeURIComponent(city)}`);
    availablePincodes.value = response.data.map(item => ({ 
      name: item.pincode.toString().trim(), 
      value: item.pincode.toString().trim() 
    }));
  } catch (error) {
    console.error('Error loading pincodes:', error);
    availablePincodes.value = [];
  }
};

const onStateChange = async () => {
  errors.state = '';
  formData.city = ''; // Clear city when state changes
  formData.pincode = ''; // Clear pincode when state changes
  cities.value = [];
  availablePincodes.value = [];
  
  if (formData.state) {
    await loadCitiesByState(formData.state);
  }
};

const onCityChange = async () => {
  errors.city = '';
  formData.pincode = ''; // Clear pincode when city changes
  availablePincodes.value = [];
  
  if (formData.state && formData.city) {
    await loadPincodesByCityAndState(formData.state, formData.city);
  }
};

const onPincodeChange = async () => {
  errors.pincode = '';
  
  // Auto-fill city and state if pincode is complete and valid
  if (formData.pincode && formData.pincode.length === 6) {
    try {
      const response = await api.get(`/locations/pincode/${formData.pincode}`);
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        
        // Auto-fill state if empty
        if (!formData.state && location.state) {
          formData.state = location.state;
          await loadCitiesByState(location.state);
        }
        
        // Auto-fill city if empty
        if (!formData.city && location.city) {
          formData.city = location.city;
          await loadPincodesByCityAndState(formData.state || location.state, location.city);
        }
        
        toast.add({
          severity: 'success',
          summary: 'Auto-filled from Pincode',
          detail: `Found: ${location.city}, ${location.state}`,
          life: 2000
        });
      }
    } catch (error) {
      console.error('Error looking up pincode:', error);
    }
  }
};

const scrollToAdditionalDetails = () => {
  if (additionalDetailsSection.value) {
    additionalDetailsSection.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const handleSignatureUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Handle file upload logic here
    formData.signature_path = file.name;
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Signature uploaded successfully',
      life: 2000
    });
  }
};

const addWebsite = () => {
  if (formData.website) {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Website added successfully',
      life: 2000
    });
  }
};

const createNewBusiness = () => {
  // This function is now renamed to resetForm for clarity
  resetForm();
};

const resetForm = () => {
  // Reset form for new business
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'boolean') {
      formData[key] = false;
    } else {
      formData[key] = '';
    }
  });
  clearErrors();
  resetGstVerification();
  toast.add({
    severity: 'info',
    summary: 'Form Reset',
    detail: 'Form has been cleared for new entry',
    life: 2000
  });
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.post('/businesses', formData);
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Business created successfully',
      life: 3000
    });

    // Reload the businesses list
    await loadOtherBusinesses();
    
    // Reset form for new business
    resetForm();

    // Show success message with option to continue or go back
    setTimeout(() => {
      toast.add({
        severity: 'info',
        summary: 'What\'s Next?',
        detail: 'Business created successfully! You can create another business or view all businesses.',
        life: 5000
      });
    }, 1000);

    // Optionally redirect to businesses list after some time
    // setTimeout(() => router.push('/businesses'), 3000);
  } catch (err) {
    console.error('Error creating business:', err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.message || 'Failed to create business',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Enhanced Modern UI Styles */
.business-settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.business-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    0 10px 20px rgba(0,0,0,0.05),
    inset 0 1px 0 rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}

.business-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #007bff, #6610f2, #6f42c1, #e83e8c, #fd7e14);
  border-radius: 20px 20px 0 0;
}

/* GST Priority Section Enhanced */
.gst-priority-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.gst-priority-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
}

.gst-priority-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #007bff15 0%, #6610f215 50%, #28a74515 100%);
  border-radius: 16px;
  opacity: 0.7;
}

.priority-icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ffc107, #fd7e14);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);
  animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

.bg-light-info {
  background: linear-gradient(135deg, #d1ecf115 0%, #bee5eb15 100%) !important;
  border-left: 4px solid #17a2b8;
}

/* GST Option Cards */
.gst-option-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 15px;
}

.gst-option-card {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.gst-option-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.gst-option-card.active {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0,123,255,0.2);
}

.gst-option-card.active .gst-option-label {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.gst-option-label {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border: 2px solid #e9ecef;
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.gst-option-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s ease;
}

.gst-option-card:hover .gst-option-label::before {
  left: 100%;
}

.gst-option-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.5rem;
}

.gst-option-icon.success {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
}

.gst-option-icon.secondary {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  box-shadow: 0 8px 20px rgba(108, 117, 125, 0.3);
}

.gst-option-content {
  flex: 1;
}

.gst-option-badge {
  margin-left: auto;
}

/* GST Input Section */
.gst-input-section {
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-radius: 15px;
  border: 2px dashed #007bff;
  margin-top: 20px;
}

.gst-input-wrapper {
  position: relative;
}

.gst-input {
  border: 3px solid #e9ecef !important;
  border-radius: 15px !important;
  padding: 15px 20px !important;
  font-size: 1.1rem !important;
  font-family: 'Courier New', monospace !important;
  letter-spacing: 1px !important;
  transition: all 0.3s ease !important;
  background: rgba(255,255,255,0.9) !important;
}

.gst-input:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  transform: translateY(-2px) !important;
}

.gst-input.is-valid {
  border-color: #28a745 !important;
  background: linear-gradient(135deg, #d4edda, #c3e6cb) !important;
}

.gst-input-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
}

.gst-help-text {
  background: rgba(255, 193, 7, 0.1);
  padding: 10px 15px;
  border-radius: 10px;
  border-left: 4px solid #ffc107;
}

.verify-btn {
  border-radius: 15px !important;
  padding: 15px 25px !important;
  background: linear-gradient(135deg, #28a745, #20c997) !important;
  border: none !important;
  box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3) !important;
  transition: all 0.3s ease !important;
}

.verify-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 15px 30px rgba(40, 167, 69, 0.4) !important;
}

/* GST Verification Success Enhanced */
.gst-verification-success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 2px solid #28a745;
  animation: successSlideIn 0.5s ease-out;
}

@keyframes successSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #28a74520, #20c99720, #17a2b820);
  border-radius: 16px;
}

.success-icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.verification-details-card {
  border: 1px solid rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
}

.detail-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.detail-item:last-child {
  border-bottom: none;
}

/* Smart Suggestions Enhanced */
.smart-suggestions-card {
  background: linear-gradient(135deg, #ffc107, #fd7e14) !important;
  border: 2px solid #ffc107;
  animation: suggestionPulse 2s ease-in-out infinite;
}

@keyframes suggestionPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
}

.suggestion-icon-wrapper {
  width: 30px;
  height: 30px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestion-item {
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.3);
}

.suggestion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Enhanced Buttons */
.auto-fill-btn {
  background: linear-gradient(135deg, #28a745, #20c997) !important;
  border: none !important;
  border-radius: 15px !important;
  padding: 15px 25px !important;
  box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3) !important;
  transition: all 0.3s ease !important;
}

.auto-fill-btn:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 15px 30px rgba(40, 167, 69, 0.4) !important;
}

.continue-btn {
  border-radius: 15px !important;
  padding: 15px 25px !important;
  transition: all 0.3s ease !important;
}

.continue-btn:hover {
  transform: translateY(-2px) !important;
}

/* Form Group Enhancements */
.form-group label {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.form-group label i {
  margin-right: 8px;
  color: #007bff;
}

/* Enhanced Dropdowns */
:deep(.p-dropdown) {
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  min-height: 50px !important;
  background: rgba(255,255,255,0.9) !important;
  backdrop-filter: blur(5px) !important;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #007bff !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15) !important;
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #007bff !important;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  transform: translateY(-2px) !important;
}

:deep(.p-dropdown.is-invalid) {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 0.2rem rgba(229, 62, 62, 0.15) !important;
}

:deep(.p-dropdown-panel) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  margin-top: 8px !important;
  max-height: 350px !important;
  backdrop-filter: blur(10px) !important;
  background: rgba(255,255,255,0.95) !important;
}

:deep(.p-dropdown-items) {
  padding: 8px 0 !important;
}

:deep(.p-dropdown-item) {
  padding: 12px 16px !important;
  font-size: 0.9rem !important;
  transition: all 0.2s ease !important;
  border: none !important;
  margin: 2px 8px !important;
  border-radius: 8px !important;
}

:deep(.p-dropdown-item:hover) {
  background: linear-gradient(135deg, #f7fafc, #edf2f7) !important;
  transform: translateX(4px) !important;
}

:deep(.p-dropdown-item.p-highlight) {
  background: linear-gradient(135deg, #007bff, #0056b3) !important;
  color: white !important;
  transform: translateX(4px) !important;
}

:deep(.p-dropdown-filter-container) {
  padding: 16px !important;
  border-bottom: 1px solid #e2e8f0 !important;
  background: linear-gradient(135deg, #f7fafc, #edf2f7) !important;
}

:deep(.p-dropdown-filter) {
  width: 100% !important;
  padding: 12px 16px !important;
  border: 2px solid #e2e8f0 !important;
  border-radius: 10px !important;
  font-size: 0.9rem !important;
  background: white !important;
  transition: all 0.3s ease !important;
}

:deep(.p-dropdown-filter:focus) {
  border-color: #007bff !important;
  box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25) !important;
  outline: none !important;
}

:deep(.p-dropdown-label.p-placeholder) {
  color: #a0aec0 !important;
  font-style: normal !important;
}

/* Enhanced Input Styling */
.form-control {
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  transition: all 0.3s ease !important;
  background: rgba(255,255,255,0.9) !important;
  backdrop-filter: blur(5px) !important;
}

.form-control:focus {
  border-color: #007bff !important;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  transform: translateY(-1px) !important;
}

.form-control.is-invalid {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 0.2rem rgba(229, 62, 62, 0.15) !important;
}

.form-control.is-valid {
  border-color: #38a169 !important;
  background: linear-gradient(135deg, #f0fff4, #c6f6d5) !important;
}

/* Error Messages */
.text-danger {
  font-size: 0.85rem;
  color: #e53e3e !important;
  display: flex;
  align-items: center;
  margin-top: 5px;
}

/* Enhanced Toggle Buttons */
:deep(.p-togglebutton) {
  border: 2px solid #e2e8f0 !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
  padding: 8px 16px !important;
}

:deep(.p-togglebutton:not(.p-disabled):hover) {
  border-color: #007bff !important;
  transform: translateY(-1px) !important;
}

:deep(.p-togglebutton.p-highlight) {
  background: linear-gradient(135deg, #007bff, #0056b3) !important;
  border-color: #007bff !important;
  color: white !important;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3) !important;
}

/* Other Businesses Section */
.other-businesses-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.2);
}

.business-card {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.business-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,123,255,0.1), transparent);
  transition: left 0.5s ease;
}

.business-card:hover::before {
  left: 100%;
}

.business-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  border-color: #007bff;
}

.business-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.2));
  border-radius: 15px;
  transition: all 0.3s ease;
}

.business-card:hover .business-icon {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  transform: scale(1.1);
}

/* Signature Upload Area */
.signature-upload-area {
  border: 3px dashed #007bff;
  border-radius: 15px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.signature-upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,123,255,0.1), transparent);
  transition: left 0.5s ease;
}

.signature-upload-area:hover::before {
  left: 100%;
}

.signature-upload-area:hover {
  border-color: #0056b3;
  background: linear-gradient(135deg, #e3f2fd, #f0f8ff);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 123, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .gst-option-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .business-form {
    padding: 25px;
    border-radius: 15px;
  }
  
  .gst-priority-section {
    padding: 20px;
  }
  
  .priority-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .verification-details-card .row {
    flex-direction: column;
  }
  
  .verification-details-card .col-md-6 {
    margin-bottom: 1rem;
  }
}

/* Loading and Animation States */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Z-index utilities */
.z-index-1 { z-index: 1; }
.z-index-2 { z-index: 2; }
.z-index-3 { z-index: 3; }
</style>

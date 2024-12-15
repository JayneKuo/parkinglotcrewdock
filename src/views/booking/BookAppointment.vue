<template>
  <div class="book-appointment">
    <!-- Main navigation -->
    <div class="main-nav">
      <!-- Main nav content -->
    </div>

    <!-- Sub navigation -->
    <div class="booking-nav">
      <div class="nav-content">
        <div class="nav-left">
          <button class="back-btn" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </button>
          <div class="nav-title">Book Appointment</div>
        </div>
        <div class="progress-steps">
          <div class="step completed">
            <div class="step-icon">
              <el-icon><Check /></el-icon>
            </div>
            <span>Warehouse</span>
          </div>
          <div class="step" :class="{ completed: currentStep === 'datetime' || currentStep === 'details', active: currentStep === 'loadtype' }">
            <div class="step-icon">
              <template v-if="currentStep === 'datetime' || currentStep === 'details'">
                <el-icon><Check /></el-icon>
              </template>
              <template v-else>2</template>
            </div>
            <span>Loadtype</span>
          </div>
          <div class="step" :class="{ completed: currentStep === 'details', active: currentStep === 'datetime' }">
            <div class="step-icon">
              <template v-if="currentStep === 'details'">
                <el-icon><Check /></el-icon>
              </template>
              <template v-else>3</template>
            </div>
            <span>Date & Time</span>
          </div>
          <div class="step" :class="{ active: currentStep === 'details' }">
            <div class="step-icon">4</div>
            <span>Details</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="main-content">
      <!-- Left panel -->
      <div class="left-panel">
        <div class="warehouse-info">
          <div class="warehouse-header">
            <h2>FC: STOCKTON #748</h2>
          </div>

          <div class="info-section">
            <div class="info-item">
              <div class="info-header">
                <el-icon class="header-icon"><Location /></el-icon>
                Address
              </div>
              <div class="info-content">
                4510 Alitalia Ave, Stockton, CA 95206
                <el-button link class="copy-btn">
                  <el-icon><DocumentCopy /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <div class="info-section" v-if="selectedType">
            <div class="info-item">
              <div class="info-header">
                <el-icon class="header-icon"><Van /></el-icon>
                Load Type
              </div>
              <div class="info-content">
                <div class="selected-value">{{ selectedType }}</div>
              </div>
            </div>
          </div>

          <div class="info-section" v-if="selectedBillingType">
            <div class="info-item">
              <div class="info-header">
                <el-icon class="header-icon"><Wallet /></el-icon>
                <span>Billing Type</span>
              </div>
              <div class="info-content">
                <div class="selected-value">{{ getBillingTypeName }}</div>
                <template v-if="selectedDuration">
                  <div class="selected-value price">{{ getDisplayPrice }}</div>
                  <div class="duration">{{ getDisplayDuration }}</div>
                </template>
              </div>
            </div>
          </div>

          <div class="info-section" v-if="selectedDateTime">
            <div class="info-item">
              <div class="info-header">
                <el-icon class="header-icon"><Calendar /></el-icon>
                Appointment Time
              </div>
              <div class="info-content">
                <div class="selected-value">{{ formatDate(selectedDateTime) }}</div>
                <div class="selected-value">{{ formatTime(selectedDateTime) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right panel -->
      <div class="right-panel">
        <template v-if="currentStep === 'loadtype'">
          <div class="panel-header">
            <h2>Select a load type</h2>
          </div>

          <div class="load-types">
            <div 
              class="load-type-item"
              :class="{ active: selectedType === 'Inbound' }"
              @click="selectType('Inbound')"
            >
              <div class="item-header">
                <div class="item-name">
                  <el-icon><Van /></el-icon>
                  Inbound
                </div>
              </div>
              <div class="item-description">
                Delivery of goods to the warehouse, including receiving and unloading operations.
              </div>
            </div>

            <div 
              class="load-type-item"
              :class="{ active: selectedType === 'Outbound' }"
              @click="selectType('Outbound')"
            >
              <div class="item-header">
                <div class="item-name">
                  <el-icon><Van /></el-icon>
                  Outbound
                </div>
              </div>
              <div class="item-description">
                Shipping goods from the warehouse, including loading and dispatch operations.
              </div>
            </div>
          </div>

          <div class="panel-section">
            <div class="panel-header">
              <h2>Select billing type</h2>
            </div>

            <div class="billing-types">
              <div 
                class="billing-type-item"
                :class="{ active: selectedBillingType === 'hourly' }"
                @click="selectBillingType('hourly')"
              >
                <div class="item-content">
                  <div class="item-header">
                    <div class="item-name">
                      <el-icon><Timer /></el-icon>
                      Hourly Rate
                    </div>
                    <div class="price">$50</div>
                  </div>
                  <div class="item-description">
                    <div class="billing-details">
                      <span class="time">8 hours</span>
                      <span class="rate">$50 per appointment</span>
                    </div>
                    <div class="billing-note">Best for single appointment</div>
                  </div>
                </div>
              </div>

              <div 
                class="billing-type-item"
                :class="{ active: selectedBillingType === 'daily' }"
                @click="selectBillingType('daily')"
              >
                <div class="item-content">
                  <div class="item-header">
                    <div class="item-name">
                      <el-icon><Calendar /></el-icon>
                      Daily Rate
                    </div>
                    <div class="price">$200</div>
                  </div>
                  <div class="item-description">
                    <div class="billing-details">
                      <span class="time">24 hours</span>
                      <span class="rate">$200 per day</span>
                    </div>
                    <div class="billing-note">Flexible for multiple appointments</div>
                  </div>
                </div>
              </div>

              <div 
                class="billing-type-item"
                :class="{ active: selectedBillingType === 'weekly' }"
                @click="selectBillingType('weekly')"
              >
                <div class="item-content">
                  <div class="item-header">
                    <div class="item-name">
                      <el-icon><Calendar /></el-icon>
                      Weekly Rate
                    </div>
                    <div class="price">$500</div>
                  </div>
                  <div class="item-description">
                    <div class="billing-details">
                      <span class="time">7 days</span>
                      <span class="rate">$500 per week</span>
                    </div>
                    <div class="billing-note">Great for weekly operations</div>
                  </div>
                </div>
              </div>

              <div 
                class="billing-type-item"
                :class="{ active: selectedBillingType === 'monthly' }"
                @click="selectBillingType('monthly')"
              >
                <div class="item-content">
                  <div class="item-header">
                    <div class="item-name">
                      <el-icon><Box /></el-icon>
                      Monthly Rate
                    </div>
                    <div class="price">$1000</div>
                  </div>
                  <div class="item-description">
                    <div class="billing-details">
                      <span class="time">30 days</span>
                      <span class="rate">$1000 per month</span>
                    </div>
                    <div class="billing-note">Most economical for regular use</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-if="currentStep === 'datetime'">
          <div class="panel-header">
            <h2>Select appointment time</h2>
          </div>

          <div class="datetime-selection">
            <div class="picker-container">
              <div class="picker-item">
                <div class="picker-label">Date</div>
                <el-date-picker
                  v-model="selectedDate"
                  type="date"
                  placeholder="Select date"
                  :disabled-date="disabledDate"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  size="large"
                  class="date-picker"
                />
              </div>
              
              <div class="picker-item">
                <div class="picker-label">Time</div>
                <el-time-picker
                  v-model="selectedTime"
                  format="HH:mm"
                  placeholder="Select time"
                  :disabled="!selectedDate"
                  :step="900"
                  size="large"
                  class="time-picker"
                />
              </div>

              <div class="picker-item">
                <div class="picker-label">Estimated Duration</div>
                <el-select
                  v-model="selectedDuration"
                  placeholder="Select duration"
                  size="large"
                  class="duration-select"
                  :disabled="!selectedBillingType"
                >
                  <el-option
                    v-for="duration in getDurationOptions"
                    :key="duration.value"
                    :label="duration.label"
                    :value="duration.value"
                  />
                </el-select>
              </div>
            </div>

            <div class="appointment-tips" v-if="selectedDateTime">
              <div class="tip-item">
                <el-icon class="tip-icon"><AlarmClock /></el-icon>
                <span>Please arrive on time for your appointment</span>
              </div>
              <div class="tip-item">
                <el-icon class="tip-icon"><Warning /></el-icon>
                <span>Late arrivals may result in appointment cancellation</span>
              </div>
              <div class="tip-item">
                <el-icon class="tip-icon"><Document /></el-icon>
                <span>Have your booking confirmation ready upon arrival</span>
              </div>
            </div>
          </div>
        </template>

        <template v-if="currentStep === 'details'">
          <div class="panel-header">
            <h2>Enter appointment details</h2>
          </div>

          <div class="details-form">
            <!-- 司机信息部分 -->
            <div class="form-section">
              <div class="section-header">
                <el-icon class="section-icon"><User /></el-icon>
                <h3 class="section-title">Driver Information</h3>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <div class="form-label">
                    Carrier
                    <span class="required">*</span>
                  </div>
                  <el-input 
                    v-model="driverInfo.carrier" 
                    placeholder="Enter carrier name"
                    size="large"
                  />
                </div>
                <div class="form-item">
                  <div class="form-label">
                    Driver Name
                    <span class="required">*</span>
                  </div>
                  <el-input 
                    v-model="driverInfo.name" 
                    placeholder="Enter driver name"
                    size="large"
                  />
                </div>
                <div class="form-item">
                  <div class="form-label">
                    Driver Phone
                    <span class="required">*</span>
                  </div>
                  <el-input 
                    v-model="driverInfo.phone" 
                    placeholder="Enter driver phone"
                    size="large"
                  />
                </div>
                <div class="form-item">
                  <div class="form-label">
                    License Plate
                    <span class="required">*</span>
                  </div>
                  <el-input 
                    v-model="driverInfo.licensePlate" 
                    placeholder="Enter license plate"
                    size="large"
                  />
                </div>
              </div>
            </div>

            <!-- 货物信息部分 -->
            <div class="form-section">
              <div class="section-header">
                <el-icon class="section-icon"><Box /></el-icon>
                <h3 class="section-title">Cargo Information</h3>
              </div>
              <div class="form-grid">
                <div class="form-item">
                  <div class="form-label">
                    Cargo Type
                    <span class="required">*</span>
                  </div>
                  <el-select 
                    v-model="cargoInfo.type" 
                    placeholder="Select cargo type"
                    size="large"
                    class="full-width"
                  >
                    <el-option-group label="General Cargo">
                      <el-option label="Palletized Goods" value="palletized" />
                      <el-option label="Boxes & Cartons" value="boxes" />
                      <el-option label="Loose Cargo" value="loose" />
                      <el-option label="Mixed Load" value="mixed" />
                    </el-option-group>
                    
                    <el-option-group label="Special Cargo">
                      <el-option label="Temperature Controlled" value="temperature" />
                      <el-option label="Frozen Goods" value="frozen" />
                      <el-option label="Refrigerated" value="refrigerated" />
                      <el-option label="Perishables" value="perishables" />
                    </el-option-group>
                    
                    <el-option-group label="Dangerous Goods">
                      <el-option label="Hazardous Materials" value="hazmat" />
                      <el-option label="Flammable" value="flammable" />
                      <el-option label="Corrosive" value="corrosive" />
                      <el-option label="Chemicals" value="chemicals" />
                    </el-option-group>
                    
                    <el-option-group label="Heavy Cargo">
                      <el-option label="Machinery" value="machinery" />
                      <el-option label="Construction Materials" value="construction" />
                      <el-option label="Metal Products" value="metal" />
                      <el-option label="Heavy Equipment" value="equipment" />
                    </el-option-group>
                    
                    <el-option-group label="Retail & Consumer Goods">
                      <el-option label="Electronics" value="electronics" />
                      <el-option label="Furniture" value="furniture" />
                      <el-option label="Textiles" value="textiles" />
                      <el-option label="Food & Beverages" value="food" />
                      <el-option label="Household Goods" value="household" />
                    </el-option-group>
                    
                    <el-option-group label="Others">
                      <el-option label="Express Parcels" value="express" />
                      <el-option label="Mail & Post" value="mail" />
                      <el-option label="Documents" value="documents" />
                      <el-option label="Samples" value="samples" />
                      <el-option label="Other" value="other" />
                    </el-option-group>
                  </el-select>
                </div>
                <div class="form-item">
                  <div class="form-label">
                    PO Number
                  </div>
                  <el-input 
                    v-model="cargoInfo.poNumber" 
                    placeholder="Enter PO number"
                    size="large"
                  />
                </div>
                <div class="form-item">
                  <div class="form-label">
                    Weight (kg)
                    <span class="required">*</span>
                  </div>
                  <el-input-number 
                    v-model="cargoInfo.weight" 
                    :min="0"
                    :precision="2"
                    placeholder="Enter weight"
                    size="large"
                    class="full-width"
                    controls-position="right"
                  />
                </div>
                <div class="form-item">
                  <div class="form-label">
                    Number of Pallets
                    <span class="required">*</span>
                  </div>
                  <el-input-number 
                    v-model="cargoInfo.pallets" 
                    :min="1"
                    :precision="0"
                    placeholder="Enter number of pallets"
                    size="large"
                    class="full-width"
                    controls-position="right"
                  />
                </div>
                <div class="form-item full-width">
                  <div class="form-label">
                    Description
                  </div>
                  <el-input 
                    v-model="cargoInfo.description" 
                    type="textarea" 
                    :rows="4"
                    placeholder="Enter cargo description (optional)"
                    resize="none"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="action-buttons">
          <el-button @click="goBack">Back</el-button>
          <el-button 
            type="primary" 
            :disabled="!canProceed"
            @click="nextStep"
          >
            {{ currentStep === 'details' ? 'Confirm Booking' : 'Next' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.book-appointment {
  min-height: 100vh;
  background: #f8f9fa;

  .main-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: white;
    border-bottom: 1px solid #eee;
    z-index: 20;
  }

  .booking-nav {
    position: fixed;
    top: 88px;
    left: 0;
    right: 0;
    height: 64px;
    background: white;
    border-bottom: 1px solid #eee;
    z-index: 10;

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .back-btn {
        padding: 0;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          color: #6366f1;
        }
      }

      .nav-title {
        font-size: 15px;
        font-weight: 500;
        color: #1a1a1a;
      }
    }

    .progress-steps {
      display: flex;
      align-items: center;
      gap: 24px;

      .step {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #999;
        font-size: 14px;

        .step-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f5f5f5;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        &.completed {
          color: #6366f1;
          .step-icon {
            background: #6366f1;
            color: white;
          }
        }

        &.active {
          color: #6366f1;
          .step-icon {
            background: #6366f1;
            color: white;
          }
        }

        &:not(:last-child):after {
          content: '';
          display: block;
          width: 16px;
          height: 1px;
          background: #eee;
          margin-left: 8px;
        }
      }
    }
  }

  .main-content {
    padding-top: 176px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
    padding-bottom: 40px;
  }

  .warehouse-info {
    background: white;
    border-radius: 8px;
    padding: 24px;

    .warehouse-header {
      margin-bottom: 20px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .info-section {
      padding: 20px 0;
      border-bottom: 1px solid #f0f0f0;

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
        border-bottom: none;
      }
    }

    .info-item {
      .info-header {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 14px;
        margin-bottom: 12px;

        .header-icon {
          margin-right: 8px;
          font-size: 16px;
        }
      }

      .info-content {
        color: #1a1a1a;
        font-size: 15px;
        line-height: 1.4;

        .selected-value {
          color: #6366f1;
          font-weight: 600;
          
          &.price {
            font-size: 20px;
            margin-top: 8px;
          }
        }

        .duration {
          font-size: 14px;
          color: #666;
          margin-top: 4px;
        }
      }

      .copy-btn {
        padding: 4px;
        margin-left: 4px;
        color: #666;

        &:hover {
          color: #6366f1;
        }

        .el-icon {
          font-size: 14px;
        }
      }
    }
  }

  .right-panel {
    background: white;
    border-radius: 8px;
    padding: 24px;

    .panel-header {
      margin-bottom: 24px;

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .load-types {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .load-type-item {
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #6366f1;
      }

      &.active {
        border-color: #6366f1;
        background: #f5f6ff;
      }

      .item-header {
        margin-bottom: 12px;

        .item-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;

          .el-icon {
            color: #6366f1;
          }
        }
      }

      .item-description {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }

    .panel-section {
      margin-top: 32px;
    }

    .billing-types {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .billing-type-item {
      border: 1px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 100%;

      &:hover {
        border-color: #6366f1;
      }

      &.active {
        border-color: #6366f1;
        background: #f5f6ff;
      }

      .item-content {
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .item-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;

          .el-icon {
            color: #6366f1;
            font-size: 20px;
          }
        }

        .price {
          font-size: 24px;
          font-weight: 600;
          color: #6366f1;
        }
      }

      .item-description {
        flex: 1;
      }

      .billing-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;

        .time {
          color: #1a1a1a;
          font-weight: 500;
        }

        .rate {
          color: #666;
        }
      }

      .billing-note {
        font-size: 13px;
        color: #666;
        font-style: italic;
      }
    }
  }

  .action-buttons {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .el-button {
      min-width: 88px;

      &--primary {
        background-color: #6366f1;
        border-color: #6366f1;

        &:hover {
          background-color: #4f46e5;
          border-color: #4f46e5;
        }
      }
    }
  }

  .datetime-selection {
    background: white;
    border-radius: 8px;
    padding: 32px;

    .picker-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    .picker-item {
      .duration-select {
        width: 100%;
      }

      :deep(.el-input__wrapper) {
        padding: 4px 11px;
      }

      :deep(.el-input__inner) {
        font-size: 15px;
        height: 42px;
      }
    }

    .appointment-tips {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #6366f1;

      .tip-item {
        display: flex;
        align-items: center;
        color: #1a1a1a;
        font-size: 14px;

        & + .tip-item {
          margin-top: 12px;
        }

        .tip-icon {
          color: #6366f1;
          margin-right: 8px;
          font-size: 16px;
        }
      }
    }
  }

  .details-form {
    background: white;
    border-radius: 8px;
    padding: 32px;

    .form-section {
      & + .form-section {
        margin-top: 40px;
        padding-top: 40px;
        border-top: 1px solid #f0f0f0;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 28px;

        .section-icon {
          font-size: 20px;
          color: #6366f1;
        }

        .section-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
      }

      .form-item {
        &.full-width {
          grid-column: span 2;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 8px;

          .required {
            color: #ff4d4f;
            margin-left: 4px;
          }
        }

        .full-width {
          width: 100%;
        }

        :deep(.el-input__wrapper),
        :deep(.el-textarea__inner) {
          box-shadow: 0 0 0 1px #e5e7eb;
          
          &:hover {
            box-shadow: 0 0 0 1px #6366f1;
          }
          
          &.is-focus {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          }
        }

        :deep(.el-input__inner) {
          height: 42px;
          font-size: 14px;
        }

        :deep(.el-textarea__inner) {
          font-size: 14px;
          padding: 8px 12px;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  DocumentCopy, 
  Van, 
  ArrowLeft, 
  Check,
  Location,
  Timer,
  Calendar,
  Box,
  Wallet,
  AlarmClock,
  Warning,
  Document,
  User
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const selectedType = ref('')
const selectedBillingType = ref('')
const currentStep = ref('loadtype')
const selectedDate = ref('')
const selectedTime = ref('')
const selectedDuration = ref('')

const selectedDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return null
  const timeString = dayjs(selectedTime.value).format('HH:mm')
  return `${selectedDate.value} ${timeString}`
})

const billingTypes = {
  hourly: {
    name: 'Hourly Rate',
    price: '50',
    duration: '8 hours per appointment',
    unit: 'hour'
  },
  daily: {
    name: 'Daily Rate',
    price: '200',
    duration: '24 hours access',
    unit: 'day'
  },
  weekly: {
    name: 'Weekly Rate',
    price: '500',
    duration: '7 days continuous access',
    unit: 'week'
  },
  monthly: {
    name: 'Monthly Rate',
    price: '1000',
    duration: '30 days unlimited access',
    unit: 'month'
  }
} as const

type BillingType = keyof typeof billingTypes

const getBillingTypeName = computed(() => {
  return selectedBillingType.value ? billingTypes[selectedBillingType.value as BillingType].name : ''
})

const getBillingTypePrice = computed(() => {
  return selectedBillingType.value ? `$${billingTypes[selectedBillingType.value as BillingType].price}` : ''
})

const getBillingTypeDuration = computed(() => {
  return selectedBillingType.value ? billingTypes[selectedBillingType.value as BillingType].duration : ''
})

const selectType = (type: string) => {
  selectedType.value = type
}

const selectBillingType = (type: string) => {
  selectedBillingType.value = type
}

const goBack = () => {
  if (currentStep.value === 'datetime') {
    currentStep.value = 'loadtype'
  } else if (currentStep.value === 'details') {
    currentStep.value = 'datetime'
  } else {
    router.back()
  }
}

const nextStep = async () => {
  if (currentStep.value === 'loadtype') {
    currentStep.value = 'datetime'
  } else if (currentStep.value === 'datetime') {
    currentStep.value = 'details'
  } else if (currentStep.value === 'details') {
    try {
      // 构造预约数据
      const appointmentData = {
        loadType: selectedType.value,
        billingType: selectedBillingType.value,
        dateTime: selectedDateTime.value,
        duration: selectedDuration.value,
        driverInfo: driverInfo.value,
        cargoInfo: cargoInfo.value,
        status: 'scheduled',
        confirmationNumber: generateConfirmationNumber(),
        id: generateUUID()
      }

      // 这里应该调用API保存数据
      // await saveAppointment(appointmentData)

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 跳转到详情页面
      router.push({
        name: 'AppointmentDetail',
        params: { id: appointmentData.id },
        state: { appointmentData } // 传递数据到详情页面
      })
    } catch (error) {
      ElMessage.error('Failed to create appointment. Please try again.')
    }
  }
}

// 生成确认号
const generateConfirmationNumber = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

// 生成UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 禁用今天之前的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7
}

const formatDate = (dateTime: string | null) => {
  if (!dateTime) return ''
  return dayjs(dateTime).format('MMMM D, YYYY')
}

const formatTime = (dateTime: string | null) => {
  if (!dateTime) return ''
  return dayjs(dateTime).format('HH:mm')
}

// 根据计费类型生成停留时长选项
const getDurationOptions = computed(() => {
  if (!selectedBillingType.value) return []

  switch (selectedBillingType.value) {
    case 'hourly':
      return [
        { value: '1', label: '1 hour' },
        { value: '2', label: '2 hours' },
        { value: '3', label: '3 hours' },
        { value: '4', label: '4 hours' },
        { value: '6', label: '6 hours' },
        { value: '8', label: '8 hours' }
      ]
    case 'daily':
      return [
        { value: '1', label: '1 day' },
        { value: '2', label: '2 days' },
        { value: '3', label: '3 days' }
      ]
    case 'weekly':
      return [
        { value: '1', label: '1 week' },
        { value: '2', label: '2 weeks' }
      ]
    case 'monthly':
      return [
        { value: '1', label: '1 month' },
        { value: '2', label: '2 months' },
        { value: '3', label: '3 months' }
      ]
    default:
      return []
  }
})

// 监听计费类型变化，重置停留时长
watch(selectedBillingType, () => {
  selectedDuration.value = ''
})

// 计算最终价格
const finalPrice = computed(() => {
  if (!selectedBillingType.value || !selectedDuration.value) return null

  const basePrice = billingTypes[selectedBillingType.value as keyof typeof billingTypes].price
  return Number(basePrice) * Number(selectedDuration.value)
})

// 在左侧信息区域显示最终价格
const getDisplayPrice = computed(() => {
  if (!finalPrice.value) return ''
  return `$${finalPrice.value}`
})

// 在左侧信息区域显示时，包含时长信息
const getDisplayDuration = computed(() => {
  if (!selectedBillingType.value || !selectedDuration.value) return ''
  const unit = billingTypes[selectedBillingType.value as keyof typeof billingTypes].unit
  return `${selectedDuration.value} ${unit}${Number(selectedDuration.value) > 1 ? 's' : ''}`
})

// 司机信息
const driverInfo = ref({
  carrier: '',
  name: '',
  phone: '',
  licensePlate: ''
})

// 货物信息
const cargoInfo = ref({
  type: '',
  poNumber: '',
  weight: null as number | null,
  pallets: null as number | null,
  description: ''
})

// 验证表单是否填写完整
const isDetailsValid = computed(() => {
  const { carrier, name, phone, licensePlate } = driverInfo.value
  const { type, weight, pallets } = cargoInfo.value
  
  return (
    carrier &&
    name &&
    phone &&
    licensePlate &&
    type &&
    weight !== null &&
    weight > 0 &&
    pallets !== null &&
    pallets > 0
  )
})

// 修改 canProceed 计算属性
const canProceed = computed(() => {
  if (currentStep.value === 'loadtype') {
    return selectedType.value && selectedBillingType.value
  } else if (currentStep.value === 'datetime') {
    return selectedDateTime.value && selectedDuration.value
  } else if (currentStep.value === 'details') {
    return isDetailsValid.value
  }
  return false
})
</script> 
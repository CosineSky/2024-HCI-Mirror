<script setup>
const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  background: {
    type: Boolean,
    default: false
  },
  layout: {
    type: String,
    default: 'prev, pager, next'
  }
})

const emit = defineEmits(['size-change', 'current-change'])
</script>

<template>
  <div class="box">
    <el-pagination
        @size-change="emit('size-change', $event)"
        @current-change="emit('current-change', $event)"
        :current-page="currentPage"
        :page-size="pageSize"
        :background="background"
        :layout="layout"
        :total="total"
    />
  </div>
</template>

<style lang="less" scoped>
.box {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.el-pagination {
  :deep(button) {
    background-color: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    transition: 0.3s;
    color: white !important;

    &:hover:not(button:disabled) {
      background-color: rgba(255, 255, 255, 0.08) !important;
    }
  }

  :deep(button:disabled) {
    cursor: auto !important;
  }
}

:deep(.el-pager) {
  .is-active.number {
    background-color: rgb(236,65,65) !important;
    color: white;
  }

  .more {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgb(210,210,210) !important;
  }

  .number {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgb(210,210,210) !important;
    transition: 0.3s;

    &:hover:not(.is-active) {
      background-color: rgba(220, 55, 55, 0.5) !important;
      color: white;
    }
  }
}
</style>

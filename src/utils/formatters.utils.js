const UZ_STATUS_MAP = {
  APPROVED: 'Tasdiqlangan',
  PENDING: 'Kutilmoqda',
  PROCESSING: 'Ishlanmoqda',
  SHIPPED: "Jo'natilgan",
  DELIVERED: 'Etkazib berildi',
  CANCELLED: 'Bekor qilindi',
  DRAFT: 'Qoralama',
  SCHEDULED: 'Rejalashtirilgan',
  IN_PROGRESS: 'Jarayonda',
  QUALITY_CHECK: 'Sifat nazorati',
  COMPLETED: 'Bajarildi',
  ACTIVE: 'Faol',
  IN_STOCK: 'Omborda bor',
  LOW_STOCK: 'Kam qoldi',
  OUT_OF_STOCK: 'Tugagan',
  REJECTED: 'Rad etildi',
};

export const formatNumber = (num, decimals = 2) => {
  const parsed = Number(num);
  if (isNaN(parsed)) return '0';
  return new Intl.NumberFormat('uz-UZ', {
    maximumFractionDigits: decimals,
  }).format(parsed);
};

export const formatPercentage = (num) => {
  const parsed = Number(num);
  if (isNaN(parsed)) return '0%';
  return `${parsed >= 0 ? '+' : ''}${parsed.toFixed(1)}%`;
};

export const formatStatusName = (status = '') => {
  const upper = status.toUpperCase();
  if (UZ_STATUS_MAP[upper]) {
    return UZ_STATUS_MAP[upper];
  }
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

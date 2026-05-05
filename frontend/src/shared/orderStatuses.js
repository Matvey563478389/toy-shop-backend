export const ORDER_STATUS_LABELS = {
  pending: 'Принят',
  processing: 'Собираем',
  ready_for_pickup: 'Готов к выдаче',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

export function orderStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] || status;
}

export function orderStatusChipColor(status) {
  const map = {
    pending: 'warning',
    processing: 'info',
    ready_for_pickup: 'secondary',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error',
  };
  return map[status] || 'default';
}

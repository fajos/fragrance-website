// Currency and date formatters for Nigerian E-Commerce

export function formatNaira(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount).replace('NGN', '₦');
}

export function formatDate(dateString) {
  const d = dateString ? new Date(dateString) : new Date();
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateOrderId() {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `FRAG-${year}-${randomPart}`;
}

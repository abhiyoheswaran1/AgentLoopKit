function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function formatDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatTimestamp(date = new Date()) {
  return `${formatDate(date)}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
}

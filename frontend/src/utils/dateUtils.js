export const toIsoDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatDate = (isoDateStr) => {
  if (!isoDateStr) return '';
  const [year, month, day] = isoDateStr.split('-');
  return `${day}/${month}/${year}`;
};

export const formatDateShort = (date) => {
  // Date -> "17-nov"
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });
};

export const formatTime = (isoDateTimeStr) => {
  if (!isoDateTimeStr) return '';
  const d = new Date(isoDateTimeStr);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatMinutesToHHMM = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(1, '0')}:${String(m).padStart(2, '0')}`;
};
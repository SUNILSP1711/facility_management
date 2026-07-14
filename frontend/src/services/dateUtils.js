/**
 * Utility functions for date and time formatting.
 *
 * API dates are exchanged in dd/MM/yyyy format (via @JsonFormat on BookingDTO).
 * HTML <input type="date"> uses yyyy-MM-dd internally.
 * These helpers convert between the two.
 */

/**
 * Convert ISO date string (yyyy-MM-dd) to dd/MM/yyyy for API requests.
 */
export function isoToApiDate(isoDate) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Convert API date string (dd/MM/yyyy) to ISO (yyyy-MM-dd) for <input type="date">.
 */
export function apiDateToIso(apiDate) {
  if (!apiDate) return '';
  const parts = apiDate.split('/');
  if (parts.length !== 3) return apiDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/**
 * Format a date string for display. Accepts both ISO (yyyy-MM-dd) and API (dd/MM/yyyy) formats.
 * Always returns dd/MM/yyyy.
 */
export function formatDateForDisplay(dateStr) {
  if (!dateStr) return '';
  // Already in dd/MM/yyyy?
  if (dateStr.includes('/')) return dateStr;
  // ISO format
  return isoToApiDate(dateStr);
}

/**
 * Format a time string for display — strips seconds if present.
 * "14:30:00" → "14:30", "14:30" → "14:30"
 */
export function formatTimeForDisplay(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  return `${parts[0]}:${parts[1]}`;
}

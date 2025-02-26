export function validateDates(
  startDate: string | null,
  endDate: string | null
): boolean {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  return !!(
    startDate &&
    endDate &&
    dateRegex.test(startDate) &&
    dateRegex.test(endDate)
  );
}

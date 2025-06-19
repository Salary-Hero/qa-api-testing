/**
 * Validate the format of a timestamp.
 */
export function assertTimestampFormat(timestamp: string) {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!iso8601Regex.test(timestamp)) {
    throw new Error(`Timestamp ${timestamp} does not match the format`);
  }
}
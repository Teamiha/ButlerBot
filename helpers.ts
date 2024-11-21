export async function yerevanToUTC(yerevanHour: number): Promise<number | 0> {
  if (!Number.isInteger(yerevanHour) || yerevanHour < 0 || yerevanHour > 23) {
    return 0;
  }

  let utcHour = yerevanHour - 4;

  if (utcHour < 0) {
    utcHour += 24;
  }

  return utcHour;
}

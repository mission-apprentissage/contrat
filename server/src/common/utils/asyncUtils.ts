export async function timeout<T>(promise: Promise<T>, millis: number): Promise<T> {
  let timeoutID: undefined | NodeJS.Timeout;
  const timeout: Promise<never> = new Promise((_resolve, reject) => {
    timeoutID = setTimeout(() => reject(`Timed out after ${millis} ms.`), millis);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutID));
}

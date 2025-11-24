export async function retry(fn, { retries = 3, delay = 200 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      await new Promise((r) => setTimeout(r, delay * Math.pow(2, attempt - 1)));
    }
  }
}

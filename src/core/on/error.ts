const logError = (err: Error) => console.error(err);

export const onError = async (error: Error) => Promise.all([
  logError,
].map(async (f) => f(error)));

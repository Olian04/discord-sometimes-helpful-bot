export class Record<T extends Record<T>> {
  constructor(e: T) {
    Object.keys(e).forEach((k) => {
      this[k] = e[k];
    });
  }
}

const severityCounter = {};

export const notYetImplemented = (topic: string) => {
  severityCounter[topic] = (severityCounter[topic] || 0) + 1;
  console.warn(`Not Yet Implemented: (Severity: ${severityCounter[topic]}) ${topic}`);
}
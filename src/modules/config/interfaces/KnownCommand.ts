export const KnownCommandsMap = {
  'list': true,
  'enable': true,
  'disable': true,
  'event': true,
  'poll': true,
  'roll': true,
}

export type KnownCommand = keyof typeof KnownCommandsMap;
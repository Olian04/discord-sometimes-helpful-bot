import { Reference } from '@/database';
import { IGuildConfig } from '@/interfaces/guildConfig.interface';

const defaultConfig: IGuildConfig = {
  channels: {},
};

export const configModelFactory = (guildRef: Reference) => ({

  update: (cb: (conf: IGuildConfig) => IGuildConfig) => guildRef
  .child('config').transaction(cb),

  onChange: (cb: (conf: IGuildConfig) => void) => guildRef
    .child('config').on('value', (snap) => {
      const conf = snap.val();
      if (! conf) {
        guildRef.child('config').transaction(() => defaultConfig);
      }
      cb(conf || defaultConfig);
    }),

});

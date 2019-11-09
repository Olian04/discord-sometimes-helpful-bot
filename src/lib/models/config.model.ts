import { Reference } from '@/database';
import { IChannelConfig, IGuildConfig } from '@/interfaces/guildConfig.interface';
import { DeepPartial } from '@/util/deepPartial';

const defaultChannelConfig: () => IChannelConfig = () => ({
  channelDisplayName: 'unset',
  isCommandOnly: false,
});

const constructConfigObject = (conf: DeepPartial<IGuildConfig>): IGuildConfig => ({
  ...(conf || {}),
  channels: new Proxy(conf ? conf.channels : {}, {
    get(__, k: string) {
      const isUnknownChannel = !(k in __);
      if (isUnknownChannel) {
        __[k] = defaultChannelConfig();
      }
      return __[k];
    },
    set(__, k: string, v: IChannelConfig) {
      if (k in __) {
        __[k] = v;
      } else {
        __[k] = defaultChannelConfig();
      }
      return true;
    },
  }),
}) as IGuildConfig;

export const configModelFactory = (guildRef: Reference) => ({

  update: (cb: (conf: IGuildConfig) => IGuildConfig) => guildRef
  .child('config').transaction((maybeConf: IGuildConfig) => {
    const conf = constructConfigObject(maybeConf);
    return cb(conf);
  }),

  onChange: (cb: (conf: IGuildConfig) => void) => guildRef
    .child('config').on('value', (snap) => {
      const conf = constructConfigObject(snap.val());
      cb(conf);
    }),

});

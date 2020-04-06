import { ref } from '@vue/composition-api';
import { app } from './index';

export interface ChannelConfig {
  allowCommand_emote: boolean;
  allowCommand_event: boolean;
  allowCommand_poll: boolean;
  channelDisplayName: string;
  isCommandOnly: boolean;
}

export const useChannelConfig = ({ guildID, channelID }: {
  guildID: string; channelID: string;
}) => {
  const docRef = app.database().ref('guilds')
    .child(guildID).child('config/channels')
    .child(channelID).ref;

  const reactiveRef = ref<ChannelConfig | null>(null);

  docRef.on('value', (snap) => {
    const newConfig = snap.val() as ChannelConfig;
    reactiveRef.value = newConfig;
  });

  const updateConfig = (config: Partial<ChannelConfig>) => {
    docRef.update(config);
  };

  return [reactiveRef, updateConfig];
};

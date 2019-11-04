import { config } from '@/config';
import { db } from '@/database';
import { IChannelConfig } from '@/interfaces/guildConfig.interface';
import { deleteIfAble } from '@/util/command';
import { logger } from '@/util/logger';
import { DynamicMessage, OnReaction } from 'discord-dynamic-messages';
import { emoji } from 'node-emoji';

// IMPORTANT NOTE: This config solution is only temporary,
// and will be removed when a web based solution has been implemented.

export class ChannelConfig extends DynamicMessage {
  private configCache: IChannelConfig;
  private isSubmitted = false;
  constructor(private target: { guildID: string, channelID: string }) {
    super();
    this.configCache = {
      ...config.guildConfigs[this.target.guildID].channels[this.target.channelID],
    };
    logger.debug.dynamicMessage(`Constructed channel config for channel: ${target.channelID}`);
  }

  @OnReaction(':one:', {
    removeWhenDone: false,
  })
  public one() {
    if (this.isSubmitted) { return; }
    this.configCache.isCommandOnly = !this.configCache.isCommandOnly;
  }

  @OnReaction(':floppy_disk:', {
    removeWhenDone: false,
  })
  public submitChanges() {
    if (this.isSubmitted) { return; }
    db(this.target.guildID).config.update((conf) => {
      return {
        ...(conf || {}),
        channels: {
          [this.target.channelID]: this.configCache,
        },
      };
    });
    this.isSubmitted = true;
    this.reRender();
    // TODO: Find a way to remove the bots reactions
    // TODO: Fix the memory leak that occurs when a config message is left hanging.
    // this.message.reactions.filter((r) => r.me).deleteAll();
    // this.message = null;
  }

  public render() {
    logger.debug.dynamicMessage(`Rendered channel config for channel: ${this.target.channelID}`);
    if (this.isSubmitted) {
      return 'Changes submitted.';
    }

    return `**[config.channel]** Channel ID: ${this.target.channelID}
Current config (with queued changes):
\`\`\`diff
${this.configCache.isCommandOnly ? '+' : '-'} [1] isCommandOnly
\`\`\`
Queue a toggle change by reacting with the associated number.
Submit all queued changes by reacting with ${emoji.floppy_disk}
`;
  }
}

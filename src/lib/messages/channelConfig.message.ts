import { config } from '@/config';
import { db } from '@/database';
import { IChannelConfig } from '@/interfaces/guildConfig.interface';
import { logger } from '@/util/logger';
import { DynamicMessage, OnReaction } from 'discord-dynamic-messages';
import { emoji } from 'node-emoji';

// IMPORTANT NOTE: This config solution is only temporary,
// and will be removed when a web based solution has been implemented.

export class ChannelConfig extends DynamicMessage {
  private configCache: IChannelConfig;
  private timeOutDuration: number = 5 * 60 * 1000; // 5min
  private isSubmitted = false;
  private hasTimedOut = false;
  constructor(private target: { guildID: string, channelID: string }) {
    super();
    this.configCache = {
      ...config.guildConfigs[this.target.guildID].channels[this.target.channelID],
    };
    this.configCache.channelDisplayName = null; // Ensures that the display name is forced to update

    setTimeout(() => {
      this.hasTimedOut = true;
      this.reRender();
    }, this.timeOutDuration);

    logger.debug.dynamicMessage(`Constructed channel config for channel: ${target.channelID}`);
  }

  @OnReaction(':one:', {
    removeWhenDone: false,
  })
  public toggleIsCommandOnly() {
    if (this.isSubmitted || this.hasTimedOut) { return; }
    this.configCache.isCommandOnly = !this.configCache.isCommandOnly;
  }

  @OnReaction(':two:', {
    removeWhenDone: false,
  })
  public toggleAllowCommandEmote() {
    if (this.isSubmitted || this.hasTimedOut) { return; }
    this.configCache.allowCommand_emote = !this.configCache.allowCommand_emote;
  }

  @OnReaction(':three:', {
    removeWhenDone: false,
  })
  public toggleAllowCommandEvent() {
    if (this.isSubmitted || this.hasTimedOut) { return; }
    this.configCache.allowCommand_event = !this.configCache.allowCommand_event;
  }

  @OnReaction(':floppy_disk:', {
    removeWhenDone: false,
  })
  public submitChanges() {
    if (this.isSubmitted || this.hasTimedOut) { return; }
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
    if (this.hasTimedOut) {
      return 'Changes discarded. Time limit exceeded.';
    }

    // I don't want to have to do this... but i don't have the patience to redesign this component again.
    if (this.message !== null && this.configCache.channelDisplayName === null) {
      this.configCache.channelDisplayName = this.message.client
        .guilds.get(this.target.guildID)
        .channels.get(this.target.channelID)
        .name;
    }

    return `**[config.channel]** ${this.configCache.channelDisplayName}
Current config (with queued changes):
\`\`\`diff
${this.configCache.isCommandOnly ? '+' : '-'} [1] isCommandOnly
${this.configCache.allowCommand_emote ? '+' : '-'} [1] allowCommand_emote
${this.configCache.allowCommand_event ? '+' : '-'} [1] allowCommand_event
\`\`\`
Queue a toggle change by reacting with the associated number.
Submit all queued changes by reacting with ${emoji.floppy_disk}
`;
  }
}

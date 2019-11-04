import { config } from '@/config';
import { db } from '@/database';
import { ChannelConfig } from '@/messages/channelConfig.message';
import { deleteIfAble } from '@/util/command';
import { logger } from '@/util/logger';
import { Command, Event, parse, subscribe } from 'discord-commander';
import { Permissions } from 'discord.js';

export class ConfigCommand extends Command('config') {
  @parse.nextWord private subCommand: string;

  private subCommands = {
    channel: this.sendChannelConfigMessage,
  };

  @subscribe('new', 'edit')
  public async onMessage(ctx: Event) {
    if (! ctx.message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      this.sendPermissionDeniedHelpText(ctx);
      deleteIfAble(ctx.message);
      return;
    }
    if (this.subCommand in this.subCommands) {
      this.subCommands[this.subCommand](ctx);
    } else {
      this.sendMissingArgumentHelpText(ctx);
    }
  }

  public async sendChannelConfigMessage(ctx: Event) {
    const dmChannel = await ctx.author.createDM();
    new ChannelConfig({
      channelID: ctx.channel.id,
      guildID: ctx.message.guild.id,
    }).sendTo(dmChannel);
  }

  private async sendPermissionDeniedHelpText(ctx: Event) {
    await ctx.author.send(`The config command requires administrator privileges.`);

    await deleteIfAble(ctx.message); // delete command from chat log
    logger.debug.command(`Sent permission denied help text to: ${ctx.author.username}`);
  }

  private async sendMissingArgumentHelpText(ctx: Event) {
    await ctx.author.send(`The config command requires a sub command to be provided:
\`\`\`
${config.commander.prefix}config [subCommand]
\`\`\`
Available sub commands are: ${Object.keys(this.subCommands).join(', ')}`);

    await deleteIfAble(ctx.message); // delete command from chat log
    logger.debug.command(`Sent missing argument help text to: ${ctx.author.username}`);
  }
}

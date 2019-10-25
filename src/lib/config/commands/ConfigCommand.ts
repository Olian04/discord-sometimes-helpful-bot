import { createGuildEntryIfNotExist } from '@/core/database';
import { getConfig } from '@/lib/config/cache';
import { deleteIfAble, isDirectMessage } from '@/util/command';
import { Command, Event, parse, subscribe } from 'discord-commander';
import { addConfig } from './sub-commands/add';
import { setConfig } from './sub-commands/set';
import { setupConfig } from './sub-commands/setup';

export class ConfigCommand extends Command('config') {
  @parse.nextWord private subCommand: string;
  @parse.remaining private configBody: string;

  @subscribe('new', 'edit')
  public async onMessage(ctx: Event) {
    if (isDirectMessage(ctx.message)) { return; }

    if (this.subCommand === undefined || this.subCommand === '') {
      console.log(`User "${ctx.author.username}" called config command without subCommand.`);
      deleteIfAble(ctx.message);
      return;
    }

    await createGuildEntryIfNotExist(ctx.message.guild.id);

    const guildConf = await getConfig(ctx.message.guild);

    const isAdmin = ctx.message.member.hasPermission('ADMINISTRATOR');
    if (! isAdmin) {
      console.log(`None-admin user "${ctx.author.username}" attempted illegal configuration action.`);
      deleteIfAble(ctx.message);
      return;
    }

    if (this.subCommand === 'setup') {
      return setupConfig(guildConf, ctx.message);
    }

    if (guildConf.cache.meta.channelID === null) {
      console.warn('No config channel yet assigned');
      deleteIfAble(ctx.message);
      return;
    }

    if (ctx.channel.id !== guildConf.cache.meta.channelID) {
      console.log(`User "${ctx.author.username}" attempted to configure bot in none config channel`);
      deleteIfAble(ctx.message);
      return;
    }

    if (this.configBody === undefined) {
      console.log(`User "${ctx.author.username}" attempted to configure bot with invalid config syntax`);
      deleteIfAble(ctx.message);
      return;
    }

    switch (this.subCommand) {
      case 'add':
        addConfig(guildConf, this.configBody);
        break;
      case 'set':
        setConfig(guildConf, this.configBody);
        break;
    }

    deleteIfAble(ctx.message);
  }
}

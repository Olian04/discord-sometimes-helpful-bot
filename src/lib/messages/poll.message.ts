import { db } from '@/database';
import { IPoll } from '@/interfaces/poll.interface';
import { logger } from '@/util/logger';
import { DynamicMessage, OnAnyReaction, OnAnyReactionRemoved, OnInit } from 'discord-dynamic-messages';
import { Guild, MessageReaction, TextChannel, User } from 'discord.js';
import emoji from 'node-emoji';

const emojiFixes = Object.entries({
  0: ':zero:',
  1: ':one:',
  2: ':two:',
  3: ':three:',
  4: ':four:',
  5: ':five:',
  6: ':six:',
  7: ':seven:',
  8: ':eight:',
  9: ':nine:',
}).reduce((res, [k, v]) => ({ ...res, [k]: v, [v]: k }), {});

export class PollMessage extends DynamicMessage {
  constructor(private pollData: IPoll) {
    super({
      volatile: false,
      onError: (err) => {
        logger.debug.dynamicMessage(String(err));
      },
    });
    db(this.pollData.guildID).poll.onPollChange(this.pollData.id, (newPollData) => {
      if (newPollData === undefined) {
        logger.warn.dynamicMessage(`Unexpected "undefined" pollData in PollMessage`);
        return;
      }
      this.pollData = newPollData;

      if (this.message) {
        this.reRender();
      }
    });
    logger.debug.dynamicMessage(`Constructed PollMessage for poll: ${pollData.id}`);
  }

  @OnInit
  public init() {
    this.addReactions(
      this.pollData.voteAlternatives.map((_, index) => emojiFixes[index]),
    );
  }

  @OnAnyReaction({
    triggerRender: true,
    ignoreBots: true,
    ignoreHumans: false,
  })
  public voteYes(user: User, channel: TextChannel, reaction: MessageReaction) {
    this.updateAttendance(user, channel.guild, [
      emojiFixes[emoji.unemojify(reaction.emoji.name)],
      true,
    ]);
  }

  @OnAnyReactionRemoved({
    triggerRender: true,
    ignoreBots: true,
    ignoreHumans: false,
  })
  public voteNo(user: User, channel: TextChannel, reaction: MessageReaction) {
    this.updateAttendance(user, channel.guild, [
      emojiFixes[emoji.unemojify(reaction.emoji.name)],
      false,
    ]);
  }

  public render() {
    logger.debug.dynamicMessage(`Rendered PollMessage for poll: ${this.pollData.id}`);
    let largestVoteCount = 0;
    const pollResultRows = this.pollData.voteAlternatives.map((voteAlternative, index) => {
      const totalVotes = this.pollData.participants
        .map((participant) => participant.votes[index])
        .reduce((res, is) => is ? res + 1 : res, 0);

      if (totalVotes > largestVoteCount) {
        largestVoteCount = totalVotes;
      }
      return [voteAlternative, totalVotes];
    });

    return `**[poll]** ${this.pollData.title}\n`
    + pollResultRows.map(([ _, count ]: [string, number], index) =>
      `${emojiFixes[index]} | ${Array(count).fill('█').join('')}`,
    ).join('\n')
    + '\n'
    + Array(30).fill('=').join('')
    + '\n'
    + pollResultRows.map(([ title ]: [string], index) =>
    `${emojiFixes[index]} | ${title}`,
  ).join('\n');
  }

  private updateAttendance(user: User, guild: Guild, newVote: [number, boolean]) {
    logger.debug.dynamicMessage(
      `Updated attendance for poll: ${this.pollData.id} (${user.username}:${newVote[0]}=${newVote[1]})`,
    );
    db(this.pollData.guildID).poll.updateVote(this.pollData.id, {
      userID: user.id,
      nickname: guild.member(user).displayName,
      votes: {
        [newVote[0]]: newVote[1],
      },
    });
  }
}

import { Attachment, Client, Emoji, Message, MessageReaction, ReactionEmoji, RichEmbed, User } from 'discord.js';
import fetch from 'node-fetch';
import { isCommand, tokenizeCommand } from '../util/commandUtils';

export const ID = 'xur';
export const callback = (client: Client) => {
  client.on('message', async (message) => {
    if (! isCommand(message.content)) { return; }

    const [command, ...args] = tokenizeCommand(message.content);

    if (command !== 'xur') { return; }

    const data = await fetch('https://api.braytech.org/?request=xur&get=history')
      .then((resp) => resp.json())
      .then((body: { response: IResponse }) => body.response.data)
      .catch((err) => {
        console.error(err);
      });

    if (! data) {
      console.error('Failed retrieving Xur data from api.braytech.org');
      return;
    }

    await message.reply(`
Xur is @ ${data.location.region} on ${data.location.world}; ${data.location.description}`)
      .then(async () => {
        await Promise.all(data.items
          .filter((item) => item.equippable)
          .map((item) =>
            message.channel.send(
              new RichEmbed()
                .setTitle(item.displayProperties.name)
                .setDescription(item.displayProperties.description)
                .setImage(`https://www.bungie.net${item.displayProperties.icon}`),
            ),
          ));
      });

    message.delete(); // Clean up command
  });
};

export interface IMap {
  x: string;
  y: string;
}

export interface ILocation {
  world: string;
  region: string;
  map: IMap;
  description: string;
}

export interface IDisplayProperties {
  description: string;
  name: string;
  icon: string;
  hasIcon: boolean;
}

export interface IEquippingBlock {
  uniqueLabel: string;
  uniqueLabelHash: number;
  equipmentSlotTypeHash: any;
  attributes: number;
  equippingSoundHash: number;
  hornSoundHash: number;
  ammoType: number;
  displayStrings: string[];
}

export interface ICost {
  quantity: number;
  icon: string;
}

export interface IItem {
  sales: number;
  hash: any;
  displayProperties: IDisplayProperties;
  classType: number;
  itemTypeDisplayName: string;
  equippable: boolean;
  equippingBlock: IEquippingBlock;
  screenshot: string;
  cost: ICost;
  season?: number;
  source?: any;
}

export interface IData {
  location: ILocation;
  retrieved: string;
  season: number;
  week: number;
  items: IItem[];
}

export interface IResponse {
  status: number;
  message: string;
  data: IData;
  lastModified: Date;
  refresh: Date;
}

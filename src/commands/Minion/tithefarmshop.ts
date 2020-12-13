import { CommandStore, KlasaMessage } from 'klasa';

import { BotCommand } from '../../lib/BotCommand';
import TitheFarmBuyables from '../../lib/buyables/titheFarmBuyables';
import { Time } from '../../lib/constants';
import { minionNotBusy, requiresMinion } from '../../lib/minions/decorators';
import { UserSettings } from '../../lib/settings/types/UserSettings';
import { multiplyBank, stringMatches, toTitleCase } from '../../lib/util';
import createReadableItemListFromBank from '../../lib/util/createReadableItemListFromTuple';

export default class extends BotCommand {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			usage: '[quantity:int{1,250000}] <name:...string>',
			usageDelim: ' ',
			oneAtTime: true,
			cooldown: 5,
			altProtection: true,
			aliases: ['tfs', 'tfshop'],
			description: `Allows a player to purchase farmer's items from the tithefarm shop.`,
			examples: ['+tfs farmers hat', '+tithefarmshop farmers jacket'],
			categoryFlags: ['minion']
		});
	}

	@minionNotBusy
	@requiresMinion
	async run(msg: KlasaMessage, [quantity = 1, buyableName]: [number, string]) {
		const buyable = TitheFarmBuyables.find(
			item =>
				stringMatches(buyableName, item.name) ||
				(item.aliases && item.aliases.some(alias => stringMatches(alias, buyableName)))
		);

		if (!buyable) {
			throw `I don't recognize that item, the items you can buy are: ${TitheFarmBuyables.map(
				item => item.name
			).join(', ')}.`;
		}

		await msg.author.settings.sync(true);

		const outItems = multiplyBank(buyable.outputItems, quantity);
		const itemString = await createReadableItemListFromBank(this.client, outItems);

		const titheFarmPoints = msg.author.settings.get(UserSettings.Stats.TitheFarmPoints);

		const titheFarmPointsCost = buyable.titheFarmPoints * quantity;

		if (titheFarmPoints < titheFarmPointsCost) {
			throw `You need ${titheFarmPointsCost} Tithe Farm points to make this purchase.`;
		}

		let purchaseMsg = `${itemString} for ${titheFarmPointsCost} Tithe Farm points`;

		if (!msg.flagArgs.cf && !msg.flagArgs.confirm) {
			const sellMsg = await msg.channel.send(
				`${msg.author}, say \`confirm\` to confirm that you want to purchase ${purchaseMsg}.`
			);

			// Confirm the user wants to buy
			try {
				await msg.channel.awaitMessages(
					_msg =>
						_msg.author.id === msg.author.id &&
						_msg.content.toLowerCase() === 'confirm',
					{
						max: 1,
						time: Time.Second * 15,
						errors: ['time']
					}
				);
			} catch (err) {
				return sellMsg.edit(
					`Cancelling purchase of ${quantity} ${toTitleCase(buyable.name)}.`
				);
			}
		}

		await msg.author.settings.update(
			UserSettings.Stats.TitheFarmPoints,
			titheFarmPoints - titheFarmPointsCost
		);

		await msg.author.addItemsToBank(outItems, true);

		return msg.send(
			`You purchased ${itemString} for ${titheFarmPointsCost} Tithe Farm points.`
		);
	}
}
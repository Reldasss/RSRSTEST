import { Items } from 'oldschooljs';

import { ArrayItemsResolvable, ArrayItemsResolved } from '../types';

// Resolve an array of item IDs or names into an array of item IDs
export default function resolveItems(itemArray: (string | number)[]): number[] {
	const newArray: number[] = [];

	for (const item of itemArray) {
		if (typeof item === 'number') {
			newArray.push(item);
		} else {
			const osItem = Items.get(item);
			if (!osItem) {
				throw `No item found for: ${item}.`;
			}
			newArray.push(osItem.id);
		}
	}

	return newArray;
}

export function deepResolveItems(itemArray: ArrayItemsResolvable): ArrayItemsResolved {
	const newArray: ArrayItemsResolved = [];

	for (const item of itemArray) {
		if (typeof item === 'number') {
			newArray.push(item);
		} else if (Array.isArray(item)) {
			const test = resolveItems(item);
			newArray.push(test);
		} else {
			const osItem = Items.get(item);
			if (!osItem) {
				throw `No item found for: ${item}.`;
			}
			newArray.push(osItem.id);
		}
	}

	return newArray;
}

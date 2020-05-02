import { KlasaUser } from 'klasa';
import { Client } from 'discord.js';

import { activityTaskFilter } from '../util';
import { TickerTaskData } from '../types/minions';
import { Activity } from '../constants';
import { GroupMonsterActivityTaskOptions } from '../minions/types';

export default function getActivityOfUser(client: Client, user: KlasaUser) {
	for (const task of client.schedule.tasks.filter(activityTaskFilter)) {
		const taskData = task.data as TickerTaskData;
		for (const subTask of taskData.subTasks) {
			if (subTask.userID === user.id) return subTask;
			if (
				subTask.type === Activity.GroupMonsterKilling &&
				(subTask as GroupMonsterActivityTaskOptions).users.includes(user.id)
			) {
				return subTask;
			}
		}
	}

	return null;
}

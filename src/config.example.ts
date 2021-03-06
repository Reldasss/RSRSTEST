import { KlasaClientOptions } from 'klasa';
import os from 'os';

import {
	MongoDBConfig,
	PatreonConfig,
	ProviderConfig,
	RedditAppConfig,
	TwitterAppConfig
} from './lib/types';

export const botToken = 'ODAxMDkwMDI5NDgwNzA2MDQ4.YAbnOg.-yyQ3vqMv1-VOHPXcrBlCgDYD2g';
export const providerConfig: ProviderConfig | null = {
	default: 'json'
};
export const production = os.platform() === 'linux';
export const staging = false;

export const redditAppConfig: RedditAppConfig = null;
export const twitterAppConfig: TwitterAppConfig = null;
export const mongoDBConfig: MongoDBConfig = null;
export const patreonConfig: PatreonConfig = null;
export const customClientOptions: KlasaClientOptions = {
	prefix: '-'
};
export const sentryDSN: string | null = null;

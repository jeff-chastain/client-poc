import { UserPreference } from "@/models/user/user.preference";
import { Wallet } from "@/models/wallet/wallet";

export interface UserWallet {
	id: number;
	publicKey: string;
	wallet: Wallet;
}

export interface UserProfile {
	id: number;
	username: string;
	fistname: string;
	lastname: string;
	email: string;
	lastlogin: Date;
	createdOn: Date;
	modifiedOn: Date;
	preferences: UserPreference[];
	wallets: UserWallet[];
}
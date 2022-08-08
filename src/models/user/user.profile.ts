import { UserPreference } from "@/models/user/user.preference";
import { UserRole } from "@/models/user/user.role";
import { Wallet } from "@/models/wallet/wallet";

export interface UserWallet {
	id: number;
	publicKey: string;
	wallet: Wallet;
}

export interface UserProfile {
	authorID: string;
	biography: string;
	createdDate: Date;
	email: string;
	firstName: string;
	isActive: boolean;
	isDeleted: boolean;
	lastLogin: Date;
	lastName: string;
	modifiedDate: Date;
	numberOfContent: number;
	numberOfContentStore: number;
	numberOfEntries: number;
	numberOfPages: number;
	permissionGroups: [];
	permissions: [];
	preferences: any;
	role: UserRole;
	username: string;
	//wallets: UserWallet[];
}
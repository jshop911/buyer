/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
	CompositeScreenProps,
	NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	Root: NavigatorScreenParams<RootTabParamList> | undefined;
	About: undefined;
	NotFound: undefined;
	Search: undefined;
	EditProfile: undefined;
	Profile: undefined;
	MessagePage: undefined;
	ListCategory: undefined;
	Logout: undefined;
	Login: undefined;
	SignUp: undefined;
	ProductDetail: undefined;
	SellNow: | Partial<{
		itemId: number;
		itemName: string;
		listOfCategory: string;
		itemSelectedImage: string;
		minKg: number;
		itemDealPrice: number;
		itemUsername: string;
		itemAddress: string;
		itemProductDesc: string;
		itemFirstName: string;
		itemLastName: string;
	  }>
	| undefined;
	BuyerConfirmation: | Partial<{
		key: string;
		itemId: number;
		itemName: string;
		listOfCategory: string;
		itemSelectedImage: string;
		minKg: number;
		itemDealPrice: number;
		itemUsername: string;
		itemAddress: string;
		itemProductDesc: string;
		itemFirstName: string;
		itemLastName: string;
	  }>
	| undefined;
	TransactionHistory: undefined;
	ForgotPassword: undefined;
	DealSeller: undefined;
	ProductSell: undefined;
	MapLocation: | Partial<{
		latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
		address: string;
	}> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
	Home: Partial<{
		key: number;
		itemId: number;
		itemName: string;
		listOfCategory: string;
		itemSelectedImage: string;
		minKg: number;
		itemDealPrice: number;
		itemUsername: string;
		itemAddress: string;
		itemProductDesc: string;
		itemFirstName: string;
		itemLastName: string;
        
	}> | undefined;
	MessageList: undefined;
	Notification: undefined;
	Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<RootTabParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>;

/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable, Image } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Home from "../screens/Pages/Home";
import MessageList from "../screens/Pages/MessageList";
import Notification from "../screens/Pages/Notification";
import Profile from "../screens/Pages/Profile";
import {
	RootStackParamList,
	RootTabParamList,
	RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import Search from "../screens/Pages/Search";
import ListCategory from "../screens/Pages/Category/ListCategory";
import SellNow from "../screens/Pages/SellNow";
import ProductDetail from "../screens/Pages/ProductDetail";
import TransactionHistory from "../screens/Pages/TransactionHistory";
import About from "../screens/Pages/About";
import EditProfile from "../screens/Pages/EditProfile";
import NotFoundScreen from "../screens/NotFoundScreen";
import tw from "twrnc";
import BuyerConfirmation from "../screens/Pages/BuyerConfirmation";
import BuyerLocation from "../screens/Pages/Map/BuyerLocation";
import MessagePage from "../screens/Pages/MessagePage";

export default function UserStack({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Root"
				component={BottomTabNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: "Oops!" }}
			/>
			<Stack.Group
				screenOptions={{
					presentation: "modal",
					headerStyle: {
						backgroundColor: "#faac2a",
					},
				}}
			>
				<Stack.Screen
					name="Search"
					component={Search}
					options={{ headerTintColor: "#fff" }}
				/>
				<Stack.Screen
					name="About"
					component={About}
					options={{ headerTintColor: "#fff" }}
				/>
				<Stack.Screen
					name="EditProfile"
					component={EditProfile}
					options={{ headerTintColor: "#fff" }}
				/>
				<Stack.Screen
					name="ListCategory"
					component={ListCategory}
					options={{ headerTintColor: "#fff" }}
				/>
				<Stack.Screen
					name="SellNow"
					component={SellNow}
					options={{ headerTintColor: "#fff" }}
				/>
				<Stack.Screen
					name="BuyerConfirmation"
					component={BuyerConfirmation}
					options={{ headerTintColor: "#fff", title: "Buy Status" }}
				/>
				<Stack.Screen
					name="MessagePage"
					component={MessagePage}
					options={{ headerTintColor: "#fff", title: "Message" }}
				/>
				<Stack.Screen
					name="ProductDetail"
					component={ProductDetail}
					options={{ headerTintColor: "#fff" }}
				/>
				<Stack.Screen
					name="TransactionHistory"
					component={TransactionHistory}
					options={{ headerTintColor: "#fff", title: "Transaction History" }}
				/>
				<Stack.Screen
					name="MapLocation"
					component={BuyerLocation}
					options={{ headerTintColor: "#fff", title: "Seller's Location" }}
				/>
			</Stack.Group>
		</Stack.Navigator>
	);
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator({ navigation }) {
	const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator
			initialRouteName="Home"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint,
				headerStyle: {
					backgroundColor: "#faac2a",
				},
				headerTintColor: "#fff",
			}}
		>
			<BottomTab.Screen
				name="Home"
				component={Home}
				options={({ navigation }: RootTabScreenProps<"Home">) => ({
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					headerTitle: () => (
						<Image
							style={tw`w-20 h-10 pl-2`}
							source={require("../assets/images/splash.png")}
						/>
					),
					headerRight: () => (
						<Pressable
							onPress={() => navigation.navigate("Search")}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1,
							})}
						>
							<FontAwesome
								name="search"
								size={25}
								color={Colors[colorScheme].text}
								style={{ marginRight: 15 }}
							/>
						</Pressable>
					),
				})}
			/>
			<BottomTab.Screen
				name="MessageList"
				component={MessageList}
				options={{
					title: "Message",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="message-star" color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name="Notification"
				component={Notification}
				options={{
					title: "Deal Seller",
					tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Profile"
				component={Profile}
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="account" color={color} />
					),
				}}
			/>
		</BottomTab.Navigator>
	);
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
	name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
	color: string;
}) {
	return (
		<MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />
	);
}

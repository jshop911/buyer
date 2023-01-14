import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
	View,
	Text,
	ScrollView,
	Image,
	FlatList,
	TouchableOpacity,
	Touchable,
} from "react-native";
import React from "react";
import tw from "twrnc";
import SellStatus from "../../assets/api/SellStatus";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Firebase Analytics is not available in the Expo client"]);

export default function BuyerConfirmation({ navigation, route }) {
	const {
		itemId,
		itemName,
		itemSelectedImage,
		minKg,
		itemDealPrice,
		itemUsername,
		itemAddress,
		itemProductDesc,
		listOfCategory,
		itemFirstName,
		itemLastName,
		itemStatus,
	  } = route?.params || {};

	  


	return (
		<>
			<View style={tw`p-2`}>
				{/* Items to be sold */}
				<FlatList
					data={SellStatus}
					keyExtractor={(item) => itemId}
					renderItem={({ item }) => (
						<>
							<View style={tw`my-2 py-2 bg-gray-200 rounded flex-row`}>
								<View style={tw`p-2`}>
									<Image
										style={tw`w-30 h-35 rounded px-2 border-solid border-2 border-gray-400`}
										source={{
										uri: itemSelectedImage || "https://i.pinimg.com/236x/4e/01/fd/4e01fdc0c233aa4090b13a2e49a7084d.jpg",
										}}
									/>
								</View>
								<View style={tw`pt-2 w-35 border-r border-gray-300`}>
									<Text style={tw`text-base font-bold`}>{itemName}</Text>
									<Text style={tw`text-[#223447] font-bold underline`}>
										{itemFirstName} {itemLastName}

									</Text>
									<View style={tw`flex flex-row border-b border-gray-300 pb-2`}>
										<MaterialCommunityIcons
											name="map-marker"
											size={14}
											color={"#223447"}
										/>
										<TouchableOpacity
											onPress={() => navigation.navigate("MapLocation")}
										>
											<Text style={tw`text-xs w-30`}>{itemAddress}</Text>
										</TouchableOpacity>
									</View>

									<View style={tw`flex-row items-center`}>
										<Text style={tw`text-xs text-gray-600 font-bold`}>
											Deal Price:
										</Text>
										<Text style={tw`text-red-500 font-bold`}>
											{itemDealPrice} Php / kg
										</Text>
									</View>
									<View style={tw`flex-row items-center`}>
										<Text style={tw`text-xs text-gray-600 font-bold`}>
											Kg sold:
										</Text>
										<Text style={tw`text-sm text-gray-600 font-bold`}>
											{" "}
											{minKg * itemDealPrice} kg
										</Text>
									</View>
								</View>
								{/* Buyers confirmation */}
								<View style={tw`self-center p-2 w-25`}>
									<Text style={tw`font-bold  text-center`}>Status:</Text>
									<TouchableOpacity>
										<Text
											style={tw`text-sm text-center text-green-50 bg-green-500 p-2 rounded`}
										>
											Received
										</Text>
									</TouchableOpacity>
									<TouchableOpacity>
										<Text
											style={tw`text-sm text-center text-red-50 bg-red-500 p-2 my-2 rounded`}
										>
											Loss
										</Text>
									</TouchableOpacity>
									<Text style={tw`text-xs`}>{item.date}</Text>
								</View>
							</View>
						</>
					)}
				/>
			</View>
		</>
	);
}

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

export default function BuyerConfirmation({ navigation }) {
	return (
		<>
			<View style={tw`p-2`}>
				{/* Items to be sold */}
				<FlatList
					data={SellStatus}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<>
							<View style={tw`my-2 py-2 bg-gray-200 rounded flex-row`}>
								<View style={tw`p-2`}>
									<Image
										source={{
											uri: item.productImage,
										}}
										style={tw`w-22 h-30 p-2 rounded`}
									/>
								</View>
								<View style={tw`pt-2 w-35 border-r border-gray-300`}>
									<Text style={tw`text-base font-bold`}>{item.product}</Text>
									<Text style={tw`text-[#223447] font-bold underline`}>
										{item.username}
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
											<Text style={tw`text-xs w-30`}>{item.location}</Text>
										</TouchableOpacity>
									</View>

									<View style={tw`flex-row items-center`}>
										<Text style={tw`text-xs text-gray-600 font-bold`}>
											Deal Price:
										</Text>
										<Text style={tw`text-red-500 font-bold`}>
											{item.price} Php / kg
										</Text>
									</View>
									<View style={tw`flex-row items-center`}>
										<Text style={tw`text-xs text-gray-600 font-bold`}>
											Kg sold:
										</Text>
										<Text style={tw`text-sm text-gray-600 font-bold`}>
											{" "}
											{item.sold} kg
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

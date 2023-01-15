import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	FlatList,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { Avatar } from "react-native-elements";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { nanoid } from "nanoid";
import { db } from "../../config/firebase/Firebase";
require("firebase/firestore");

const randomId = nanoid();

export default function Search({ user, room, selectedImage, userB }) {
	const navigation = useNavigation();
	//search users
	const [users, setUsers] = useState([]);

	const fetchUsers = (search) => {
		db
			.collection("userSeller")
			.where("firstName" || "lastName", ">=", search)
			.get()
			.then((snapshot) => {
				let users = snapshot.docs.map((doc) => {
					const data = doc.data();
					const id = doc.id;
					return { id, ...data };
				});
				setUsers(users);
			});
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			{/* ------------- Search input SafeAreaView Section ----------------  */}
			<SafeAreaView>
				<View style={tw`mt-4 p-4`}>
					{/* ------------- Search input Section ----------------  */}
					<Searchbar
						placeholder="Search"
						onChangeText={(search) => fetchUsers(search)} value={""}					/>

					{/* ------------- List of recent item Search Section ----------------  */}
					<FlatList
						numColumns={1}
						horizontal={false}
						data={users}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View style={tw`flex-row py-4 border-b border-gray-200`}>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("MessagePage", {
											firstName: item.firstName,
											lastName: item.lastName,
											sellerPhoto: item.sellerPhoto,
											sellerId: item.sellerId,
										})
									}
								>
									<View style={tw`flex-row pl-2 self-center items-center`}>
										<Avatar
											size={38}
											rounded
											title="P"
											source={{ uri: item.photoURL }}
											containerStyle={{
												backgroundColor: "#33c9fe",
											}}
										/>
										<Text
											style={tw`pl-4 text-[#000] text-base font-bold self-center`}
										>
											{item.firstName} {item.lastName}
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						)}
					/>
					{/* ------------- End of Recent item Search Section ----------------  */}
				</View>
			</SafeAreaView>
			{/* ------------- End of Search Section ----------------  */}
		</ScrollView>
	);
}

import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { AirbnbRating } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BuyPostItem from "../../../assets/api/BuyPostItem";
import app, { db} from "../../../config/firebase/Firebase";
import { deleteDoc, deleteField, doc, documentId, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Firebase Analytics is not available in the Expo client"]);


export default function PostItem({ navigation }) {
	const [data, setData] = useState();
	const user = getAuth();
	
	let currentUserUID = app.auth().currentUser.uid;


	useEffect(() => {
		getDisplayData();
	}, [data])

	const getDisplayData = () => {
		// tama na to
		db.collection("postedItem")
			.where("userId", "==", currentUserUID)
			.get()
			.then((snapshot) => {
				let myData = [];
				
				snapshot.forEach((doc) => {
					const post = doc.data();
					myData.push({
						id: post.id,
						productName: post.productName,
						minKg: post.minKg,
						address: post.address,
						dealPrice: post.dealPrice,
						selectedProductImage: post.selectedProductImage,
					});
				});
				console.log(myData);
				setData(myData);
		  })
		  .catch((error) => {
			console.log("Error getting data: ", error);
		  });
	  };

	return (
		<View style={tw`mb-32`}>
			<View style={tw`py-1 bg-[#faac2a] w-full`}>
				<Text
					style={tw`text-xl text-center text-[#223447] italic font-semibold`}
				>
					"Never refuse to reuse."
				</Text>
			</View>

			<View style={tw`flex items-center self-center py-4 mb-26`}>
				<FlatList
					data={data}
					keyExtractor={item => item.id}
					numColumns={2}
					renderItem={({ item}) => (
						<View style={tw`flex-row p-2`}>
							<View style={tw`bg-gray-200 p-2 w-40 rounded shadow-md`}>
								<Image
									
									style={tw`w-35 h-35 rounded px-2 border-solid border-2 border-gray-400`}
									source={{
										uri: item.selectedProductImage,
									}}
								/>
								<Text style={tw`text-sm text-gray-700 text-center font-bold`}>
									{item.productName}
								</Text>
								<View style={tw`flex-row items-center`}>
									<Text style={tw`text-xs text-gray-600 font-bold`}>
										Deal Price:
									</Text>
									<Text style={tw`text-base text-[#faac2a] font-bold ml-2`}>
										{item.dealPrice} Php
									</Text>
								</View>

								<View style={tw`flex-row items-center pt-2`}>
									<MaterialCommunityIcons
										name="store-marker-outline"
										size={20}
										color={"#223447"}
									/>
									<Text
									
										style={tw`text-xs text-gray-500 font-bold pl-2 w-35 h-12`}
									>
										{item.address}
									</Text>
								</View>

							</View>
						</View>
					)}
				/>
			</View>
		</View>
	);
}

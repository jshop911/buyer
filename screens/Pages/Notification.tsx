import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Alert,
	Image
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Button } from "react-native-paper";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import NotificationData from "../../assets/api/NotificationData";
import app, { db } from "../../config/firebase/Firebase";
import { addDoc, collection, doc, getDocs, serverTimestamp } from "firebase/firestore";

export default function Notification({ navigation, route }) {

	// deal seller
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

	let currentUserUID = app.auth().currentUser.uid;
	const [dealSeller, setDealSeller] = useState();
	
	 const getSellerDeal = async() => {
		const getDataFromFirebase = [];
		const querySnapshot = await getDocs(collection(db, "placeSell"));
		querySnapshot.forEach((doc) => {
			getDataFromFirebase.push({ ...doc.data(), id: doc.id, key: doc.id });
		
		});
		setDealSeller(getDataFromFirebase);
	}

	useEffect(() => {
		getSellerDeal();
	},[]);


	const buyNow = async () => {
		  const docRef = await addDoc(collection(db, "buyerAgree"), {
			dateSell: serverTimestamp(),
			statusMsg: "the buyer, confirmed. Please allow 20 mins for the buyer to arrive at your given address.",
		  });
		  console.log(docRef);
		  Alert.alert("Thank you. The seller notified for your confirmation!");
		  navigation.navigate("BuyConfirmation",{
			itemId: itemId,
			itemName: itemName,
			itemDealPrice: itemDealPrice,
			sellerFirstname: itemFirstName,
			sellerLastname: itemLastName,
			itemAddress: itemAddress,
			minKg: minKg,
			itemSelectedImage: itemSelectedImage,
			
		  })
		
	  };


	return (
		<View style={tw`p-2`}>
		<FlatList
			data={dealSeller}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<View
					style={tw`flex flex-row border-b border-gray-300 bg-gray-200 rounded mb-2`}
				>
					<View style={tw`p-2 self-center`}>
					<Image
					style={tw`w-30 h-35 rounded px-2 border-solid border-2 border-gray-400`}
					source={{
					  uri: item.itemSelectedImage || "https://i.pinimg.com/236x/4e/01/fd/4e01fdc0c233aa4090b13a2e49a7084d.jpg",
					}}
				  />
					</View>
					<View>
						{/* For sellers name and time */}
						<View style={tw`flex-row pt-4`}>
							<View style={tw`w-50`}>
								<Text style={tw`text-lg font-bold`}>{item.sellerFirstName}{item.sellerLastName}</Text>
							</View>
							<View>
								<Text style={tw`text-xs text-gray-600`}>{item.sellDate.toDate().toDateString()}</Text>
							</View>
						</View>
						{/* For sellers name and time end */}

						<View style={tw`pb-2`}>
							<View style={tw`pb-2`}>
								<View style={tw`flex flex-row border-b border-gray-300 pb-2`}>
									<MaterialCommunityIcons
										name="map-marker"
										size={14}
										color={"#223447"}
									/>
									<TouchableOpacity
										onPress={() => navigation.navigate("MapLocation")}
									>
										<Text style={tw`text-sm w-55`}>{item.sellerAddress}</Text>
									</TouchableOpacity>
								</View>

								<Text style={tw`text-base font-bold`}>{item.productName}</Text>
								<Text>Deal Price: {item.itemDealPrice} Php</Text>
								<View style={tw`flex-row `}>
									<Text>Deal kg to buy: </Text>
									<Text>{item.minKg} kg</Text>
								</View>
								<View style={tw`flex-row `}>
									<Text>Total:</Text>
									<Text style={tw`text-red-500 font-bold pl-2`}>
										{item.itemDealPrice * item.minKg} Php
									</Text>
								</View>
							</View>

							<View style={tw`flex-row items-center`}>
								<View style={tw`w-30 pr-2`}>
									<Button
										icon="cart-arrow-down"
										mode="contained"
										color="#faac2a"
										onPress={buyNow}
									>
										Buy now
									</Button>
								</View>
								<View style={tw`w-30`}>
									<Button
										icon="cancel"
										mode="contained"
										color="red"
										onPress={() => console.log("Pressed")}
									>
										Cancel
									</Button>
								</View>
							</View>
						</View>
					</View>
				</View>
			)}
		/>
	</View>

	);
}

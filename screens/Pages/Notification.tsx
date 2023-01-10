import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Button } from "react-native-paper";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import NotificationData from "../../assets/api/NotificationData";
import app, { db } from "../../config/firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Notification({ navigation }) {
	const [data, setData] = useState([]);

	const [userName, setuserName] = useState("");
	const [sellerID, setsellerID] = useState("");
	const [photoURL, setPhotoURL] = useState("");
	const [dealPrice, setDealPrice] = useState("");
	const [minKg, setminKg] = useState("");
	const [totalPrice, settotalPrice]  = useState("");
	const [address, setAddress] = useState("");
	const [dateCreated, setDateCreated] = useState([]);
	
	 const getSellerDeal = async() => {
		const getDataFromFirebase = [];
		const querySnapshot = await getDocs(collection(db, "SellNow"));
		querySnapshot.forEach((doc) => {
			getDataFromFirebase.push({ ...doc.data(), id: doc.id, key: doc.id });
		
		});
		setData(getDataFromFirebase);
	}

	useEffect(() => {
		getSellerDeal();
	},[])


	// useEffect(() => {
	// 	async function getSellerDeal() {
	// 		try {
	// 			let doc = await app
	// 				.firestore()
	// 				.collection("userSeller")
	// 				.doc()
	// 				.get();

	// 			if (!doc.exists) {
	// 				console.log("No user data found!");
	// 			} else {
	// 				let dataObj = doc.data();
	// 				setuserName(dataObj.userName);
	// 				setPhotoURL(dataObj.photoURL);
	// 				setDealPrice(dataObj.dealPrice);
	// 				setAddress(dataObj.address);
	// 				setminKg(dataObj.minKg);
	// 				settotalPrice(dataObj.totalPrice);
	// 				setsellerID(dataObj.id);
	// 			}
	// 		} catch (err) {
	// 			Alert.alert("There is an error.", err.message);
	// 		}
	// 	}
	// 	getSellerDeal();
	// 	getDisplayData();
	//   }, []);
	
	// const getDisplayData = () => {
	// 	const getDataFromFirebase = [];
	// 	const sub = db
	// 	  .collection("SellNow")
	// 	  .where("sellerID", "==", "HWVg6DDBvCbF4xJU0iwO")
	// 	  .onSnapshot((querySnapshot) => {
	// 		querySnapshot.forEach((doc) => {
	// 		  getDataFromFirebase.push({ ...doc.data(), id: doc.id, key: doc.id });
	// 		});
	// 		setData(getDataFromFirebase);
	// 	  });
	//   };

	return (
		<View style={tw`p-2`}>
		<FlatList
			data={data}
			keyExtractor={(item) => item.key}
			renderItem={({ item }) => (
				<View
					style={tw`flex flex-row border-b border-gray-300 bg-gray-200 rounded mb-2`}
				>
					<View style={tw`p-2 self-center`}>
						<Avatar
							size={80}
							rounded
							title="P"
							source={{
								uri: item.profileImage,
							}}
						/>
					</View>
					<View>
						{/* For sellers name and time */}
						<View style={tw`flex-row pt-4`}>
							<View style={tw`w-50`}>
								<Text style={tw`text-lg font-bold`}>{item.userName}</Text>
							</View>
							<View>
								<Text style={tw`text-xs text-gray-600`}>{item.dateCreated}</Text>
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
										<Text style={tw`text-sm w-55`}>{item.address}</Text>
									</TouchableOpacity>
								</View>

								<Text style={tw`text-base font-bold`}>{item.productName}</Text>
								<Text>Deal Price: {item.dealPrice} Php</Text>
								<View style={tw`flex-row `}>
									<Text>Deal kg to buy: </Text>
									<Text>{item.minKg} kg</Text>
								</View>
								<View style={tw`flex-row `}>
									<Text>Total:</Text>
									<Text style={tw`text-red-500 font-bold pl-2`}>
										{item.dealPrice * item.minKg} Php
									</Text>
								</View>
							</View>

							<View style={tw`flex-row items-center`}>
								<View style={tw`w-30 pr-2`}>
									<Button
										icon="cart-arrow-down"
										mode="contained"
										color="#faac2a"
										onPress={() => navigation.navigate("BuyerConfirmation")}
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

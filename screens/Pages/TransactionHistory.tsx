import { View, Text, ScrollView, Image, FlatList } from "react-native";
import tw from "twrnc";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase/Firebase";

const TransactionHistory = () => {

	const [dealSeller, setDealSeller] = useState();
	
	
	useEffect(() => {
		getSellerDeal();
	},[dealSeller]);

	const getSellerDeal = () => {
		// tama na to
		db.collection("BuyStatus")
			.get()
			.then((snapshot) => {
				const myData: React.SetStateAction<undefined> | { id: any; productName: any; minKg: any; sellerAddress: any; itemDealPrice: any; dateReceived: any; sellerFirstName: any; sellerLastName: any; sellerUserID: any; Status: any; selectedProductImage: any; }[] = [];
				
				snapshot.forEach((doc) => {
					const post = doc.data();
					myData.push({
						id: post.id,
						productName: post.productName,
						minKg: post.minKg,
						sellerAddress: post.sellerAddress,
						itemDealPrice: post.itemDealPrice,
						dateReceived: post.dateReceived,
						sellerFirstName: post.sellerFirstName,
						sellerLastName: post.sellerLastName,
						sellerUserID: post.sellerUserID,
						Status: post.Status,
						selectedProductImage: post.selectedProductImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Second-hand_stall_Ueno_Park.jpg/250px-Second-hand_stall_Ueno_Park.jpg",
					});
				});
				console.log(myData);
				setDealSeller(myData);
		  })
		  .catch((error) => {
			console.log("Error getting data: ", error);
		  });
	  };
	  
	return (
		<View style={tw`p-2`}>
			{/* Items to be sold */}
			<ScrollView showsVerticalScrollIndicator={false} style={tw`h-80 mb-12`}>
				<FlatList
					data={dealSeller}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={tw`mt-3`}>
							<View style={tw`bg-gray-200 rounded flex-row`}>
								<View style={tw`p-2`}>
									<Image
										source={{
										uri: item.itemSelectedImage || "https://i.pinimg.com/236x/4e/01/fd/4e01fdc0c233aa4090b13a2e49a7084d.jpg",
										}}
										style={tw`w-22 h-30 p-2 rounded`}
									/>
								</View>
								<View style={tw`pt-2 w-42`}>
									<Text style={tw`text-lg font-bold`}>{item.productName}</Text>
									<Text style={tw`text-[#223447] font-bold underline`}>{item.sellerFirstName } {item.sellerLastName}</Text>
									<View style={tw`flex-row items-center`}>
										<Text style={tw`text-xs text-gray-600 font-bold`}>
											Deal Price:
										</Text>
										<Text style={tw`text-base text-red-500 font-bold`}>
											10 Php / kg
										</Text>
									</View>
									<View style={tw`flex-row items-center`}>
										<Text style={tw`text-xs text-gray-600 font-bold`}>
											Kg sold:
										</Text>
										<Text style={tw`text-sm text-gray-600 font-bold`}> {item.itemDealPrice} kg</Text>
									</View>
									<View style={tw`flex-row items-center`}>
										<Text style={tw`text-xs text-gray-600 font-bold`}>
											Total buy price:
										</Text>
										<Text style={tw`text-sm text-red-500 font-bold`}> ₱{item.itemDealPrice * item.minKg}</Text>
									</View>
								</View>
								<View style={tw`self-center`}>
									<Text style={tw`font-bold`}>Status:</Text>
									<Text style={tw`text-sm text-green-500`}>{item.Status}</Text>
									<Text style={tw`text-xs`}>{item.dateReceived}</Text>
								</View>
							</View>
						</View>
					)}
				/>
			</ScrollView>
		</View>
	);
};

export default TransactionHistory;

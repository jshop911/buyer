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
	const [formId, setFormId] = useState([]);
	const user = getAuth();
	
	let currentUserUID = app.auth().currentUser.uid;

    // useEffect(() => {
    //     const unsubscribe = onSnapshot(nftCollectionRef,snapshot => {
    //         setNFTS(snapshot.docs.map(doc => ({
    //             id:doc.id,
    //             data:doc.data()
    //         })))
    //     })
    //     return () => {
    //         unsubscribe()
    //     }
    // },[])

	// Exporting Collection in easy/cleaner way
 	// export const nftCollectionRef = collection(db,'nfts')

	useEffect(() => {
		getDisplayData()
	}, [])

	const getDisplayData =  () => {
		const getDataFromFirebase = [];
		const sub = db
		.collection("postedItem")
		.where("userId", "==", currentUserUID)
		.onSnapshot((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				getDataFromFirebase.push({ ...doc.data(), id: doc.id, key: doc.id });
			});
			setData(getDataFromFirebase);
			
		});
	};

	// Code ng ibang tao
	// const docRef = doc(db,'nfts',id)

	// let pictureRef =  ref(storage,img)
	// deleteObject(pictureRef)
	//   .then(() => {
	// 	setNFTS(nfts.filter((image) => image.data.img !== img));
	//   })
	//   .catch((error) => console.log(error));

	// deleteDoc(docRef)
	// .then(() => console.log("Deleted"))
	// .catch((err) => console.log(err.message))


	const handleDelete = async ({id}) => {
		// const docRef = doc(db, "postedItem", "Fzugi05BxHNIYmuhJLaY"); // cannot read ng collection id
		// const docRef = doc(db, "postedItem", id); // cannot read ng collection id

		// deleteDoc(docRef)
		// .then(() => {
		// 	console.log(id)
		// 	console.log("Entire Document has been deleted successfully.")
		// 	// alert("Entire Document has been deleted successfully.");
		// })
		// .catch(error => {
		// 	console.log(error);
		// })
		const dataRef = doc(db, "postedItem", id);
		  try {
			await deleteDoc(dataRef);
			setData(data.filter((data) => data.id !== id));
			console.log("Deleted successfully.");
		  } catch (err) {
			console.log(err);
		  } 
		
		
		
		
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

			<View style={tw`flex items-center self-center py-4 mb-18`}>
				<FlatList
					data={data}
					keyExtractor={(item, index) => item.key}
					numColumns={2}
					renderItem={({ item}) => (
						<View style={tw`flex-row p-2`}>
							<View style={tw`bg-gray-200 p-2 w-40 rounded shadow-md`}>
								<Image
									key={item.key}
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

								
								<View style={tw`self-end`}>	
										<TouchableOpacity
											onPress={() => handleDelete(item)}
											// onPress={() => handleDelete(item._id)}
											style={tw`self-center items-center`}
										>
										<MaterialCommunityIcons
											name="delete"
											size={20}
											color="red"
											style={tw`pr-2`}
										/>
										</TouchableOpacity>
									</View>
								
							</View>
						</View>
					)}
				/>
			</View>
		</View>
	);
}

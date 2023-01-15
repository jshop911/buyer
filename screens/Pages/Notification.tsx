import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Button } from "react-native-paper";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import NotificationData from "../../assets/api/NotificationData";
import app, { db } from "../../config/firebase/Firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

export default function Notification({ navigation, route }) {
  // deal seller
  const [dealSeller, setDealSeller] = useState();

  useEffect(() => {
    getSellerDeal();
  }, [dealSeller]);

  const getSellerDeal = () => {
    // tama na to
    db.collection("DealItems")
      .get()
      .then((snapshot) => {
        let myData = [];

        snapshot.forEach((doc) => {
          const post = doc.data();
          myData.push({
            id: post.id,
            productName: post.productName,
            minKg: post.minKg,
            sellerAddress: post.sellerAddress,
            itemDealPrice: post.itemDealPrice,
            dateDeal: post.dateDeal,
            sellerFirstName: post.sellerFirstName,
            sellerLastName: post.sellerLastName,
            sellerUserID: post.sellerUserID,
            selectedProductImage:
              post.selectedProductImage ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Second-hand_stall_Ueno_Park.jpg/250px-Second-hand_stall_Ueno_Park.jpg",
          });
        });

        setDealSeller(myData);
      })
      .catch((error) => {
        console.log("Error getting data: ", error);
      });
  };

  //for delete

  // const deleteItem = async (id) => {
  // 	await db.collection("posts").doc(id).delete();
  // 	console.log("Deleted ", id);
  //   };

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
                style={tw`w-20 h-25 rounded px-2 border-solid border-2 border-gray-400`}
                source={{
                  uri:
                    item.itemSelectedImage ||
                    "https://i.pinimg.com/236x/4e/01/fd/4e01fdc0c233aa4090b13a2e49a7084d.jpg",
                }}
              />
            </View>
            <View>
              {/* For sellers name and time */}
              <View style={tw`flex-row pt-4 self-center`}>
                <View style={tw`w-46 self-center`}>
                  <Text style={tw`text-lg font-bold`}>
                    {item.sellerFirstName}
                    {item.sellerLastName}
                  </Text>
                </View>
                <View>
                  <Text style={tw`text-xs text-gray-600 self-center `}>
                    {item.dateDeal.toDate().toDateString()}
                  </Text>
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
                      <Text style={tw`text-sm w-50`}>{item.sellerAddress}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={tw`text-base font-bold`}>
                    {item.productName}
                  </Text>
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
                      onPress={() =>
                        navigation.navigate("BuyerConfirmation", {
                          id: item.id,
                          productName: item.productName,
                          minKg: item.minKg,
                          sellerAddress: item.sellerAddress,
                          dealPrice: item.dealPrice,
                          dateSell: item.dateSell,
                          sellerFirstName: item.sellerFirstName,
                          sellerLastName: item.sellerLastName,
                          sellerUserID: item.sellerUserID,
                          itemDealPrice: item.itemDealPrice,
                          selectedProductImage: item.selectedProductImage,
                        })
                      }
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

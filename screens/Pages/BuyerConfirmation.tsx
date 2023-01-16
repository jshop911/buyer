import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Touchable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { LogBox } from "react-native";
import app, { db } from "../../config/firebase/Firebase";
import { query, serverTimestamp } from "firebase/firestore";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

LogBox.ignoreLogs(["Firebase Analytics is not available in the Expo client"]);

export default function BuyerConfirmation({ navigation, route }) {
  // const {
  //   id,
  //   productName,
  //   minKg,
  //   sellerAddress,
  //   sellDate,
  //   sellerFirstName,
  //   sellerLastName,
  //   sellerUserID,
  //   itemDealPrice,
  //   selectedProductImage,
  // } = route?.params || {};

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  let currentUserUID = app.auth().currentUser.uid;

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const getDataFromDB = [];
    const sub = db.collection("placeSell").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getDataFromDB.push({ ...doc.data(), id: doc.id });
      });
      setData(getDataFromDB);
      setLoading(false);
    });
  };

  const onBuyPress = async ({
    minKg,
    buyerAddress,
    dealPrice,
    id,
    itemDealPrice,
    itemId,
    productName,
    selectedProductImage,
    sellerFirstName,
    sellerLastName,
    sellerUserID,
  }) => {
    const sendToTransactionHistory = {
      id: uuidv4(),
      userId: currentUserUID,
      sellerUserID: sellerUserID,
      productName: productName,
      selectedProductImage:
        selectedProductImage ||
        "https://i.pinimg.com/236x/4e/01/fd/4e01fdc0c233aa4090b13a2e49a7084d.jpg",
      itemDealPrice: itemDealPrice,
      minKg: minKg,
      sellerFirstName: sellerFirstName,
      address: buyerAddress,
      dateReceived: serverTimestamp(),
      Status: "Done",
    };

    return await Promise.all([
      db
        .collection("TransactionHistory")
        .doc()
        .set(sendToTransactionHistory)
        .then(async () => {
          Alert.alert("Item received successfully!.");
          await db.collection("placeSell").doc(id).delete();
          setData(data.filter((data) => data.id !== id));
          navigation.navigate("TransactionHistory");
        })
        .catch((err) => {
          console.log(err);
        }),
    ]);
  };
  return (
    <>
      <View style={tw`p-2`}>
        {loading && <Text>Loading...</Text>}
        {/* Items to be sold */}
        <FlatList
          data={data}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          renderItem={({ item, index }) => (
            <View
              style={tw`my-2 py-2 bg-gray-200 rounded flex-row`}
              key={index}
            >
              <View style={tw`p-2`}>
                <Image
                  style={tw`w-20 h-25 rounded px-2 border-solid border-2 border-gray-400`}
                  source={{
                    uri:
                      item.selectedProductImage ||
                      "https://i.pinimg.com/236x/4e/01/fd/4e01fdc0c233aa4090b13a2e49a7084d.jpg",
                  }}
                />
              </View>
              <View style={tw`pt-2 w-35 border-r border-gray-300`}>
                <Text style={tw`text-base font-bold`}>{item.productName}</Text>
                <Text style={tw`text-[#223447] font-bold underline`}>
                  {item.sellerFirstName} {item.sellerLastName}
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
                    <Text style={tw`text-xs w-30`}>{item.sellerAddress}</Text>
                  </TouchableOpacity>
                </View>

                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-xs text-gray-600 font-bold`}>
                    Deal Price:
                  </Text>
                  <Text style={tw`text-red-500 font-bold`}>
                    {item.itemDealPrice} Php / kg
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-xs text-gray-600 font-bold`}>
                    Kg sold:
                  </Text>
                  <Text style={tw`text-sm text-gray-600 font-bold`}>
                    {item.minKg * item.itemDealPrice} kg
                  </Text>
                </View>
              </View>
              {/* Buyers confirmation */}
              <View style={tw`self-center p-2 w-25`}>
                <Text style={tw`font-bold  text-center`}>Status:</Text>
                <TouchableOpacity onPress={() => onBuyPress(item)}>
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
                {/* <Text style={tw`text-xs`}>
                  {JSON.stringify(item.dateReceived)}
                </Text> */}
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
}

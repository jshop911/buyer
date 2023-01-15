import * as React from "react";
import { useEffect, useState, useRef, useReducer } from "react";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import {
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import tw from "twrnc";
import { Input, Overlay, Button } from "react-native-elements";
import PostItem from "./Post Item/PostItem";
import * as ImagePicker from "expo-image-picker";
import { RootTabScreenProps } from "../../types";
import app, { db } from "../../config/firebase/Firebase";
import CustomBtn from "../../components/CustomBtn";
import { Picker } from "@react-native-picker/picker";
import { LogBox } from "react-native";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

LogBox.ignoreLogs(["Firebase Analytics is not available in the Expo client"]);

export default function Home({ navigation }: RootTabScreenProps<"Home">) {
  // user's info
  let currentUserUID = app.auth().currentUser.uid;
  const [userName, setUserName] = useState("");
  const [typeOfUser, setTypeOfUser] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  //Upload item
  const pickerRef = useRef();
  const [listOfCategory, setListOfCategory] = useState("");
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [dealPrice, setDealPrice] = useState("");
  const [addItemToBuy, setAddItemToBuy] = useState(false);

  // upload image
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  // modal FOR ADD ITEM
  const uploadItemtoBuy = () => {
    setAddItemToBuy(!addItemToBuy);
  };

  // Counting buttonStyle
  let [count, setCount] = useState(0);

  function incrementCount() {
    count = count + 1;
    setCount(count);
  }
  function decrementCount() {
    count = count - 1;
    setCount(count);
  }

  useEffect(() => {
    async function getUserInfo() {
      try {
        let doc = await app
          .firestore()
          .collection("userBuyer")
          .doc(currentUserUID)
          .get();

        if (!doc.exists) {
          Alert.alert("No user data found!");
        } else {
          let dataObj = doc.data();
          setUserName(dataObj.userName);
          setPhotoURL(dataObj.photoURL);
          setTypeOfUser(dataObj.typeOfUser);
          setAddress(dataObj.address);
        }
      } catch (err) {
        Alert.alert("There is an error.", err.message);
      }
    }
    getUserInfo();
  });

  // add profile Image
  const addProductImage = async () => {
    // For the getting image from the gallery folder
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    });

    // if they want to cancelled or edit the image selected
    if (!_image.canceled) {
      setSelectedProductImage(_image.assets[0].uri);
    }
  };

  const uid = (currentUserUID ?? [])[0];

  async function postItem() {
    let currentUserUID = app.auth().currentUser.uid;

    if (
      productName === "" ||
      productDesc === "" ||
      listOfCategory === "" ||
      selectedProductImage === "" ||
      dealPrice === ""
    ) {
      alert("Please fill up all the require info.");
    } else if (count == 0) {
      alert("Please input minimum kg.");
    } else {
      const addPostItem = {
        id: uuidv4(),
        userId: currentUserUID,
        productName: productName,
        productDesc: productDesc,
        listOfCategory: listOfCategory,
        selectedProductImage:
          selectedProductImage ||
          "https://i.pinimg.com/236x/4e/01/fd/4e01fdc0c233aa4090b13a2e49a7084d.jpg",
        dealPrice: dealPrice,
        minKg: count,
        userName: userName,
        address: address,
        timestamp: serverTimestamp(),
      };

      return await Promise.all([
        db
          .collection("postedItem")
          .doc()
          .set(addPostItem)
          .then(() => {
            setAddItemToBuy(!addItemToBuy);
            Alert.alert("Item successfully added.");
            return null;
          }),
        setSelectedProductImage(null),
        setAddress(""),
        setListOfCategory(""),
        setProductName(""),
        setProductDesc(""),
        setDealPrice(""),
        setCount(0),
      ]).catch((error) => {
        Alert.alert(error.message);
      });
    }
  }

  return (
    <View style={tw`w-full py-2`}>
      <StatusBar />
      {/* Uploading new item to buy. -start */}
      <Overlay isVisible={addItemToBuy} onBackdropPress={uploadItemtoBuy}>
        <View style={tw`p-4 w-80`}>
          <Text style={tw`text-lg font-bold text-center`}>
            Post an item you want to buy!
          </Text>
          {/* ------ Upload Image ---------- */}
          <View
            style={tw`h-30 w-30 self-center h-30 w-50 my-4 bg-gray-300 rounded relative overflow-hidden border-4 border-gray-100 shadow`}
          >
            {selectedProductImage && (
              <Image
                source={{ uri: selectedProductImage }}
                style={tw`w-50 h-30`}
              />
            )}

            <View
              style={tw`absolute right-0 bottom-0 w-50 h-10 opacity-70 bg-[#faac2a]`}
            >
              <TouchableOpacity
                onPress={addProductImage}
                style={tw`self-center items-center`}
              >
                <View style={tw`flex-row pt-3`}>
                  <View>
                    <AntDesign name="camera" size={18} color="#000" />
                  </View>
                  <View style={tw`pl-2`}>
                    <Text style={tw`text-xs`}>
                      {selectedProductImage ? "Edit" : "Upload"} Image
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* ----x-- Upload Image ------x---- */}
          <Input
            placeholder="Product Name"
            leftIcon={{
              type: "MaterialCommunityIcons",
              name: "drive-file-rename-outline",
            }}
            style={tw``}
            value={productName}
            onChangeText={(txt) => setProductName(txt)}
          />
          <Input
            placeholder="Product Description"
            leftIcon={{
              type: "MaterialCommunityIcons",
              name: "label-outline",
            }}
            maxLength={150}
            multiline
            numberOfLines={2}
            style={tw``}
            value={productDesc}
            onChangeText={(txt) => setProductDesc(txt)}
          />

          <Picker
            ref={pickerRef}
            selectedValue={listOfCategory}
            outlineColor="#33c9fe"
            activeOutlineColor="#FF0000"
            style={tw`ml-1 mb-2 p-2 text-base text-gray-500 bg-[#e0e0e0] w-full h-10`}
            onValueChange={(itemValue, itemIndex) =>
              setListOfCategory(itemValue)
            }
          >
            <Picker.Item label="Category Items" value="Month" enabled={false} />
            <Picker.Item label="#Random Metal" value="#Random Metal" />
            <Picker.Item label="#Used Tires" value="#Used Tires" />
            <Picker.Item label="#Bottles" value="#Bottles" />
            <Picker.Item label="#Wires and Cables" value="#Wires and Cables" />
            <Picker.Item label="#Appliances" value="#Appliances" />
            <Picker.Item label="#Bike" value="#Bike" />
            <Picker.Item label="#Waste Foods" value="#Waste Foods" />
            <Picker.Item label="#Box" value="#Box" />
            <Picker.Item label="#Gorrugated Roof" value="#Gorrugated Roof" />
            <Picker.Item label="#News Papers" value="#News Papers" />
            <Picker.Item label="#Gadgets" value="#Gadgets" />
            <Picker.Item label="#Others" value="#Others" />
          </Picker>
          <Input
            placeholder="Deal Price"
            leftIcon={{
              type: "entypo",
              name: "price-tag",
            }}
            keyboardType="numeric"
            style={tw`pt-2`}
            value={dealPrice}
            onChangeText={(txt) => setDealPrice(txt)}
          />
          <View style={tw`flex-row pl-3 pb-2`}>
            <View>
              <Text style={tw`pt-2 text-gray-600`}>Minimum kg to buy.</Text>
            </View>
            <View>
              <Button
                title="-"
                buttonStyle={{
                  backgroundColor: "#faac2a",
                  borderRadius: 3,
                  fontSize: 14,
                }}
                containerStyle={{
                  width: 40,
                  marginHorizontal: 10,
                  marginVertical: 0,
                }}
                onPress={decrementCount}
              />
            </View>
            <View style={tw`px-2 w-10 self-center`}>
              <Text style={tw`font-bold`}>{count}</Text>
            </View>
            <View>
              <Button
                title="+"
                buttonStyle={{
                  backgroundColor: "#faac2a",
                  borderRadius: 3,
                  fontSize: 14,
                }}
                containerStyle={{
                  width: 40,
                  marginHorizontal: 10,
                  marginVertical: 0,
                }}
                onPress={incrementCount}
              />
            </View>
          </View>

          <CustomBtn
            onPress={undefined}
            text={"Post Item"}
            onPress={postItem}
          />
        </View>
      </Overlay>
      {/* Uploading new Item to buy - end */}
      {/* Body of buyer's homepage */}
      <View style={tw`flex flex-row p-2 bg-gray-100 border-b border-gray-300`}>
        <View style={tw`pl-3`}>
          <View style={tw` flex-row w-72`}>
            <Image
              source={photoURL ? { uri: photoURL } : { uri: "no-image" }}
              style={tw`w-12 h-12 rounded-full mr-2`}
            />
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={tw`text-xl text-[#223447] font-bold`}>
                {userName}
              </Text>
              <Text style={tw`text-xs text-green-600`}>
                <MaterialCommunityIcons
                  name="shield-account"
                  size={18}
                  color="green"
                  style={tw`pr-2`}
                />
                {typeOfUser}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`self-center`}>
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={uploadItemtoBuy}
          >
            <MaterialCommunityIcons
              name="plus"
              size={40}
              color="green"
              style={tw`pr-2`}
            />
          </Pressable>
        </View>
      </View>
      <PostItem navigation={undefined} />
    </View>
  );
}

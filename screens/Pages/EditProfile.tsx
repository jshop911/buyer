import React, { useState, useEffect, useRef } from "react";
import tw from "twrnc";
import {
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Input } from "react-native-elements";
import { RadioButton, Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import PhoneInput from "react-native-phone-number-input";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import CustomBtn from "../../components/CustomBtn";
import app from "../../config/firebase/Firebase";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const auth = getAuth();

const EditProfile = ({ navigation }) => {
  const { user } = useAuthentication();
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const pickerRef = React.useRef();

  const getUser = async () => {
    const currentUser = await app
      .firestore()
      .collection("userBuyer")
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  const handleUpdate = async () => {
    let imgUrl = await updateProfileImage();

    if (imgUrl == null && userData.photoURL) {
      imgUrl = userData.photoURL;
    }

    app
      .firestore()
      .collection("userBuyer")
      .doc(user.uid)
      .update({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        birthDay: userData.birthDay,
        birthMonth: userData.birthMonth,
        birthYear: userData.birthYear,
        phoneNum: userData.phoneNum,
        address: userData.address,
        gender: userData.gender,
        password: userData.password,
        photoURL: imgUrl,
      })
      .then(() => {
        console.log("User Updated!");
        Alert.alert(
          "Profile Updated!",
          "Your profile has been updated successfully."
        );
      });
  };

  useEffect(() => {
    checkForCameraRollPermission();
    getUser();
  }, []);

  // update profile Image
  const updateProfileImage = async () => {
    // For the getting image from the gallery folder
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    });

    // if they want to cancelled or edit the image selected
    if (!_image.canceled) {
      setSelectedImage(_image.assets[0].uri);
    }
  };

  // for capturing image
  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Please grant camera roll permissions inside your system's settings"
      );
    } else {
      console.log("Media Permissions are granted");
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView>
        <View style={tw`flex-1 bg-[#e0e0e0]`}>
          {/* ------ Upload Image ---------- */}
          <View
            style={tw`h-30 w-30 self-center h-30 w-30 mt-4 bg-gray-300 rounded-full relative overflow-hidden border-4 border-gray-100 shadow`}
          >
            {selectedImage && (
              <Image
                source={{
                  uri: selectedImage
                    ? selectedImage
                    : userData.userImg ||
                      "https://as2.ftcdn.net/v2/jpg/02/28/83/95/1000_F_228839560_CJsLcejpguupG538AzGliilocetAIZ7K.jpg",
                }}
                style={tw`w-30 h-30`}
              />
            )}

            <View
              style={tw`absolute right-0 bottom-0 w-30 h-10 opacity-70 bg-[#faac2a]`}
            >
              <TouchableOpacity
                onPress={updateProfileImage}
                style={tw`self-center items-center`}
              >
                <Text style={tw`text-xs`}>
                  {selectedImage ? "Edit" : "Upload"} Image
                </Text>
                <AntDesign name="camera" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          {/* ----x-- Upload Image ------x---- */}

          <View style={tw`px-4`}>
            <Input
              placeholder="First Name"
              containerStyle={tw`pt-3`}
              autoCapitalize="none"
              keyboardType="default"
              value={userData ? userData.firstName : ""}
              onChangeText={(txt) =>
                setUserData({ ...userData, firstName: txt })
              }
              leftIcon={<Icon name="user" size={16} />}
            />
            <Input
              placeholder="Last Name"
              autoCapitalize="none"
              keyboardType="default"
              value={userData ? userData.lastName : ""}
              onChangeText={(txt) =>
                setUserData({ ...userData, lastName: txt })
              }
              leftIcon={<Icon name="user" size={16} />}
            />
            <Input
              placeholder="Username"
              autoCapitalize="none"
              keyboardType="default"
              value={userData ? userData.userName : ""}
              onChangeText={(txt) =>
                setUserData({ ...userData, userName: txt })
              }
              leftIcon={<Icon name="user" size={16} />}
            />

            {/* ----  Phone number ------  */}
            <Input
              placeholder="Phone"
              keyboardType="numeric"
              value={userData ? userData.phoneNum : ""}
              onChangeText={(txt) =>
                setUserData({ ...userData, phoneNum: txt })
              }
              leftIcon={<Icon name="phone" size={16} />}
            />

            {/* ----  birthday ------  */}
            <View style={tw`pt-4 flex-row self-center`}>
              <FontAwesome
                name="birthday-cake"
                size={16}
                color={"#223447"}
                style={tw`pt-5`}
              />
              {/* -- birth day --- */}
              <Picker
                ref={pickerRef}
                selectedValue={userData ? userData.birthDay : ""}
                outlineColor="#33c9fe"
                activeOutlineColor="#FF0000"
                style={tw`ml-1 p-2 text-base text-gray-500 bg-[#e0e0e0] w-23 h-10`}
                onValueChange={(txt) =>
                  setUserData({ ...userData, birthDay: txt })
                }
              >
                <Picker.Item label="Day" value="Day" enabled={false} />
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
                <Picker.Item label="7" value="7" />
                <Picker.Item label="8" value="8" />
                <Picker.Item label="9" value="9" />
                <Picker.Item label="10" value="10" />
                <Picker.Item label="11" value="11" />
                <Picker.Item label="12" value="12" />
                <Picker.Item label="13" value="13" />
                <Picker.Item label="14" value="14" />
                <Picker.Item label="15" value="15" />
                <Picker.Item label="16" value="16" />
                <Picker.Item label="17" value="17" />
                <Picker.Item label="18" value="18" />
                <Picker.Item label="19" value="19" />
                <Picker.Item label="20" value="20" />
                <Picker.Item label="21" value="21" />
                <Picker.Item label="22" value="22" />
                <Picker.Item label="23" value="23" />
                <Picker.Item label="24" value="24" />
                <Picker.Item label="25" value="25" />
                <Picker.Item label="26" value="26" />
                <Picker.Item label="27" value="27" />
                <Picker.Item label="28" value="28" />
                <Picker.Item label="29" value="29" />
                <Picker.Item label="30" value="30" />
                <Picker.Item label="31" value="31" />
              </Picker>
              {/* -- birth month --- */}
              <Picker
                ref={pickerRef}
                selectedValue={userData ? userData.birthMonth : ""}
                outlineColor="#223447"
                activeOutlineColor="#FF0000"
                style={tw`ml-1 px-2 text-base text-gray-500 bg-[#e0e0e0] w-30 h-10`}
                onValueChange={(txt) =>
                  setUserData({ ...userData, birthMonth: txt })
                }
              >
                <Picker.Item label="Month" value="Month" enabled={false} />
                <Picker.Item label="JAN" value="January" />
                <Picker.Item label="FEB" value="February" />
                <Picker.Item label="MAR" value="March" />
                <Picker.Item label="APR" value="April" />
                <Picker.Item label="MAY" value="May" />
                <Picker.Item label="JUN" value="June" />
                <Picker.Item label="JUL" value="July" />
                <Picker.Item label="AUG" value="August" />
                <Picker.Item label="SEP" value="September" />
                <Picker.Item label="OCT" value="October" />
                <Picker.Item label="NOV" value="November" />
                <Picker.Item label="DEC" value="December" />
              </Picker>
              {/* ----  Birth Year ------  */}
              <Input
                placeholder="Year"
                autoCapitalize="none"
                keyboardType="default"
                value={userData ? userData.birthYear : ""}
                containerStyle={tw`w-20`}
                keyboardType="numeric"
                underlineColorAndroid="transparent"
                onChangeText={(text) =>
                  setUserData({ ...userData, birthYear: text })
                }
              />
            </View>

            <Input
              placeholder="Address"
              autoCapitalize="none"
              keyboardType="default"
              value={userData ? userData.address : ""}
              onChangeText={(text) =>
                setUserData({ ...userData, address: text })
              }
              leftIcon={<Icon name="map-marker" size={16} />}
            />

            {/* ----- terms and conditions ----- */}
            <View style={tw`ml-2 py-2`}>
              <Text style={tw`text-sm text-gray-500`}>
                By clicking update button, you can confirm that you accept our
                <Text style={tw`text-red-600 font-bold`}>
                  {" "}
                  Terms of use
                </Text>{" "}
                and
                <Text style={tw`text-red-600 font-bold`}> Privacy Policy.</Text>
              </Text>
            </View>

            {/* This is the Submit Button section */}
            <CustomBtn text="Update" onPress={handleUpdate} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default EditProfile;

import React, { useState } from "react";
import { View, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import tw from "twrnc";

export default function BuyerLocation() {
	const imageURL = "https://cdn-icons-png.flaticon.com/512/1673/1673221.png";
	const [mapRegion, setmapRegion] = useState({
		latitude: 14.1868461,
		longitude: 121.2318064,
		latitudeDelta: 0.0012,
		longitudeDelta: 0.0011,
	});

	return (
		<View style={tw`flex-1`}>
			<MapView
				style={{ alignSelf: "stretch", height: "100%" }}
				region={mapRegion}
				provider={PROVIDER_GOOGLE}
			>
				<Marker coordinate={mapRegion}>
					<Image style={tw`w-12 h-14`} source={{ uri: imageURL }} />
				</Marker>
			</MapView>
		</View>
	);
}

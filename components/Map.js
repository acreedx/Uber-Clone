import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectDestination, selectOrigin, selectTravelTimeInformation, setTravelTimeInformation } from "../slices/navSlice";
const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const mapRef = useRef(null);
    const travelTime = useSelector(selectTravelTimeInformation);
    const dispatch = useDispatch();
    useEffect(() => {
        if(!origin || !destination || !travelTime) return;

        //Zoom and fit to markers
        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
            edgePadding: {top:50, right: 50, bottom: 50, left: 50},
        });
    },[origin, destination, travelTime]);

    useEffect(() => {
        if(!origin || !destination) return;
        
        const getTravelTime = async () => {
            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?
            units=imperial&origins=${origin.description}&destinations=
            ${destination.description}&key=AIzaSyDd4DjYXdbqxFp2ph0PS5ruZKNTU40N3kw`
            )
            .then((res) => res.json())
            .then((data) => {
                dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
            });
        };
        getTravelTime();
    }, [origin, destination]);
    return (
        <MapView
            ref={mapRef}
            style={tw`flex-1`}
            mapType="hybrid"
            initialRegion={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >   
            {origin && destination && (
                <MapViewDirections
                    origin={origin.description}
                    destination={destination.description}
                    apikey="AIzaSyDd4DjYXdbqxFp2ph0PS5ruZKNTU40N3kw"
                    strokeWidth={3}
                    strokeColor="black"
                />
            )}
            {origin?.location && (
                <Marker
                    coordinate={{
                        latitude: origin.location.lat,
                        longitude: origin.location.lng,
                    }}
                    title="Origin"
                    description={origin.description}
                    identifier={'origin'}
                />
            )}
            {destination?.location && (
                <Marker
                    coordinate={{
                        latitude: destination.location.lat,
                        longitude: destination.location.lng,
                    }}
                    title="Destination"
                    description={destination.description}
                    identifier={'destination'}
                />
            )}
        </MapView>
    );
};

export default Map

const styles = StyleSheet.create({});
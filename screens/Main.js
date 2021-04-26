import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapPage from "./Map";

const MainPage = () => {
  const [permisoGeo, setPermisoGeo] = useState(null);
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermisoGeo(status === "granted");

      let location = await Location.getCurrentPositionAsync({});
      setLatitud(location.coords.latitude);
      setLongitud(location.coords.longitude);

    })();
  }, []);

  if (!permisoGeo) {
    return <Text>Esperando por permiso de Geolocalizacion</Text>;
  }

  return (
    <View style={styles.container}>
      <MapPage latitud={latitud} longitud={longitud}></MapPage>
    </View>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f4c8c",
    alignItems: "center",
    justifyContent: "center",
  },
});

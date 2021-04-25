import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "./../context/context";

const MainPage = () => {
  const [permisoGeo, setPermisoGeo] = useState(null);
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [boton, setBoton] = useState("Marcar Ingreso");
  const { signOut } = useContext(AuthContext);
  const [userName, setUserName] = useState('')

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermisoGeo(status === "granted");

      let location = await Location.getCurrentPositionAsync({});
      setLatitud(location.coords.latitude);
      setLongitud(location.coords.longitude);

      const nombre = await AsyncStorage.getItem('userName')
      setUserName(nombre)
      console.log(userName)
    })();
  }, []);

  if (!permisoGeo) {
    return <Text>Esperando por permiso de Geolocalizacion</Text>;
  }

  const Reporte = async () => {
    try {
      let request = await fetch(
        "https://javier123456.000webhostapp.com/controllers/servicio.php?service=Report"
      );
      let json = await request.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const Registro = async () => {
    setBoton("Marcar Salida");
    const id = await AsyncStorage.getItem('userID')
    try {
      const latLong = `${latitud}, ${longitud}`;
      let request = await fetch(
        "https://javier123456.000webhostapp.com/controllers/servicio.php?service=Register",
        {
          method: "POST",
          body: JSON.stringify({
            id: id,
            geo: latLong,
          }),
        }
      );
      let json = await request.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const Logout = async () => {
    signOut();
  };

  return (
    <View style={styles.container}>
        <Text style={{textTransform : 'capitalize', fontSize : 20}}>Bienvenido : {userName} </Text>
      <View style={styles.buttons}>
        <Button color="green" title="Reporte" onPress={Reporte} />
        <Button color="#cba" title={boton} onPress={Registro} />
        <Button color="#01b" title="Cerrar Sesion" onPress={Logout} />
      </View>
      <View style={styles.mapsContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: latitud,
            longitude: longitud,
            latitudeDelta: 0.015,
            longitudeDelta: 0.121,
          }}
          mapType={"standard"}
          loadingEnabled={true}
        >
          <Marker
            coordinate={{ latitude: latitud, longitude: longitud }}
            pinColor={"#ccc"}
            title={"Mi ubicacion"}
            description={"Descripcion de la ubicacion"}
          />
        </MapView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapsContainer: {
    padding: 30,
  },
  map: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height - 150,
  },
  buttons: {
    flexDirection: "row",
  },
});

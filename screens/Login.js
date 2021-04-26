import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "./../context/context";

const LoginPage = () => {
  const { colors } = useTheme();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(true);
  const { signIn } = useContext(AuthContext);

  const textInputChange = (val) => {
    setUserName(val);
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
  };

  const updateSecureTextEntry = () => {
    setTogglePassword(!togglePassword);
  };

  const Login = async (userName, password) => {
    try {
      let request = await fetch(
        "https://javier123456.000webhostapp.com/controllers/servicio.php?service=Login",
        {
          method: "POST",
          body: JSON.stringify({
            nombre: userName,
            password: password,
          }),
        }
      );
      let response = await request.json();
      if (typeof response == "object") {
        signIn(response);
        try {
          await AsyncStorage.setItem("userName", response.nombre);
        } catch (error) {
          console.log(error);
        }
      } else if (typeof response == "string") {
        Alert.alert("Intente nuevamente", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#006699" barStyle="light-content" />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duraton="1500"
          source={require("../assets/favicon.png")}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.text_header}>Inicio de Sesion</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}
        >
          Nombre de usuario
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="usuario"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => {
              textInputChange(val);
            }}
          />
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 35,
            },
          ]}
        >
          Contraseña
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            placeholder="contraseña"
            placeholderTextColor="#666666"
            secureTextEntry={togglePassword ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => {
              handlePasswordChange(val);
            }}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {togglePassword ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text
            style={{
              color: "#abc",
              marginTop: 15,
              letterSpacing: 1.5,
            }}
          ></Text>
        </TouchableOpacity>

        <View style={styles.button}>
          <TouchableOpacity
            activeOpacity={0}
            style={styles.signIn}
            onPress={() => {
              Login(userName, password);
            }}
          >
            <Text>Iniciar Sesion</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default LoginPage;
const { height } = Dimensions.get("screen");
const height_logo = height * 0.1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#006699",
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  header: {
    flex: 2,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontSize: 30,
    letterSpacing: 3,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    letterSpacing: 1.3,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0049",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
    letterSpacing: 2,
  },
  errorMsg: {
    color: "#FF0049",
    fontSize: 14,
  },
  errorValid: {
    color: "#FF0049",
    fontSize: 16,
    marginTop: 15,
  },
  button: {
    alignItems: "center",
    marginTop: 40,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#bbb",
  },
  textSign: {
    fontSize: 20,
  },
});

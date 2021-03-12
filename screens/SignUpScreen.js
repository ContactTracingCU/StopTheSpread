import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
//custom components
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";

const SignUpScreen = ({ navigation }) => {
  //states for email, password, and confirm password
  //[getter, setter] = useState(initialValue)
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  //hooks context for linking button to FB
  const { register } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/stsLogo.png")} style={styles.logo} />
      <Text style={styles.text}>Create an account</Text>

      <FormInput
        placeholderText="Email"
        keyboardType="email-address"
        labelValue={email}
        onChangeText={(userEmail) => {
          return setEmail(userEmail);
        }}
      />

      <FormInput
        placeholderText="Password"
        secureTextEntry={true}
        labelValue={password}
        onChangeText={(userPassword) => {
          return setPassword(userPassword);
        }}
      />

      <FormInput
        placeholderText="Confirm Password"
        secureTextEntry={true}
        labelValue={confirmPassword}
        onChangeText={(userConfirmPassword) => {
          return setConfirmPassword(userConfirmPassword);
        }}
      />

      <FormButton
        buttonTitle="Sign Up"
        onPress={() => {
          return register(email, password);
        }}
      />

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => {
          return navigation.navigate("Login");
        }}
      >
        <Text style={styles.navButtonText}>
          Already have an account? Sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#a6e4d0',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    height: 250,
    width: 250,
    resizeMode: "cover",
    top: -40,
  },
  text: {
    fontSize: 28,
    marginBottom: -40,
    color: "#051d5f",
    // marginVertical: 35,
    top: -60,
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
  },
});

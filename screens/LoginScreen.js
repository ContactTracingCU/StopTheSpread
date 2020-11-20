import React, {useContext, useState} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
//custom components
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';


const LoginScreen = ({navigation}) =>{
    //states for email and password
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    //hooks context for linkign button to FB
    const {login} = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/cov2.png')} 
                style={styles.logo}
            />
            <Text style={styles.text}>Login</Text>

            <FormInput
                placeholderText='Email'
                keyboardType ='email-address'
                labelValue={email}
                onChangeText={(userEmail) => { return setEmail(userEmail)}}

            />

            <FormInput
                placeholderText='Password'
                secureTextEntry={true}
                labelValue={password}
                onChangeText={(userPassword) => { return setPassword(userPassword)}}

            />

            <FormButton 
                buttonTitle='Sign In'
                onPress={() => { return login(email, password)}}
            />
            
            <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
                <Text style={styles.navButtonText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotButton} onPress={() => { return navigation.navigate('SignUp')}}>
                <Text style={styles.navButtonText}>Don't have an account? Create here</Text>
            </TouchableOpacity>

        </View>

    );
};
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f9fafd',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    logo: {
      height: 150,
      width: 150,
      resizeMode: 'cover',
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      color: '#051d5f',
      marginVertical: 35
    },
    navButton: {
      marginTop: 15,
    },
    forgotButton: {
      marginVertical: 35,
    },
    navButtonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#2e64e5'
    },
  });
  

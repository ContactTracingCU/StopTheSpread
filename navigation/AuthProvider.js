import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/database';
export const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const db = firebase.app().database('https://sts0-76694.firebaseio.com');
    let iStat = '';
    
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await auth().signInWithEmailAndPassword(email, password);
                    } catch(e){
                        console.log(e);
                    }
                },
                register: async (email, password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password,)
                        .then((res) => {
                            db.ref('users/' + res.user.uid).set({
                                email: email,
                                password: password,
                        
                            })
                        })
                    } catch(e){
                        console.log(e);
                    }
                },
                logout: async () => {
                    try{
                        await auth().signOut();
                    } catch(e){
                        console.log(e);
                    }
                },
                setUserInfectionStatus: (props) =>{
                    pushData = db.ref('users/' + user.uid).update({
                        infectionStatus: props
                    })
                   
                },
                getUserInfectionStatus: () =>{
                    db.ref('users/' + user.uid + '/infectionStatus').on('value', snapshot => {
                        iStat = snapshot.val();
                      });
                    
                    return iStat;
                },
                setUserLocationInfo: (props) => {
                    pushData = db.ref('users/' + user.uid + '/locationInfo').update({
                        lat: props.coords.latitude,
                        long: props.coords.longitude,
                        time: props.timestamp,

                    })
                }
            }}
        >
            {children}

        </AuthContext.Provider>
    );
}
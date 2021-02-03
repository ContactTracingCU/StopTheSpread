import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/database';
export const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const db = firebase.app().database('https://sts0-76694.firebaseio.com');
    let iStat = '';
    let iCont = '';
    let keys = '';
    
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
                                infectionStatus: 'N',
                        
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
                   if(props == 'P')
                   {
                        var updates = {};
                        updates[user.uid] = true;
                       db.ref('testedPositive/').update(updates)
                   }
                   else
                   {
                        db.ref("testedPositive").child(user.uid).remove()
                   }
                },
                getUserInfectionStatus: () =>{
                    db.ref('users/' + user.uid + '/infectionStatus').on('value', snapshot => {
                        iStat = snapshot.val();
                      });
                    
                    return iStat;
                },
                getUserContacts: () => {
                    db.ref('users/' + user.uid + '/positiveContacts').on('value', snapshot => {
                        iCont = snapshot.val();
                      });

                      return Object.keys(iCont).length
                },
                setUserLocationInfo: (props) => {
                    if(props.coords.speed < 5){
                        pushData = db.ref('users/' + user.uid + '/locationInfo/').update({
                            lat: props.coords.latitude,
                            long: props.coords.longitude,
                            time: props.timestamp,
    
                        })
                    }
                    
                },
                uploadUserLocation: (props, county) => {
                    if(props.coords.speed < 5){ //if user is not traveling by motor vehicle, upload their location data.
                        pushData = db.ref('locations/' + county + '/' + Math.trunc(props.timestamp)).push({
                            user : user.uid,
                            lat: props.coords.latitude,
                            long: props.coords.longitude,
                        })
                        var updates = {};
                        updates[county] = props.timestamp;
                        addData = db.ref('users/' + user.uid + '/locationInfo/locations').update(updates);
                    }
                }
            }
        
        }
        >
            {children}

        </AuthContext.Provider>
    );
}
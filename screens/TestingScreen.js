import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import Geolocation from 'react-native-geolocation-service';

export default class TestingScreen extends React.Component {
    static contextType = AuthContext;
    constructor(){
        super();
        this.state = {
            ready: false,
            where: {lat:null, lng:null},
            error: null
        }
    }
    componentDidMount(){
        let geoOptions = {
            enableHighAccuracy: true,
            timeOut: 20000,
            maximumAge: 60 * 60 * 24
        };
        let geoOptionsWatch = {
            enableHighAccuracy: true,
            distanceFilter: 2

        }

        this.setState({ready:false, error: null });
        Geolocation.getCurrentPosition( this.geoSuccess, 
                                                this.geoFailure,
                                                geoOptions);
        Geolocation.watchPosition(this.geoSuccess, this.geoFailure, geoOptionsWatch);
    }
    geoSuccess = (position) => {
        console.log(position.coords.latitude, position.coords.longitude );
        
        this.setState({
            ready:true,
            where: {lat: position.coords.latitude,lng:position.coords.longitude }
        })
        this.context.setUserLocationInfo(position);


    }
    geoFailure = (err) => {
        this.setState({error: err.message});
    }
    render() {
        return (
            <View style={styles.container}>
                { !this.state.ready && (
                <Text style={styles.big}>Using Geolocation in React Native.</Text>
                )}
                { this.state.error && (
                <Text style={styles.big}>{this.state.error}</Text>
                )}
                { this.state.ready && (
                    <Text style={styles.big}>{
                    `Latitude: ${this.state.where.lat}
                    Longitude: ${this.state.where.lng}`
                    }</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    big: {
        fontSize: 48
    }
});

import React from 'react';
import { Text, StyleSheet, View, Button, TouchableOpacity, Image, Dimensions, AsyncStorage, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Permissions, Notifications } from 'expo';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

export default class Menu extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            token: null,
            notification: null,
            keyUser: '',
            loginName: '',
            loginPic: null,
            uploading: false,
            typeUser: '',
        };
    }
    ResetState = () => {
        this.setState({
            loginEmail: '',
            loginName: '',
            loginPic: null,
            uploading: false,
        })
    }

    Back = () => {
        const { navigate } = this.props.navigation;
        Alert.alert(
            'คุณต้องการออกจากระบบ ?',
            '',
            [
                {
                    text: 'ใช่',
                    onPress: () => {
                        this.ResetState();
                        navigate('Login')
                    }
                },
                {
                    text: 'ไม่ใช่',
                    onPress: () => { }
                },
            ],
            { cancellable: false }
        );
    }

    getLogin = async () => {
        try {
            const { db } = this.props.screenProps
            const keyUserValue = await AsyncStorage.getItem('keyUser')
            const valueKeyUser = JSON.parse(keyUserValue)
            const NameValue = await AsyncStorage.getItem('loginName')
            const valueName = JSON.parse(NameValue)
            const PicValue = await AsyncStorage.getItem('loginPic')
            const valuePic = JSON.parse(PicValue)

            this.setState({
                loginName: valueName.loginName,
                loginPic: valuePic.loginPic,
            });
            var dbImage = db.database().ref('/User').child(valueKeyUser.keyUser).child('typeUser')
            dbImage.on('value', snapshot => {
                this.getKey(snapshot.val());
            });
            // if (this.state.loginEmail == this.state.Approver) {
            //     this.registerForPushNotifications();
            // }
            // if (this.state.loginEmail == this.state.Employee) {
            //     this.registerForPushNotifications2();
            // }
        } catch (error) {
            console.log(error)
        }
    }
    componentWillMount() {
        this.getLogin();
    }
    componentWillUnmount() {
        this.ResetState()
    }
    getKey(values) {
        this.setState({
            typeUser: values
        });
    };

    _maybeRenderImage = () => {
        if (!this.state.loginPic) {
            return;
        }

        return (
            <View style={styles.ImgSpace}>
                <Image source={{ uri: this.state.loginPic }} style={styles.ImgLogoRender} />
            </View>
        );
    };
    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}>
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };
    // async registerForPushNotifications() {
    //     const { db } = this.props.screenProps
    //     const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    //     if (status !== 'granted') {
    //         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //         if (status !== 'granted') {
    //             return;
    //         }
    //     }

    //     const token = await Notifications.getExpoPushTokenAsync();

    //     this.subscription = Notifications.addListener(this.handleNotification);
    //     this.setState({
    //         token,
    //     });

    //     let dbNotification = db.database().ref('/User').child('/approver');
    //     dbNotification.set({
    //         name: this.state.loginName,
    //         email: this.state.loginEmail,
    //         image: this.state.loginPic,
    //         token: this.state.token
    //     });
    // }
    // handleNotification = notification => {
    //     this.setState({
    //         notification,
    //     });
    // };

    // async registerForPushNotifications2() {
    //     const { db } = this.props.screenProps
    //     const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    //     if (status !== 'granted') {
    //         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //         if (status !== 'granted') {
    //             return;
    //         }
    //     }

    //     const token = await Notifications.getExpoPushTokenAsync();

    //     this.subscription = Notifications.addListener(this.handleNotification);
    //     this.setState({
    //         token,
    //     });

    //     let dbNotification = db.database().ref('/User').child('/employee');
    //     dbNotification.set({
    //         name: this.state.loginName,
    //         email: this.state.loginEmail,
    //         image: this.state.loginPic,
    //         token: this.state.token
    //     });
    // }
    // handleNotification = notification => {
    //     this.setState({
    //         notification,
    //     });
    // };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1, backgroundColor: '#b9d8f9' }}>
                <ScrollView>
                    <View style={styles.Scroll}>
                        <View style={styles.header1}>
                            <View style={styles.header2}>
                                <Text></Text>
                            </View>
                            <TouchableOpacity style={styles.header4} onPress={this.Back}>
                                <Image source={require('../Image/ICONLogout.png')} style={styles.header3} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.container}>
                        {this.state.loginPic ? null : (
                            <View style={styles.ImgSpace}>
                                <View style={styles.ImgLogoRender} />
                            </View>
                        )}
                        {this._maybeRenderImage()}
                        <View style={styles.About}>
                            <View style={styles.container1}>
                                <Text style={styles.TextTitle} >{this.state.loginName}</Text>
                            </View>
                        </View>
                        {
                            this.state.typeUser == 'approver' && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu1') }} >
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/dashboard.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >กระดานข้อมูล</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('ListTran') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/ListTran.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >รายการที่เบิกทั้งหมด</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu2') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/MyProduct.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >สินค้าคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu3') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/StockIn.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >เพิ่มสินค้าคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        {
                            this.state.typeUser == 'professor' && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu1') }} >
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/dashboard.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >กระดานข้อมูล</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('ListTran') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/ListTran.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >รายการที่เบิกทั้งหมด</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('MyProPro') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/MyProduct.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >สินค้าคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu3') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/StockIn.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >เพิ่มสินค้าคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        {
                            this.state.typeUser == 'employee' && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('ListTran') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/ListTran.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >รายการที่เบิกทั้งหมด</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('MyProStu') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/MyProduct.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >สินค้าคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        {
                            this.state.typeUser == 'student' && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('ListTran') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/ListTran.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >รายการที่เบิกทั้งหมด</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('MyProStu') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/MyProduct.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >สินค้าคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu4') }}>
                            <View style={styles.rowBtn}>
                                <Image source={require('../Image/StockOut.png')} style={styles.Img} />
                                <Text style={styles.buttonText} >เบิกสินค้าคงคลัง</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            this.state.typeUser == 'approver' && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu5') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/FindStock.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >ค้นหาสินค้าในคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonLast} onPress={() => { navigate('Menu6') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/Approved.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >การทำรายการ</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>)}
                        {
                            this.state.typeUser == 'professor' && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => { navigate('Menu5') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/FindStock.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >ค้นหาสินค้าในคงคลัง</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonLast} onPress={() => { navigate('Menu6') }}>
                                        <View style={styles.rowBtn}>
                                            <Image source={require('../Image/Approved.png')} style={styles.Img} />
                                            <Text style={styles.buttonText} >การทำรายการ</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>)}
                    </View>
                </ScrollView>
                {this._maybeRenderUploadingOverlay()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#b9d8f9',
    },
    Scroll: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImgLogoRender: {
        width: 0.2 * deviceHeight,
        height: 0.2 * deviceHeight,
        borderRadius: (0.2 * deviceHeight) / 2,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    ImgSpace: {
        marginTop: 0.015 * deviceWidth,
    },
    container1: {
        alignItems: 'center',
    },
    rowBtn: {
        marginLeft: 0.04 * deviceWidth,
        flexDirection: 'row',
        alignItems: 'center',
    },
    Img: {
        width: 0.07 * deviceHeight,
        height: 0.07 * deviceHeight,
    },
    About: {
        width: 0.95 * deviceWidth,
        justifyContent: 'center',
        height: 0.2 * deviceWidth,
    },
    button: {
        width: 0.95 * deviceWidth,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        marginTop: 0.005 * deviceWidth,
        marginBottom: 0.015 * deviceWidth,
        marginLeft: 0.02 * deviceWidth,
        marginRight: 0.02 * deviceWidth,
        height: 0.2 * deviceWidth,
        borderRadius: 1 / 10 * 0.2 * deviceWidth,
        borderWidth: 3,
        borderColor: '#2d4052',
    },
    buttonLast: {
        width: 0.95 * deviceWidth,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        marginTop: 0.005 * deviceWidth,
        marginBottom: 0.04 * deviceWidth,
        marginLeft: 0.02 * deviceWidth,
        marginRight: 0.02 * deviceWidth,
        height: 0.2 * deviceWidth,
        borderRadius: 1 / 10 * 0.2 * deviceWidth,
        borderWidth: 3,
        borderColor: '#2d4052',
    },
    buttonText: {
        fontSize: deviceWidth / 20,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 0.04 * deviceWidth,
    },
    TextTitle: {
        fontSize: deviceWidth / 20,
        fontWeight: 'bold',
        color: '#22313F',
    },
    header1: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 40,
        width: 0.95 * deviceWidth,
    },
    header2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header3: {
        width: 0.06 * deviceHeight,
        height: 0.06 * deviceHeight,
        marginLeft: 0.02 * deviceWidth,
    },
    header4: {
        marginRight: 0.02 * deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
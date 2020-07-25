import React from 'react';
import {
    ActivityIndicator, Button, Clipboard, Image, Share, StatusBar, StyleSheet, Text, TouchableOpacity,
    View, Alert, TextInput, ScrollView, Keyboard, KeyboardAvoidingView, Animated, Dimensions, AsyncStorage
} from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

console.disableYellowBox = true;
// console.disableYellowBox = true; เอาไว้ปิดแจ้งเตือนสีเหลืองๆ

export default class AddProduct extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: false,
    });
    state = {
        imageShow: null,
        pickerResult: null,
        uploading: false,
        image: '',
        id: '',
        idCheck: '',
        name: '',
        detail: '',
        quantity: '',
        limit: '',
        limitStu: '',
        keyUser: '',
        nameApp: '',
        time: '',
        date:''
    };
    ResetState = () => {
        this.setState({
            imageShow: null,
            pickerResult: null,
            uploading: false,
            image: '',
            id: '',
            idCheck: '',
            name: '',
            detail: '',
            quantity: '',
        });
    }
    setOnAddDB = () => {
        const { db } = this.props.screenProps
        let dbDeleteProduct = db.database().ref('/HistoryAddProduct');
        dbDeleteProduct.push({
            id: this.state.id,
            name: this.state.name,
            detail: this.state.detail,
            quantity: this.state.quantity,
            limit: this.state.limit,
            limitStu: this.state.limitStu,
            nameApp: this.state.nameApp,
            keyApp: this.state.keyUser,
            time: this.state.time,
            date: this.state.date
        });
    }
    render() {
        let { imageShow } = this.state;
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.container} behavior='position' >
                    <ScrollView>
                        <View style={styles.Scroll}>
                            <View style={styles.header1}>
                                <View style={styles.header2}>
                                    <Image source={require('../Image/ICONmyproduct.png')} style={styles.header3} />
                                    <Text style={styles.TextInHeader1}>เพิ่มสินค้าคงคลัง</Text>
                                </View>
                                <TouchableOpacity style={styles.header4}>
                                    <Text style={styles.TextInHeader2}></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {imageShow ? null : (
                            <View style={styles.space1}>
                                <View style={styles.ImgLogo}></View>
                            </View>
                        )}
                        {this._maybeRenderImage()}
                        <TouchableOpacity style={styles.spaceChang} onPress={this.AlertPhoto}>
                            <Text style={styles.changImg}>เลือกรูปภาพ</Text>
                        </TouchableOpacity>
                        <View style={styles.ValueView}>
                            <Text style={styles.TextSty2}>รหัสสินค้า : </Text>
                        </View>
                        <View style={styles.container1}>
                            <TextInput style={styles.inputBox}
                                underlineColorAndroid='#ffffff'
                                placeholder="กรอกรหัสสินค้า"
                                placeholderTextColor="#a1a1a1"
                                maxLength={10}
                                onChangeText={(id) => {
                                    var id;
                                    id = id
                                    this.setState({ id: id })
                                }}
                            />
                        </View>
                        <View style={styles.ValueView}>
                            <Text style={styles.TextSty2}>ชื่อสินค้า : </Text>
                        </View>
                        <View style={styles.container1}>
                            <TextInput style={styles.inputBox}
                                underlineColorAndroid='#ffffff'
                                placeholder="กรอกชื่อสินค้า"
                                placeholderTextColor="#a1a1a1"
                                maxLength={20}
                                onChangeText={(name) => {
                                    var name;
                                    name = name
                                    this.setState({ name: name })
                                }}
                            />
                        </View>
                        <View style={styles.ValueView}>
                            <Text style={styles.TextSty2}>รายละเอียดสินค้า : </Text>
                        </View>
                        <View style={styles.container1}>
                            <TextInput style={styles.inputBox}
                                underlineColorAndroid='#ffffff'
                                placeholder="กรอกรายละเอียดสินค้า"
                                placeholderTextColor="#a1a1a1"
                                maxLength={60}
                                onChangeText={(detail) => {
                                    var detail;
                                    detail = detail
                                    this.setState({ detail: detail })
                                }}
                            />
                        </View>
                        <View style={styles.ValueView}>
                            <Text style={styles.TextSty2}>จำนวนสินค้า : </Text>
                        </View>
                        <View style={styles.container1}>
                            <TextInput style={styles.inputBox}
                                underlineColorAndroid='#ffffff'
                                keyboardType='numeric'
                                placeholder="กรอกจำนวนสินค้า"
                                placeholderTextColor="#a1a1a1"
                                maxLength={4}
                                onChangeText={(quantity) => {
                                    var quantity;
                                    this.setState({ quantity: quantity })
                                }}
                            />
                        </View>
                        <View style={styles.ValueView}>
                            <Text style={styles.TextSty2}>จำนวนจำกัด(อาจารย์/บุคลากร) : </Text>
                        </View>
                        <View style={styles.container1}>
                            <TextInput style={styles.inputBox}
                                underlineColorAndroid='#ffffff'
                                keyboardType='numeric'
                                placeholder="กรอกจำนวนสินค้า"
                                placeholderTextColor="#a1a1a1"
                                maxLength={4}
                                onChangeText={(limit) => {
                                    var limit;
                                    this.setState({ limit: limit })
                                }}
                            />
                        </View>
                        <View style={styles.ValueView}>
                            <Text style={styles.TextSty2}>จำนวนจำกัด(นักศึกษา) : </Text>
                        </View>
                        <View style={styles.container1}>
                            <TextInput style={styles.inputBox}
                                underlineColorAndroid='#ffffff'
                                keyboardType='numeric'
                                placeholder="กรอกจำนวนสินค้า"
                                placeholderTextColor="#a1a1a1"
                                maxLength={4}
                                onChangeText={(limitStu) => {
                                    var limitStu;
                                    this.setState({ limitStu: limitStu })
                                }}
                            />
                        </View>
                        <View style={styles.space2}>
                            <TouchableOpacity style={styles.button} onPress={() => this.Accept()}>
                                <Text style={styles.buttonText} >บันทึก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => this.Cancle()}>
                                <Text style={styles.buttonText} >ยกเลิก</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.TableLast}>
                            <Text style={styles.TextLast}>** กรุณาตรวจสอบความถูกต้อง และกรอกข้อมูลให้ครบถ้วน **</Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {this._maybeRenderUploadingOverlay()}
            </View>
        );
    }
    Cancle = () => {
        const { navigate } = this.props.navigation;
        Alert.alert(
            'คุณต้องการยกเลิก ?',
            '',
            [
                {
                    text: 'ใช่',
                    onPress: () => {
                        this.ResetState();
                        navigate('Menu')
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
    AlertPhoto = () => {
        Alert.alert(
            'ตั้งค่ารูปภาพสินค้า',
            '',
            [
                { text: 'นำเข้าจากคลังรูปภาพ', onPress: async () => { this._pickImage() } },
                { text: 'นำเข้าจากกล้องถ่ายรูป', onPress: async () => { this._takePhoto() } },
                { text: 'ลบรูปภาพออก', onPress: async () => { this._deletePhoto() } },
                { text: 'ยกเลิก', onPress: () => { } },
            ],
            { cancelable: false }
        )
    }

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

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // ใช้เพื่อ Permissions กล้องกับ ไลบารี่
    };

    _maybeRenderImage = () => {
        let { imageShow } = this.state;
        if (!imageShow) {
            return;
        }

        return (
            <View style={styles.space1}>
                <View style={styles.ImgLogoRender}>
                    <Image source={{ uri: imageShow }} style={styles.ImgLogoRender} />
                    {/* เอาไว้สำหรับ share และ copyToClipboard */}
                    {/* <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
          {image}
        </Text> */}
                </View>
            </View>
        );
    };

    // _share = () => {
    //   Share.share({
    //     message: this.state.image,
    //     title: 'Check out this photo',
    //     url: this.state.image,
    //   });
    // };

    // _copyToClipboard = () => {
    //   Clipboard.setString(this.state.image);
    //   alert('Copied image URL to clipboard');
    // // };

    _deletePhoto = () => {
        this.setState({ imageShow: null });
    };

    _takePhoto = async () => {
        await this.askPermissionsAsync();
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!pickerResult.cancelled) {
            this.setState({
                imageShow: pickerResult.uri,
                pickerResult: pickerResult
            })
        }
    };

    _pickImage = async () => {
        await this.askPermissionsAsync();
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!pickerResult.cancelled) {
            this.setState({
                imageShow: pickerResult.uri,
                pickerResult: pickerResult
            })
        }
    };

    Accept = async () => {
        const { navigate } = this.props.navigation;
        const { db } = this.props.screenProps
        const idCheck = await this.getValueID(this.state.id);
        if (this.state.id !== idCheck) {
            if (this.state.imageShow !== null && this.state.id !== '' && this.state.name !== '' && this.state.quantity !== ''
                && this.state.limit !== '' && this.state.limitStu !== '' && this.state.keyUser !== '' && this.state.nameApp !== '') {
                if (!isNaN(parseInt(this.state.quantity)) && this.state.quantity !== '0'
                    && this.state.quantity !== '00' && this.state.quantity !== '000'
                    && this.state.quantity !== '0000' && this.state.quantity == parseInt(this.state.quantity)
                    && !isNaN(parseInt(this.state.limit))
                    && this.state.limit !== '00' && this.state.limit !== '000'
                    && this.state.limit !== '0000' && this.state.limit == parseInt(this.state.limit)
                    && !isNaN(parseInt(this.state.limitStu))
                    && this.state.limitStu !== '00' && this.state.limitStu !== '000'
                    && this.state.limitStu !== '0000' && this.state.limitStu == parseInt(this.state.limitStu)) {
                    if (parseInt(this.state.limitStu) <= parseInt(this.state.quantity) && parseInt(this.state.limit) <= parseInt(this.state.quantity)) {
                        this.setState({
                            quantity: parseInt(this.state.quantity),
                            limit: parseInt(this.state.limit),
                            limitStu: parseInt(this.state.limitStu),
                        })
                        this.getDayNow();
                        this.getTimeNow();
                        this._handleImagePicked();
                        this.setOnAddDB();
                        Alert.alert(
                            'ทำการบันทึกเรียบร้อย',
                            '',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        navigate('Menu')
                                    }
                                },
                            ],
                            { cancelable: false }
                        )
                    } else {
                        Alert.alert('ข้อผิดพลาด', 'จำนวนจำกัดมากกว่าจำนวนสินค้า');
                    }
                } else {
                    Alert.alert('ข้อผิดพลาด', 'กรุณาระบุข้อมูลให้ถูกต้อง');
                }
            } else {
                Alert.alert('ข้อผิดพลาด', 'กรุณาระบุข้อมูลให้ครบถ้วน');
            }
        } else {
            Alert.alert('ข้อผิดพลาด', 'รหัสสินค้านี้มีอยู่ในระบบแล้ว');
        }
    };
    getDayNow = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        var DateNow = date + '/' + month + '/' + year
        this.setState({
            date: DateNow
        })
    }
    getTimeNow = () => {
        var date, TimeType, hour, minutes, seconds, fullTime;
        date = new Date();
        hour = date.getHours();
        if (hour <= 11) {
            TimeType = 'AM';
        } else {
            TimeType = 'PM';
        } if (hour > 12) {
            hour = hour - 12;
        } if (hour == 0) {
            hour = 12;
        }
        minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }
        seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = '0' + seconds.toString();
        }
        fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();
        this.setState({
            time: fullTime
        });
    }
    getValueID = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var idCheck = ''
        var dbID = db.database().ref('Product').child(key).child('id')
        dbID.once('value', snapshot => {
            idCheck = this.getID(snapshot.val());
            resolve(idCheck);
        });
    })
    getID(values) {
        let idCheck = values
        this.setState({
            idCheck: idCheck
        });
        return idCheck
    };
    getKeyApprover = async () => {
        const keyUserValue = await AsyncStorage.getItem('keyUser')
        const valueKeyUser = JSON.parse(keyUserValue)
        const NameValue = await AsyncStorage.getItem('loginName')
        const valueName = JSON.parse(NameValue)
        this.setState({
            keyUser: valueKeyUser.keyUser,
            nameApp: valueName.loginName
        });
    }
    componentWillMount = () => {
        this.getKeyApprover();
    }
    _handleImagePicked = async () => {
        let { pickerResult } = this.state;

        try {
            this.setState({ uploading: true });
            if (!pickerResult.cancelled) {
                uploadUrl = await this.uploadImageAsync(pickerResult.uri);
                this.setState({ image: uploadUrl });
                const { db } = this.props.screenProps
                let dbUploaddata = db.database().ref('/Product').child(this.state.id);
                dbUploaddata.set({
                    id: this.state.id,
                    image: this.state.image,
                    name: this.state.name,
                    detail: this.state.detail,
                    quantity: this.state.quantity,
                    limit: this.state.limit,
                    limitStu: this.state.limitStu,
                    nameApp: this.state.nameApp,
                    keyApp: this.state.keyUser,
                    time: this.state.time,
                    date: this.state.date
                });
            }
        } catch (e) {
            console.log(e);
            alert('คุณทำรายการผิดกรุณาทำรายการใหม่ :(');
        } finally {
            this.setState({ uploading: false });
        }
    };

    async uploadImageAsync(uri) {
        const { db } = this.props.screenProps
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = db.storage().ref().child(this.state.id);
        const snapshot = await ref.put(blob);
        return snapshot.downloadURL;
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ABCEEF',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container1: {
        alignItems: 'center',
    },
    ImgLogo: {
        width: 0.2 * deviceHeight,
        height: 0.2 * deviceHeight,
        borderRadius: 1 / 2 * 0.1 * deviceWidth,
        borderWidth: 3,
        borderColor: '#BEBEBE',
        backgroundColor: '#ffffff',
    },
    ValueView: {
        justifyContent: 'flex-start',
        marginBottom: 0.005 * deviceWidth,
        marginTop: 0.005 * deviceWidth,
        marginLeft: 0.1 * deviceWidth,
    },
    ValueView2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextSty2: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'center',
        marginBottom: 0.008 * deviceWidth,
        marginTop: 0.012 * deviceWidth,
    },
    ImgLogoRender: {
        width: 0.2 * deviceHeight,
        height: 0.2 * deviceHeight,
        borderRadius: 1 / 2 * 0.1 * deviceWidth,
    },
    spaceChang: {
        alignItems: 'center',
        marginBottom: 0.05 * deviceWidth,
    },
    changImg: {
        color: "#22313F",
        fontSize: deviceWidth / 20,
        fontWeight: 'bold',
    },
    space1: {
        marginTop: 0.05 * deviceWidth,
        marginBottom: 0.05 * deviceWidth,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    space2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 0.04 * deviceWidth,
        marginRight: 0.04 * deviceWidth,
    },
    inputBox: {
        width: 0.85 * deviceWidth,
        backgroundColor: '#ffffff',
        borderRadius: 1 / 2 * 0.85 * deviceWidth,
        paddingHorizontal: 16,
        fontSize: deviceWidth / 24,
        color: '#22313F',
        height: 0.1 * deviceWidth,
        marginBottom: 0.008 * deviceWidth,
        marginVertical: 0.01 * deviceWidth,
    },
    button: {
        width: 0.3 * deviceWidth,
        backgroundColor: '#22313F',
        borderRadius: 1 / 5 * 0.125 * deviceWidth,
        marginBottom: 0.02 * deviceWidth,
        marginTop: 0.08 * deviceWidth,
        height: 0.125 * deviceWidth,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: deviceWidth / 20,
        fontWeight: 'bold',
        color: '#ffffff',
        alignItems: 'center',
        marginBottom: 0.02 * deviceWidth,
        marginTop: 0.02 * deviceWidth,
    },
    Scroll: {
        backgroundColor: '#ABCEEF',
        alignItems: 'center'
    },
    header1: {
        alignItems: 'center',
        borderBottomWidth: 5,
        borderColor: '#22313F',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 40,
        paddingBottom: 15,
        width: 0.9 * deviceWidth,
    },
    header2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header3: {
        width: 0.05 * deviceHeight,
        height: 0.05 * deviceHeight,
        marginLeft: 0.02 * deviceWidth,
    },
    header4: {
        marginRight: 0.02 * deviceWidth,
        alignItems: 'center',
    },
    TextInHeader1: {
        fontSize: deviceWidth / 28,
        fontWeight: 'bold',
        color: '#22313F',
        marginLeft: 0.02 * deviceWidth,
    },
    TextInHeader2: {
        fontSize: deviceWidth / 28,
        fontWeight: 'bold',
        color: '#22313F',
    },
    TableLast: {
        width: 0.9 * deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0.04 * deviceWidth,
        marginBottom: 0.02 * deviceWidth,
    },
    TextLast: {
        fontSize: deviceWidth / 34,
        color: 'red',
        alignItems: 'center',
    },
});

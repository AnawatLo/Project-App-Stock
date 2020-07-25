import React from 'react';
import {
    Text, StyleSheet, Image, TextInput, View, Button, TouchableOpacity,
    Alert, AsyncStorage, Dimensions, ScrollView, Keyboard, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

console.disableYellowBox = true;

export default class StockOut extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            typeStock: 'StockOut',
            img: '',
            id: '',
            name: '',
            quantity: '',
            detail: '',
            comment: '',
            quantityCal: 0,
            lastQty: 0,
            time: '',
            date: '',
            uploading: false,
            token: null,
            title: 'มีการเบิกสินค้าคงคลัง',
            body: 'กรุณาตรวจสอบการทำรายการ',
            keyUser: '',
            nameUser: '',
            limit: 0,
            limitUser: 0,
            typeUser: ''
        };
    }
    ResetState = () => {
        this.setState({
            typeStock: 'StockOut',
            img: '',
            id: '',
            name: '',
            detail: '',
            quantity: '',
            comment: '',
            quantityCal: 0,
            lastQty: 0,
            time: '',
            uploading: false,
        });
    }

    onPlus = () => {
        this.setState({
            quantityCal: this.state.quantityCal + 1
        })
    }
    onMinus = () => {
        if (this.state.quantityCal > 0) {
            this.setState({
                quantityCal: this.state.quantityCal - 1
            })
        } else {
            this.setState({
                quantityCal: this.state.quantityCal
            })
        }
    }

    ResetQty = () => {
        this.setState({
            quantity: this.state.quantity + this.state.lastQty,
            lastQty: 0,
            quantityCal: 0
        })
    }
    Cancel = () => {
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

    AlertSave = () => {
        const { db } = this.props.screenProps
        const { navigate } = this.props.navigation;
        if (this.state.quantityCal !== 0) {
            if (this.state.quantity >= this.state.quantityCal) {
                if (this.state.quantityCal <= this.state.limit - this.state.limitUser) {
                    this.setState({
                        lastQty: this.state.lastQty + this.state.quantityCal,
                        quantityCal: 0
                    })
                    this.setState({ uploading: true });
                    Alert.alert(
                        'ทำการบันทึกเรียบร้อย',
                        'สถานะ: รอการยืนยัน',
                        [
                            {
                                text: 'ตกลง',
                                onPress:
                                    async () => {
                                        try {
                                            this.getDayNow();
                                            this.getTimeNow();
                                            // this.sendPushNotification();
                                            let dbTransaction = db.database().ref('/Transaction');
                                            dbTransaction.push({
                                                typeStock: this.state.typeStock,
                                                lastQty: this.state.lastQty,
                                                name: this.state.name,
                                                detail: this.state.detail,
                                                id: this.state.id,
                                                comment: this.state.comment,
                                                time: this.state.time,
                                                keyUser: this.state.keyUser,
                                                nameUser: this.state.nameUser,
                                                date: this.state.date
                                            });
                                            // รีเซ็ตค่าหลัง push ขึ้น firebase
                                            this.ResetState();
                                            navigate('Menu')
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    },
                            }
                        ],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert('ข้อผิดพลาด', 'เบิกสินค้าเกินที่กำหนดไว้');
                }
            } else {
                this.setState({
                    quantity: this.state.quantity,
                    quantityCal: 0
                })
                Alert.alert('ข้อผิดพลาด', 'กรุณาระบุข้อมูลให้ถูกต้อง');
            }
        } else {
            Alert.alert('ข้อผิดพลาด', 'กรุณาทำรายการให้ถูกต้อง');
        }
    };

    getTest = async () => {
        try {
            // console.log('============================')
            const { navigate } = this.props.navigation;
            const strValue = await AsyncStorage.getItem('KeyLastScanerStockOut')
            const value = JSON.parse(strValue)
            // console.log('check value', value) เช็คค่า QRCode ที่อ่านเข้ามา

            // value = { lastScannedUrl: '' }
            // you can use this
            // 1. const { lastScannedUrl } = value OR
            // 2. value.lastScannedUrl
            const keyUserValue = await AsyncStorage.getItem('keyUser')
            const valueKeyUser = JSON.parse(keyUserValue)
            const NameValue = await AsyncStorage.getItem('loginName')
            const valueName = JSON.parse(NameValue)
            this.setState({
                keyUser: valueKeyUser.keyUser,
                nameUser: valueName.loginName,
                uploading: true
            });
            const { db } = this.props.screenProps
            const id = await this.getValueID(value.lastScannedUrl);
            const quantity = await this.getValueQty(value.lastScannedUrl);
            const typeUser = await this.getTypeUser(valueKeyUser.keyUser);

            const limitUser = await this.getValuelimitUser(valueKeyUser.keyUser, id);
            switch (value.lastScannedUrl) {
                case this.state.id:
                    if (typeUser == 'student') {
                        const limit = await this.getValuelimitSTU(value.lastScannedUrl);
                    } else {
                        const limit = await this.getValuelimit(value.lastScannedUrl);
                    }
                    if (this.state.quantity > 0) {
                        if (this.state.limit !== 0) {
                            if (this.state.limit > this.state.limitUser) {
                                var dbImage = db.database().ref('Product').child(value.lastScannedUrl).child('image')
                                dbImage.on('value', snapshot => {
                                    this.getImage(snapshot.val());
                                });
                                var dbName = db.database().ref('Product').child(value.lastScannedUrl).child('name')
                                dbName.on('value', snapshot => {
                                    this.getName(snapshot.val());
                                });
                                var dbDetail = db.database().ref('Product').child(value.lastScannedUrl).child('detail')
                                dbDetail.on('value', snapshot => {
                                    this.getDetail(snapshot.val());
                                });
                            } else {
                                this.ResetState();
                                Alert.alert(
                                    'เบิกสินค้าเกินจำนวนที่กำหนดไว้',
                                    '',
                                    [
                                        {
                                            text: 'ตกลง',
                                            onPress: () => {
                                                navigate('Menu')
                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }
                        } else {
                            this.ResetState();
                            Alert.alert(
                                'ไม่สามารถเบิกสินค้านี้ได้',
                                '',
                                [
                                    {
                                        text: 'ตกลง',
                                        onPress: () => {
                                            navigate('Menu')
                                        }
                                    }
                                ],
                                { cancelable: false }
                            );
                        }
                    } else {
                        this.ResetState();
                        Alert.alert(
                            'สินค้าหมด',
                            '',
                            [
                                {
                                    text: 'ตกลง',
                                    onPress: () => {
                                        navigate('Menu')
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                    break;
                default:
                    Alert.alert(
                        'ไม่มีข้อมูลนี้อยู่ในระบบ',
                        '',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    this.ResetState();
                                    navigate('Menu')
                                }
                            }
                        ],
                        { cancelable: false }
                    );
            }
        } catch (error) {
            const { navigate } = this.props.navigation;
            console.log(error)
            Alert.alert(
                'การอัปโหลดเกิดการผิดพลาด :(',
                '',
                [
                    {
                        text: 'ตกลง',
                        onPress: () => {
                            navigate('Menu')
                        }
                    }
                ],
                { cancelable: false }
            );
            this.setState({ uploading: false });
        }
    }
    getTypeUser = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var typeUser = ''
        var dbTypeUser = db.database().ref('User').child(key).child('typeUser')
        dbTypeUser.once('value', snapshot => {
            typeUser = this.getUser(snapshot.val());
            resolve(typeUser);
        });
    })
    getValueID = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var id = ''
        var dbID = db.database().ref('Product').child(key).child('id')
        dbID.once('value', snapshot => {
            id = this.getID(snapshot.val());
            resolve(id);
        });
    })
    getValueQty = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var quantity = ''
        var dbQty = db.database().ref('Product').child(key).child('quantity')
        dbQty.once('value', snapshot => {
            quantity = this.getQty(snapshot.val());
            resolve(quantity);
        });
    })
    getValuelimit = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var limit = ''
        var dbLimit = db.database().ref('Product').child(key).child('limit')
        dbLimit.once('value', snapshot => {
            limit = this.getLimit(snapshot.val());
            resolve(limit);
        });
    })
    getValuelimitSTU = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var limit = ''
        var dbLimitStu = db.database().ref('Product').child(key).child('limitStu')
        dbLimitStu.once('value', snapshot => {
            limit = this.getLimitStu(snapshot.val());
            resolve(limit);
        });
    })
    getValuelimitUser = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var limitUser = ''
        var dbLimitUser = db.database().ref('User').child(key).child('Limit').child(this.state.id).child('qtyLimit')
        dbLimitUser.once('value', snapshot => {
            limitUser = this.getLimitUser(snapshot.val());
            resolve(limitUser);
        });
    })
    getUser(values) {
        this.setState({
            typeUser: values
        });
        return values
    }
    getLimitUser(values) {
        this.setState({
            limitUser: values
        });
        return values
    }
    getLimit(values) {
        this.setState({
            limit: values
        });
        return values
    }
    getLimitStu(values) {
        this.setState({
            limit: values
        });
        return values
    }
    getImage(values) {
        let ImgVal = values
        let img = ImgVal
        this.setState({
            img: img
        });
    };
    getID(values) {
        let id = values
        this.setState({
            id: id
        });
        return id
    };
    getName(values) {
        let NameVal = values
        let name = NameVal
        this.setState({
            name: name
        });
    };
    getDetail(values) {
        let DetailVal = values
        let detail = DetailVal
        this.setState({
            detail: detail
        });
        this.setState({ uploading: false });
    };
    getQty(values) {
        let QtyVal = values
        let quantity = QtyVal
        this.setState({
            quantity: quantity
        });
    };
    // getToken(values) {
    //     let TokenVal = values
    //     let token = TokenVal
    //     this.setState({
    //         token: token
    //     });
    // };
    // sendPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
    //     return fetch('https://exp.host/--/api/v2/push/send', {
    //         body: JSON.stringify({
    //             to: token,
    //             title: title,
    //             body: body,
    //             data: { message: `${title} - ${body}` },
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'POST',
    //     });
    // }
    componentWillMount() {
        // const { db } = this.props.screenProps
        // var dbApprovers = db.database().ref('/User').child('/approver').child('/token');
        // dbApprovers.on('value', snapshot => {
        //     this.getToken(snapshot.val());
        // });
        this.keyboardDidHideListener();
        this.getTest();
        this.getName();
        this.getQty();
        this.getDetail();
    }
    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        var dbUnImage = db.database().ref('Product').child(value.lastScannedUrl).child('image')
        dbUnImage.off();
        var dbUnName = db.database().ref('Product').child(value.lastScannedUrl).child('name')
        dbUnName.off();
        var dbUnDetail = db.database().ref('Product').child(value.lastScannedUrl).child('detail')
        dbUnDetail.off();
        var dbUnQty = db.database().ref('Product').child(value.lastScannedUrl).child('quantity')
        dbUnQty.off();
    }

    keyboardDidHideListener() {
        this.keyboardDidHideListener =
            Keyboard
                .addListener('keyboardDidHide', this._keyboardDidHide);
    }
    _keyboardDidHide() {
        Keyboard.dismiss();
    }
    _maybeRenderImage = () => {
        if (!this.state.img) {
            return;
        }

        return (
            <View style={styles.Img}>
                <View style={styles.ImgLogo}>
                    <Image source={{ uri: this.state.img }} style={styles.ImgLogo2} />
                </View>
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

    render() {
        const { navigate } = this.props.navigation;
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" >
                <ScrollView>
                    <View style={styles.Scroll}>
                        <View style={styles.header1}>
                            <View style={styles.header2}>
                                <Image source={require('../Image/ICONminus.png')} style={styles.header3} />
                                <Text style={styles.TextInHeader1}>เบิกสินค้าคงคลัง</Text>
                            </View>
                            <TouchableOpacity style={styles.header4}>
                                <Text style={styles.TextInHeader2}></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.container1}>
                        {this.state.img ? null : (
                            <View style={styles.Img}>
                                <View style={styles.ImgLogo} />
                            </View>
                        )}
                        {this._maybeRenderImage()}
                    </View>
                    <View style={styles.ValueView}>
                        <Text style={styles.TextSty2}>รหัสสินค้า : </Text>
                    </View>
                    <View style={styles.container1}>
                        <View style={styles.button}>
                            <Text style={styles.TextSty}>{this.state.id}</Text>
                        </View>
                    </View>
                    <View style={styles.ValueView}>
                        <Text style={styles.TextSty2}>ชื่อสินค้า : </Text>
                    </View>
                    <View style={styles.container1}>
                        <View style={styles.button}>
                            <Text style={styles.TextSty}>{this.state.name}</Text>
                        </View>
                    </View>
                    <View style={styles.ValueView}>
                        <Text style={styles.TextSty2}>รายละเอียดสินค้า : </Text>
                    </View>
                    <View style={styles.container1}>
                        <View style={styles.button}>
                            <Text style={styles.TextSty}>{this.state.detail}</Text>
                        </View>
                    </View>
                    <View style={styles.ValueView}>
                        <Text style={styles.TextSty2}>จำนวนสินค้า : </Text>
                    </View>
                    <View style={styles.container1}>
                        <View style={styles.button}>
                            <Text style={styles.TextSty}>{this.state.quantity}  ชิ้น</Text>
                        </View>
                    </View>
                    <View style={styles.ValueView}>
                        <View>
                            <Text style={styles.TextSty1}>จำนวนที่ต้องการเบิก</Text>
                        </View>
                        <View style={styles.buttonValueRow}>
                            <TouchableOpacity style={styles.Img2} onPress={this.onMinus}>
                                <Image source={require('../Image/Minus.png')} style={styles.Img1} />
                            </TouchableOpacity>
                            <View style={styles.ValueBtn}>
                                <Text style={styles.TextValue}>{this.state.quantityCal}</Text>
                            </View>
                            <TouchableOpacity style={styles.Img2} onPress={this.onPlus}>
                                <Image source={require('../Image/Plus.png')} style={styles.Img1} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.ResetQty}>
                                <View style={styles.ValueBtn2}>
                                    <Text style={styles.TextBtn}>รีเซ็ต</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <View style={styles.ValueView}>
                            <Text style={styles.TextSty1}>คอมเมนต์ : </Text>
                        </View>
                        <View style={styles.container1}>
                            <TextInput style={styles.commentBtn}
                                underlineColorAndroid='#ffffff'
                                placeholder=""
                                placeholderTextColor="#000"
                                onChangeText={(comment) => {
                                    var comment;
                                    comment = '( ' + comment.toString() + ' )'
                                    this.setState({ comment: comment })
                                }
                                }
                            />
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button2} onPress={this.AlertSave}>
                            <Text style={styles.TextBtn}>บันทึก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button2} onPress={this.Cancel}>
                            <Text style={styles.TextBtn}>ยกเลิก</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this._maybeRenderUploadingOverlay()}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ABCEEF',
        justifyContent: 'space-between',
    },
    container1: {
        alignItems: 'center',
    },
    ImgLogo: {
        width: 0.2 * deviceHeight,
        height: 0.2 * deviceHeight,
        borderRadius: 1 / 2 * 0.1 * deviceWidth,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: '#ffffff'
    },
    ImgLogo2: {
        width: 0.2 * deviceHeight,
        height: 0.2 * deviceHeight,
        borderRadius: 1 / 2 * 0.1 * deviceWidth,
    },
    Img: {
        marginBottom: 0.05 * deviceWidth,
        marginTop: 0.05 * deviceWidth,
    },
    Img1: {
        width: 0.05 * deviceHeight,
        height: 0.05 * deviceHeight
    },
    Img2: {
        marginTop: 0.004 * deviceWidth,
        marginBottom: 0.004 * deviceWidth,
        marginLeft: 0.01 * deviceWidth,
        marginRight: 0.01 * deviceWidth,
    },
    button: {
        justifyContent: 'center',
        width: 0.85 * deviceWidth,
        backgroundColor: '#ffffff',
        borderRadius: 1 / 2 * 0.85 * deviceWidth,
        paddingHorizontal: 15,
        height: 0.1 * deviceWidth,
        marginBottom: 0.008 * deviceWidth,
        marginVertical: 0.01 * deviceWidth,
    },
    ValueView: {
        justifyContent: 'flex-start',
        marginBottom: 0.005 * deviceWidth,
        marginTop: 0.005 * deviceWidth,
        marginLeft: 0.1 * deviceWidth,
    },
    ValueBtn: {
        height: 0.08 * deviceWidth,
        borderRadius: 1 / 10 * 0.08 * deviceWidth,
        backgroundColor: '#ffffff',
        width: 0.15 * deviceWidth,
        marginTop: 0.01 * deviceWidth,
        marginBottom: 0.01 * deviceWidth,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    ValueBtn2: {
        height: 0.1 * deviceWidth,
        borderRadius: 1 / 10 * 0.1 * deviceWidth,
        backgroundColor: '#22313F',
        width: 0.3 * deviceWidth,
        marginTop: 0.01 * deviceWidth,
        marginBottom: 0.01 * deviceWidth,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0.12 * deviceWidth,
    },
    commentBtn: {
        width: 0.8 * deviceWidth,
        backgroundColor: '#ffffff',
        borderRadius: 1 / 5 * 0.2 * deviceWidth,
        paddingHorizontal: 15,
        fontSize: deviceWidth / 18,
        height: 0.2 * deviceWidth,
        marginBottom: 0.02 * deviceWidth,
    },
    TextSty: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'center',
        marginBottom: 0.005 * deviceWidth,
        marginTop: 0.005 * deviceWidth,
        marginLeft: 10,
    },
    TextSty1: {
        fontSize: deviceWidth / 20,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'center',
        marginBottom: 0.008 * deviceWidth,
        marginTop: 0.02 * deviceWidth,
        marginLeft: 15,
    },
    TextSty2: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'center',
        marginBottom: 0.008 * deviceWidth,
        marginTop: 0.012 * deviceWidth,
        marginLeft: 15,
    },
    button2: {
        width: 0.3 * deviceWidth,
        backgroundColor: '#22313F',
        borderRadius: 1 / 5 * 0.125 * deviceWidth,
        marginBottom: 20,
        marginTop: 20,
        height: 0.125 * deviceWidth,
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginLeft: 0.04 * deviceWidth,
        marginRight: 0.04 * deviceWidth,
    },
    buttonValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextValue: {
        justifyContent: 'center',
        fontSize: deviceWidth / 20,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'center',
        marginBottom: 0.005 * deviceWidth,
        marginTop: 0.005 * deviceWidth,
    },
    TextBtn: {
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
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#22313F',
        marginLeft: 0.02 * deviceWidth,
    },
    TextInHeader2: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#22313F',
    }
});
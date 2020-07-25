import React from 'react';
import {
    Text, StyleSheet, View, Button, TouchableOpacity, Image, Dimensions,
    ScrollView, FlatList, Alert, Platform, AsyncStorage, ActivityIndicator
} from 'react-native';
import _ from 'lodash';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

console.disableYellowBox = true;

export default class Activity extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: false,
    });

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            FinalQty: '',
            uploading: false,
            token: null,
            title: '',
            body: '',
            quantity: '',
            time: '',
            date: '',
            limit: 0,
            limitUser: 0,
            typeUser: '',
            limitCal: 0,
            limitCalF: 0
        };
    }
    ResetState = () => {
        this.setState({
            data: [],
            FinalQty: '',
            uploading: false,
        })
    }
    Back = () => {
        const { navigate } = this.props.navigation;
        this.ResetState();
        navigate('Menu')
    }

    getData(values) {
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone(dataVal[dataKey]);
                cloned.key = dataKey;
                return cloned;
            }).value();
        this.setState({
            data: data,
            uploading: false
        });
    }
    // getToken(values) {
    //     let TokenVal = values
    //     let token = TokenVal
    //     this.setState({
    //         token: token
    //     });
    // };


    componentWillMount = () => {
        this.setState({ uploading: true });
        const { db } = this.props.screenProps
        var dbTransaction = db.database().ref('/Transaction');
        dbTransaction.on('value', snapshot => {
            this.getData(snapshot.val());
        });
        // var dbNotification = db.database().ref('/User').child('/employee').child('/token');
        // dbNotification.on('value', snapshot => {
        //     this.getToken(snapshot.val());
        // });
    }

    componentWillUnmount = () => {
        const { db } = this.props.screenProps
        var dbUnmount = db.database().ref('/Transaction');
        dbUnmount.off();
    }

    onClickDelete = (key, typeStock, id, name, lastQty, detail, comment, keyUser, nameUser) => {
        const { navigate } = this.props.navigation;
        const { db } = this.props.screenProps
        Alert.alert(
            'ต้องการยกเลิกการทำรายการ', '',
            [
                {
                    text: 'ใช่',
                    onPress:
                        async () => {
                            try {
                                this.getDayNow();
                                this.getTimeNow();
                                this.toHistoryDelete(id, detail, name, comment, keyUser, lastQty, typeStock, nameUser);
                                let dbCon = db.database().ref('/Transaction');
                                dbCon.child(key).remove();
                                // if (typeStock == 'StockIn') {
                                //     this.setState({
                                //         title: 'ไม่อนุมัติการเพิ่มสินค้า',
                                //         body: '[ ' + id + ' ] ' + name + ' ( ' + detail + ' )' + ' จำนวน ' + lastQty + ' ชิ้น',
                                //     })
                                //     this.sendPushNotification();
                                // } else if (typeStock == 'StockOut') {
                                //     this.setState({
                                //         title: 'ไม่อนุมัติการเบิกสินค้า',
                                //         body: '[ ' + id + ' ] ' + name + ' ( ' + detail + ' )' + ' จำนวน ' + lastQty + ' ชิ้น',
                                //     })
                                //     this.sendPushNotification();
                                // }
                            } catch (error) {
                                console.log(error)
                            }
                        },
                },
                {
                    text: 'ไม่ใช่',
                    onPress: () => { }
                },
            ],
            { cancellable: false }
        );
    }
    //เช็คว่าถ้าเท่ากับ limit
    onClickUpdate(id) {
        const { navigate } = this.props.navigation;
        const { db } = this.props.screenProps
        var obj = { quantity: this.state.FinalQty };
        let dbUpdate = db.database().ref('/Product');
        dbUpdate.child(id).update(obj)
    }
    Delete(key) {
        const { navigate } = this.props.navigation;
        const { db } = this.props.screenProps
        let dbDelete = db.database().ref('/Transaction');
        dbDelete.child(key).remove();
        this.setState({ uploading: false });
    }
    getTypeStockTransaction = (key) => {
        const { db } = this.props.screenProps
        let typeStock = ''
        let dbTypeStock = db.database().ref('/Transaction').child(key).child('typeStock')
        dbTypeStock.on('value', snapshot => {
            typeStock = this.getTypeStock(snapshot.val());
        });
        return typeStock
    }
    getTypeStock(values) {
        let typeStock = values
        this.setState({
            typeStock: typeStock
        });
        return typeStock
    };
    getQtyTransaction = (key) => {
        const { db } = this.props.screenProps
        let lastQty = ''
        let dbQty = db.database().ref('/Transaction').child(key).child('lastQty')
        dbQty.on('value', snapshot => {
            lastQty = this.getQty(snapshot.val());
        });
        return lastQty
    }
    getQty(values) {
        let lastQty = values
        this.setState({
            lastQty: lastQty
        });
        return lastQty
    };
    getValue = (id) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        let quantity = ''
        let dbQty = db.database().ref('/Product').child(id).child('quantity')
        dbQty.once('value', snapshot => {
            quantity = this.getQty(snapshot.val());
            resolve(quantity);
        });
    })
    getQty(values) {
        let quantity = values
        this.setState({
            quantity: quantity
        });
        return quantity
    };
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
    getLimitUser(values) {
        if (values !== null) {
            this.setState({
                limitUser: values
            });
            return values
        } else {
            this.setState({
                limitUser: 0
            });
            return values
        }
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
    getValuelimitUser = (key, id) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var limitUser = ''
        var dbLimitUser = db.database().ref('User').child(key).child('Limit').child(id).child('qtyLimit')
        dbLimitUser.once('value', snapshot => {
            limitUser = this.getLimitUser(snapshot.val());
            resolve(limitUser);
        });
    })
    onClickAccept = async (key, id, detail, name, comment, keyUser, nameUser) => {
        this.setState({ uploading: true });
        const quantity = await this.getValue(id);
        let typeStock = this.getTypeStockTransaction(key);
        let lastQty = this.getQtyTransaction(key);
        const typeUser = await this.getTypeUser(keyUser);
        const limitUser = await this.getValuelimitUser(keyUser, id);
        if (typeStock == 'StockIn') {
            // this.setState({
            //     FinalQty: quantity + lastQty,
            //     title: 'อนุมัติการเพิ่มสินค้า',
            //     body: '[ ' + id + ' ] ' + name + ' ( ' + detail + ' )' + ' จำนวน ' + lastQty + ' ชิ้น',
            // })
            // this.onClickUpdate(id);
            // this.toHistory(id, detail, name, comment, keyUser, lastQty, time, typeStock);
            // this.DashboardStockIn(id, detail, name, lastQty);
            // this.Delete(key);
            // Alert.alert('สถานะการทำรายการ', 'ทำรายการสำเร็จ')
            // this.sendPushNotification();

        } else if (typeStock == 'StockOut') {
            if (typeUser == 'student') {
                const limit = await this.getValuelimitSTU(id);
                console.log(limit)
            } else {
                const limit = await this.getValuelimit(id);
                console.log(limit)
            }
            if (quantity >= lastQty) {
                if (this.state.limit >= this.state.limitUser + lastQty) {
                    this.setState({
                        FinalQty: quantity - lastQty,
                        // title: 'อนุมัติการเบิกสินค้า',
                        // body: '[ ' + id + ' ] ' + name + ' ( ' + detail + ' )' + ' จำนวน ' + lastQty + ' ชิ้น',
                    })
                    this.getDayNow();
                    this.getTimeNow();
                    this.onClickUpdate(id);
                    this.toHistory(id, detail, name, comment, keyUser, lastQty, typeStock, nameUser);
                    this.toLimit(id, name, keyUser, lastQty, detail);
                    this.DashboardStockOut(id, detail, name, lastQty);
                    this.Delete(key);
                    Alert.alert('สถานะการทำรายการ', 'ทำรายการสำเร็จ')
                    // this.sendPushNotification();
                } else {
                    Alert.alert('ข้อผิดพลาด', 'เบิกสินค้าเกินจำนวนที่กำหนดไว้แล้ว')
                    this.setState({ uploading: false });
                }
            } else {
                Alert.alert('ข้อผิดพลาด', 'กรุณาตรวจสอบสินค้าคงคลัง และทำรายการใหม่');
                this.setState({ uploading: false });
            }
        }
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
    getTypeUser = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var typeUser = ''
        var dbTypeUser = db.database().ref('User').child(key).child('typeUser')
        dbTypeUser.once('value', snapshot => {
            typeUser = this.getUser(snapshot.val());
            resolve(typeUser);
        });
    })
    getUser(values) {
        this.setState({
            typeUser: values
        });
        return values
    }
    toHistory = async (id, detail, name, comment, keyUser, lastQty, typeStock, nameUser) => {
        try {
            const { db } = this.props.screenProps
            const keyUserValue = await AsyncStorage.getItem('keyUser')
            const valueKeyUser = JSON.parse(keyUserValue)
            const NameValue = await AsyncStorage.getItem('loginName')
            const valueName = JSON.parse(NameValue)
            let dbTransaction = db.database().ref('/History');
            dbTransaction.push({
                typeStock: typeStock,
                lastQty: lastQty,
                name: name,
                detail: detail,
                id: id,
                comment: comment,
                keyUser: keyUser,
                nameUser: nameUser,
                keyApprove: valueKeyUser.keyUser,
                nameApp: valueName.loginName,
                time: this.state.time,
                date: this.state.date
            });
        } catch (error) {
            console.log(error)
        }
    }
    toHistoryDelete = async (id, detail, name, comment, keyUser, lastQty, typeStock, nameUser) => {
        try {
            const { db } = this.props.screenProps
            const keyUserValue = await AsyncStorage.getItem('keyUser')
            const valueKeyUser = JSON.parse(keyUserValue)
            const NameValue = await AsyncStorage.getItem('loginName')
            const valueName = JSON.parse(NameValue)
            let dbTransaction = db.database().ref('/HistoryDelete');
            dbTransaction.push({
                typeStock: typeStock,
                lastQty: lastQty,
                name: name,
                detail: detail,
                id: id,
                comment: comment,
                keyUser: keyUser,
                nameUser: nameUser,
                keyApp: valueKeyUser.keyUser,
                nameApp: valueName.loginName,
                time: this.state.time,
                date:this.state.date
            });
        } catch (error) {
            console.log(error)
        }
    }

    toLimit = (id, name, keyUser, lastQty, detail) => {
        const { db } = this.props.screenProps
        const productID = id
        let dbDataUser = db.database().ref('/User').child(keyUser).child('/Limit').child(id).once('value', async (snapshot) => {
            const result = snapshot.val()
            if (result) {
                let dbDataLimitSI = db.database().ref('/User').child(keyUser).child('/Limit').child(id).child('qtyLimit').once('value', snapshot => {
                    const qtyLast = snapshot.val()
                    const lastQtySI = lastQty + qtyLast
                    var objSO = {
                        qtyLimit: lastQtySI,
                    };
                    let dbUpdate = db.database().ref('/User').child(keyUser).child('/Limit').child(id).update(objSO);
                });

            } else {
                let dbDataLimitSI = db.database().ref('/User').child(keyUser).child('/Limit').child(id);
                dbDataLimitSI.set({
                    qtyLimit: lastQty,
                    name: name,
                    detail: detail,
                    limitPro: this.state.limit
                });
            }
        })
    }

    // DashboardStockIn(id, detail, name, lastQty) {
    //     const { navigate } = this.props.navigation;
    //     const { db } = this.props.screenProps
    //     var objSI = {
    //         id: id,
    //         detail: detail,
    //         name: name,
    //         lastQty: lastQty,
    //     };
    //     let dbUpdate = db.database().ref('/Dashboard');
    //     dbUpdate.child('/StockIn').update(objSI)
    // }
    DashboardStockOut(id, detail, name, lastQty) {
        const { navigate } = this.props.navigation;
        const { db } = this.props.screenProps
        var objSO = {
            id: id,
            detail: detail,
            name: name,
            lastQty: lastQty,
        };
        let dbUpdate = db.database().ref('/Dashboard');
        dbUpdate.child('/StockOut').update(objSO)
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

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.Scroll}>
                    <View style={styles.header1}>
                        <View style={styles.header2}>
                            <Image source={require('../Image/ICONactivity.png')} style={styles.header3} />
                            <Text style={styles.TextInHeader1}>การทำรายการ</Text>
                        </View>
                        <TouchableOpacity style={styles.header4} onPress={this.Back}>
                            <Text style={styles.TextInHeader2}>{'<'} ย้อนกลับ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.HeaderTable}>
                    <View style={styles.Table}>
                        <View style={styles.InsideTable}>
                            <View style={styles.RowTable}>
                                <Image source={require('../Image/PinDashboard.png')} style={styles.ImgTable} />
                                <Text style={styles.TextTable}>ประวัติการทำรายการ</Text>
                            </View>
                        </View>
                        <View style={{ flex: 12 }}>
                            <FlatList
                                data={this.state.data}
                                renderItem={({ item }) => (
                                    <View style={styles.List}>
                                        <View style={styles.DataView}>
                                            {item.comment == '' ?
                                                <View style={styles.VText}>
                                                    {item.typeStock == 'StockIn' ?
                                                        <Text style={styles.itemName1}>
                                                            [ มีการเพิ่ม ]: {item.name}  {item.detail}
                                                        </Text>
                                                        : (
                                                            <Text style={styles.itemName1}>
                                                                [ มีการเบิก ]: {item.name}  {item.detail}
                                                            </Text>)}
                                                    <Text style={styles.itemName1}>จำนวน {item.lastQty}  ชิ้น </Text>
                                                    <Text style={styles.itemName1}>จาก {item.nameUser}</Text>
                                                    <Text style={styles.itemName2}>
                                                        [ {item.date} ] {item.time}
                                                    </Text>
                                                </View>
                                                : (
                                                    <View style={styles.VText}>
                                                        {item.typeStock == 'StockIn' ?
                                                            <Text style={styles.itemName1}>
                                                                [ มีการเพิ่ม ]: {item.name}  {item.detail}
                                                            </Text>
                                                            : (
                                                                <Text style={styles.itemName1}>
                                                                    [ มีการเบิก ]: {item.name}  {item.detail}
                                                                </Text>)}
                                                        <Text style={styles.itemName1}>จำนวน {item.lastQty}  ชิ้น </Text>
                                                        <Text style={styles.itemName1}>จาก {item.nameUser}</Text>
                                                        <Text style={styles.itemName1}>
                                                            {item.comment}
                                                        </Text>
                                                        <Text style={styles.itemName2}>
                                                            [ {item.date} ] {item.time}
                                                        </Text>
                                                    </View>)}
                                        </View>
                                        <View style={styles.ButtonView}>
                                            <TouchableOpacity onPress={() => this.onClickAccept(item.key, item.id, item.detail, item.name, item.comment, item.keyUser, item.nameUser)}>
                                                <View style={styles.Accept}>
                                                    <Text style={styles.TextBtn}>ยืนยัน</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.onClickDelete(item.key, item.typeStock, item.id, item.name, item.lastQty, item.detail, item.comment, item.keyUser, item.nameUser)}>
                                                <View style={styles.Delete}>
                                                    <Text style={styles.TextBtn}>ยกเลิก</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={item => item.key}
                            />
                        </View>
                    </View>
                </View>
                {this._maybeRenderUploadingOverlay()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    HeaderTable: {
        flex: 1,
        backgroundColor: '#D9EAFB',
        alignItems: 'center'
    },
    Table: {
        flex: 1,
        width: 0.9 * deviceWidth,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        height: 0.3 * deviceWidth,
        borderRadius: 1 / 20 * 0.2 * deviceWidth,
        marginTop: 0.05 * deviceWidth,
        marginBottom: 0.05 * deviceWidth,
    },
    TextTable: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginLeft: 0.02 * deviceWidth,
    },
    InsideTable: {
        flex: 1,
        backgroundColor: '#498cf7',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    RowTable: {
        flexDirection: 'row',
        marginLeft: 0.04 * deviceWidth,
    },
    ImgTable: {
        width: 0.04 * deviceHeight,
        height: 0.04 * deviceHeight
    },
    TextSty: {
        fontSize: deviceWidth / 28,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'center',
        marginBottom: 0.01 * deviceWidth,
        marginTop: 0.01 * deviceWidth,
        marginLeft: 0.03 * deviceWidth,
    },
    List: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        borderColor: '#D3D3D3',
        borderWidth: 1,
        alignItems: 'center'
    },
    DataView: {
        flex: 4,
        flexDirection: 'row',
        marginRight: 0.04 * deviceWidth,
    },
    ButtonView: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    VText: {
        marginTop: 0.02 * deviceWidth,
        marginBottom: 0.02 * deviceWidth,
    },
    itemName1: {
        fontSize: deviceWidth / 30,
        color: '#000',
        marginLeft: 0.04 * deviceWidth,
    },
    itemName2: {
        fontSize: deviceWidth / 32,
        color: '#696969',
        marginTop: 0.01 * deviceWidth,
        marginLeft: 0.04 * deviceWidth,
    },
    Img1: {
        width: 0.05 * deviceHeight,
        height: 0.05 * deviceHeight
    },
    Accept: {
        marginTop: 0.025 * deviceWidth,
        marginBottom: 0.01 * deviceWidth,
        width: 0.15 * deviceWidth,
        height: 0.08 * deviceWidth,
        borderRadius: 1 / 5 * 0.06 * deviceWidth,
        backgroundColor: '#33aa44',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Delete: {
        marginTop: 0.01 * deviceWidth,
        marginBottom: 0.025 * deviceWidth,
        width: 0.15 * deviceWidth,
        height: 0.08 * deviceWidth,
        borderRadius: 1 / 5 * 0.06 * deviceWidth,
        backgroundColor: '#de4438',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TextBtn: {
        fontSize: deviceWidth / 26,
        fontWeight: 'bold',
        color: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Scroll: {
        backgroundColor: '#D9EAFB',
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
import React from 'react';
import { Text, StyleSheet, View, Button, TouchableOpacity, FlatList, Image, Dimensions, Alert, ActivityIndicator, AsyncStorage } from 'react-native';
import _ from 'lodash';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

console.disableYellowBox = true;

export default class MyProduct extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: false,
    });

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            uploading: false,
            keyUser: '',
            nameApp: '',
            time: '',
            date: '',
        };
    }
    ResetState = () => {
        this.setState({
            data: [],
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

    componentWillMount = () => {
        this.setState({ uploading: true });
        const { db } = this.props.screenProps
        var dbProduct = db.database().ref('Product');
        dbProduct.on('value', snapshot => {
            this.getData(snapshot.val());
        });
    }
    componentWillUnmount = () => {
        const { db } = this.props.screenProps
        var dbUnmount = db.database().ref('Product');
        dbUnmount.off();
    }
    onClickDelete = (key, id, detail, limit, limitStu, name, quantity) => {
        const { navigate } = this.props.navigation;
        const { db } = this.props.screenProps
        Alert.alert(
            'ต้องการลบรายการสินค้า', '',
            [
                {
                    text: 'ใช่',
                    onPress:
                        async () => {
                            try {
                                this.getDayNow();
                                this.getTimeNow();
                                this.setOnDB(id, detail, limit, limitStu, name, quantity);
                                let ref = db.storage().ref(key);
                                ref.delete().then(() => {
                                    console.log('Delete Image Success');
                                    let dbCon = db.database().ref('Product');
                                    dbCon.child(key).remove().then(() => {
                                        console.log('Delete Data Success');
                                    }).catch((error) => {
                                        console.log('Delete Data Error');
                                    });
                                }).catch((error) => {
                                    console.log('Delete Image Error');
                                })
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
    setOnDB = (id, detail, limit, limitStu, name, quantity) => {
        const { db } = this.props.screenProps
        let dbDeleteProduct = db.database().ref('/HistoryDeleteProduct');
        dbDeleteProduct.push({
            id: id,
            name: name,
            detail: detail,
            quantity: quantity,
            limit: limit,
            limitStu: limitStu,
            nameApp: this.state.nameApp,
            keyApp: this.state.keyUser,
            time: this.state.time,
            date: this.state.date
        });
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

            <View style={styles.container}>
                <View style={styles.Scroll}>
                    <View style={styles.header1}>
                        <View style={styles.header2}>
                            <Image source={require('../Image/ICONmyproduct.png')} style={styles.header3} />
                            <Text style={styles.TextInHeader1}>สินค้าคงคลัง</Text>
                        </View>
                        <TouchableOpacity style={styles.header4} onPress={this.Back}>
                            <Text style={styles.TextInHeader2}>{'<'} ย้อนกลับ</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.AddBar1}>
                        <View style={styles.AddBar2}>
                            <TouchableOpacity style={styles.AddBar3} onPress={() => { navigate('AddPro') }}>
                                <Text style={styles.TextBtn}>เพิ่มสินค้า</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <View style={styles.List}>
                            <Image source={{ uri: item.image }} style={styles.Img} />
                            < View style={styles.ListText}>

                                {item.quantity == 0 ?
                                    <View>
                                        <View style={styles.space1}>
                                            <Text style={styles.itemName2}>รหัสสินค้า : ({item.key})</Text>
                                        </View>
                                        <View style={styles.space1}>
                                            <Text style={styles.itemName2}>ชื่อสินค้า : {item.name}</Text>
                                        </View>
                                        <View style={styles.space1}>
                                            <Text style={styles.itemDetail2}>{item.detail}</Text>
                                        </View>
                                        <View style={styles.space1}>
                                            <Text style={styles.itemCode2}>จำนวน {item.quantity}  ชิ้น  (สินค้าหมด)</Text>
                                        </View>
                                    </View>
                                    : (
                                        <View>
                                            <View style={styles.space1}>
                                                <Text style={styles.itemName}>รหัสสินค้า : ({item.key})</Text>
                                            </View>
                                            <View style={styles.space1}>
                                                <Text style={styles.itemName}>ชื่อสินค้า : {item.name}</Text>
                                            </View>
                                            <View style={styles.space1}>
                                                <Text style={styles.itemDetail}>{item.detail}</Text>
                                            </View>
                                            <View style={styles.space1}>
                                                <Text style={styles.itemCode}>จำนวน {item.quantity}  ชิ้น</Text>
                                            </View>
                                        </View>)}
                            </View>
                            <TouchableOpacity style={styles.BtnCancle} onPress={() => this.onClickDelete(item.key, item.id, item.detail, item.limit, item.limitStu, item.name, item.quantity)}>
                                <Image source={require('../Image/cancleProduct.png')} style={styles.ImgCancle} />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.key}
                //numColumns={numColumns} 
                />
                {this._maybeRenderUploadingOverlay()}
            </View>
        );
    }
}
//const numColumns = 2; ถ้าอยากทำเป็น 2 คอลัมน์

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D9EAFB'
    },
    Scroll: {
        backgroundColor: '#D9EAFB',
        alignItems: 'center'
    },
    List: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 0.02 * deviceHeight,
        marginLeft: 10,
        marginRight: 10,
        borderColor: '#D3D3D3',
        borderBottomWidth: 1,
    },
    ListText: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    Img: {
        width: 0.17 * deviceHeight,
        height: 0.17 * deviceHeight,
        margin: 0.05 * deviceWidth,
        borderRadius: 1 / 2 * 0.1 * deviceWidth,
        marginLeft: 0.02 * deviceWidth,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    space1: {
        marginBottom: 0.02 * deviceWidth,
    },
    ImgCancle: {
        width: 0.04 * deviceHeight,
        height: 0.04 * deviceHeight
    },
    BtnCancle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 0.04 * deviceHeight,
        height: 0.04 * deviceHeight,
        borderRadius: 100,
        marginTop: 5,
    },
    itemName: {
        fontSize: deviceWidth / 24,
        color: '#000',
        fontWeight: '600',
    },
    itemDetail: {
        fontSize: deviceWidth / 26,
        color: '#000',
        fontWeight: '600',
    },
    itemName2: {
        fontSize: deviceWidth / 24,
        color: 'red',
        fontWeight: '600',
    },
    itemDetail2: {
        fontSize: deviceWidth / 26,
        color: 'red',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: deviceWidth / 26,
        color: '#000',
        marginBottom: 5,
    },
    itemCode2: {
        fontWeight: '600',
        fontSize: deviceWidth / 26,
        color: 'red',
        marginBottom: 5,
    },
    AddBar1: {
        paddingTop: 10,
        paddingBottom: 5,
    },
    AddBar2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    AddBar3: {
        width: 0.4 * deviceWidth,
        backgroundColor: '#ABCEEF',
        borderRadius: 1 / 5 * 0.4 * deviceWidth,
        marginBottom: 10,
        marginTop: 10,
        height: 0.1 * deviceWidth,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#22313F',
    },
    TextBtn: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#22313F',
        alignItems: 'center',
        marginBottom: 0.02 * deviceWidth,
        marginTop: 0.02 * deviceWidth,
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
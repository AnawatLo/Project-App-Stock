import React from 'react';
import {
    Text, StyleSheet, Image, TextInput, View, Button,
    TouchableOpacity, Alert, AsyncStorage, Dimensions, ScrollView, ActivityIndicator
} from 'react-native';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

console.disableYellowBox = true;

export default class FindStock extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: false,
    });

    constructor(props) {
        super(props);

        this.state = {
            img: '',
            id: '',
            name: '',
            quantity: '',
            detail: '',
            uploading: false,
        };
    }
    ResetState = () => {
        this.setState({
            img: '',
            id: '',
            name: '',
            quantity: '',
            detail: '',
            uploading: false,
        })
    }

    AlertGoHome = () => {
        const { navigate } = this.props.navigation;
        Alert.alert(
            'ต้องการกลับสู่หน้าเมนู ?',
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
    };

    getTest = async () => {
        try {
            // console.log('============================')
            const strValue = await AsyncStorage.getItem('KeyLastScanerFind')
            const value = JSON.parse(strValue)
            // console.log('check value', value) เช็คค่า QRCode ที่อ่านเข้ามา

            // value = { lastScannedUrl: '' }
            // you can use this
            // 1. const { lastScannedUrl } = value OR
            // 2. value.lastScannedUrl

            this.setState({ uploading: true });
            const { db } = this.props.screenProps
            const id = await this.getValueID(value.lastScannedUrl);
            switch (value.lastScannedUrl) {
                case this.state.id:
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
                    var dbQty = db.database().ref('Product').child(value.lastScannedUrl).child('quantity')
                    dbQty.on('value', snapshot => {
                        this.getQty(snapshot.val());
                    });
                    break;
                default:
                    const { navigate } = this.props.navigation;
                    Alert.alert(
                        'ไม่มีข้อมูลนี้อยู่ในระบบ',
                        '',
                        [
                            {
                                text: 'ตกลง',
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
            console.log(error)
        }
    }
    getValueID = (key) => new Promise((resolve, reject) => {
        const { db } = this.props.screenProps
        var id = ''
        var dbID = db.database().ref('Product').child(key).child('id')
        dbID.once('value', snapshot => {
            id = this.getID(snapshot.val());
            resolve(id);
        });
    })
    getID(values) {
        let id = values
        this.setState({
            id: id
        });
        return id
    };
    getImage(values) {
        let ImgVal = values
        let img = ImgVal
        this.setState({
            img: img
        });
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
    };
    getQty(values) {
        let QtyVal = values
        let quantity = QtyVal
        this.setState({
            quantity: quantity
        });
        this.setState({ uploading: false });
    };
    componentWillMount() {
        this.getTest();
        this.getName();
        this.getQty();
        this.getDetail();
    }
    componentWillUnmount() {
        var dbUnImage = db.database().ref('Product').child(value.lastScannedUrl).child('image')
        dbUnImage.off();
        var dbUnName = db.database().ref('Product').child(value.lastScannedUrl).child('name')
        dbUnName.off();
        var dbUnDetail = db.database().ref('Product').child(value.lastScannedUrl).child('detail')
        dbUnDetail.off();
        var dbUnQty = db.database().ref('Product').child(value.lastScannedUrl).child('quantity')
        dbUnQty.off();
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

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.Scroll}>
                        <View style={styles.header1}>
                            <View style={styles.header2}>
                                <Image source={require('../Image/ICONfind.png')} style={styles.header3} />
                                <Text style={styles.TextInHeader1}>ตรวจสอบสินค้าคงคลัง</Text>
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
                        <Text style={styles.TextSty2}>จำนวนสินค้าในคงคลัง : </Text>
                    </View>
                    {this.state.quantity == 0 ?
                        <View style={styles.container1}>
                            <View style={styles.button}>
                                <Text style={styles.TextSty3}>สินค้าหมด</Text>
                            </View>
                        </View>
                        : (
                            <View style={styles.container1}>
                                <View style={styles.button}>
                                    <Text style={styles.TextSty}>{this.state.quantity}  ชิ้น</Text>
                                </View>
                            </View>)}
                    <View>
                        <View style={styles.container1}>
                            <TouchableOpacity style={styles.button2} onPress={this.AlertGoHome}>
                                <Text style={styles.TextBtn}>กลับสู่หน้าเมนู</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: '#ABCEEF',
        justifyContent: 'center',
    },
    container1: {
        alignItems: 'center',
    },
    Img: {
        marginBottom: 0.05 * deviceWidth,
        marginTop: 0.05 * deviceWidth,
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
        marginBottom: 0.005 * deviceWidth,
        marginTop: 0.005 * deviceWidth,
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
    TextSty3: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: 'red',
        alignItems: 'center',
        marginBottom: 0.005 * deviceWidth,
        marginTop: 0.005 * deviceWidth,
        marginLeft: 10,
    },
    button2: {
        width: 0.8 * deviceWidth,
        backgroundColor: '#22313F',
        borderRadius: 1 / 2 * 0.15 * deviceWidth,
        marginVertical: 10,
        marginBottom: 20,
        marginTop: 0.2 * deviceWidth,
        height: 0.15 * deviceWidth,
        justifyContent: 'center',
        paddingVertical: 12,
    },
    TextBtn: {
        fontSize: deviceWidth / 20,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
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
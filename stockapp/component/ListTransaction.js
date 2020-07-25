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
            typeUser: '',
        };
    }
    Back = () => {
        const { navigate } = this.props.navigation;
        navigate('Menu')
    }
    componentWillMount = () => {
        this.keyUser();
    }
    keyUser = async () => {
        const keyUserValue = await AsyncStorage.getItem('keyUser')
        const valueKeyUser = JSON.parse(keyUserValue)
        this.setState({ uploading: true });
        const { db } = this.props.screenProps
        var dbListTran = db.database().ref('User').child(valueKeyUser.keyUser).child('Limit');
        dbListTran.on('value', snapshot => {
            this.getData(snapshot.val());
        });
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
                            <Image source={require('../Image/ICONListTran.png')} style={styles.header3} />
                            <Text style={styles.TextInHeader1}>รายการที่เบิกทั้งหมด</Text>
                        </View>
                        <TouchableOpacity style={styles.header4} onPress={this.Back}>
                            <Text style={styles.TextInHeader2}>{'<'} ย้อนกลับ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.data == [] && (
                        <View />
                    )}
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <View style={{ width: 0.8 * deviceWidth, borderColor: '#D3D3D3', borderBottomWidth: 1, marginLeft: 0.06 * deviceWidth, }}>
                            <View style={{ margin: 0.05 * deviceWidth, width: deviceWidth }}>
                                {item.limitPro !== item.qtyLimit ?
                                    <View>
                                        <Text style={styles.itemName2}>รหัสสินค้า : ({item.key})</Text>
                                        <Text style={styles.itemName2}>ชื่อสินค้า : {item.name}</Text>
                                        <Text style={styles.itemName2}>รายละเอียด : {item.detail}</Text>
                                        <Text style={styles.itemName2}>จำนวนที่เบิกไป : {item.qtyLimit} ชิ้น</Text>
                                        <Text style={styles.itemName2}>( เบิกได้อีก : {item.limitPro - item.qtyLimit} ชิ้น )</Text>
                                    </View>
                                    : (<View>
                                        <Text style={styles.itemName}>รหัสสินค้า : ({item.key})</Text>
                                        <Text style={styles.itemName}>ชื่อสินค้า : {item.name}</Text>
                                        <Text style={styles.itemName}>รายละเอียด : {item.detail}</Text>
                                        <Text style={styles.itemName}>จำนวนที่เบิกไป : {item.qtyLimit} ชิ้น   ( เบิกครบแล้ว )</Text>
                                    </View>
                                    )}
                            </View>
                        </View>)}
                    keyExtractor={item => item.key}
                />
                {this._maybeRenderUploadingOverlay()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D9EAFB'
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
    },
    itemName2: {
        fontWeight: '600',
        fontSize: deviceWidth / 26,
        color: '#000',
        marginBottom: 5,
    },
    itemName: {
        fontWeight: '600',
        fontSize: deviceWidth / 26,
        color: 'red',
        marginBottom: 5,
    }
})
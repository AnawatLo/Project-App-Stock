import React from 'react';
import { Text, StyleSheet, View, Button, TouchableOpacity, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import _ from 'lodash';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

export default class Dashboard extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        header: false,
    });
    constructor(props) {
        super(props);

        this.state = {
            dataTable1: {},
            dataTable2: {},
            dataTable3: {},
            dataTable4: {},
            uploading: false,
            checkData: false
        };
    }
    ResetState = () => {
        this.setState({
            dataTable1: {},
            dataTable2: {},
            dataTable3: {},
            dataTable4: {},
            uploading: false,
        })
    }
    Back = () => {
        const { navigate } = this.props.navigation;
        this.ResetState();
        navigate('Menu')
    }
    getData(values) {
        const { db } = this.props.screenProps
        let dataVal = values;
        let data = _(dataVal)
            .keys()
            .map(dataKey => {
                let cloned = _.clone(dataVal[dataKey]);
                cloned.key = dataKey;
                return cloned;
            }).value();
        var maxData = this.bubbleSortMax(data, data.length);
        this.setState({
            dataTable3: maxData
        })
        var minData = this.bubbleSortMin(data, data.length);
        this.setState({
            dataTable4: minData,
            uploading: false,
            checkData: true
        })
    }

    componentWillMount = () => {
        this.setState({ uploading: true });
        const { db } = this.props.screenProps
        var Tb1 = db.database().ref('/Dashboard').child('/StockIn');
        Tb1.on('value', snapshot => {
            this.setState({
                dataTable1: snapshot.val()
            });
        });
        var Tb2 = db.database().ref('/Dashboard').child('/StockOut');
        Tb2.on('value', snapshot => {
            this.setState({
                dataTable2: snapshot.val()
            });
        });
        var Tb3 = db.database().ref('/Product');
        Tb3.on('value', snapshot => {
            if (snapshot.val()) {
                this.getData(snapshot.val());
            } else {
                this.setState({
                    checkData: false,
                    uploading: false,
                })
            }
        });
    }

    bubbleSortMax = (items) => {
        var length = items.length;
        for (var i = (length - 1); i >= 0; i--) {
            //Number of passes
            for (var j = (length - i - 1); j > 0; j--) {
                //Compare the adjacent positions
                if (items[j].quantity > items[j - 1].quantity) {
                    //Swap the numbers
                    var tmp = items[j];
                    items[j] = items[j - 1];
                    items[j - 1] = tmp;
                }
            }
        }
        return items[0]
    }

    bubbleSortMin = (items) => {
        var length = items.length;
        for (var i = (length - 1); i >= 0; i--) {
            //Number of passes
            for (var j = (length - i - 1); j > 0; j--) {
                //Compare the adjacent positions
                if (items[j].quantity < items[j - 1].quantity) {
                    //Swap the numbers
                    var tmp = items[j];
                    items[j] = items[j - 1];
                    items[j - 1] = tmp;
                }
            }
        }
        var a = 0
        const c = []
        for (var b = items[a].quantity; a < items.length; a++) {
            if (items[a].quantity !== 0) c.push(items[a])
        }
        return c[0]

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

    componentWillUnmount = () => {
        const { db } = this.props.screenProps
        var dbUnmount1 = db.database().ref('/Dashboard').child('/StockIn');
        dbUnmount1.off();

        var dbUnmount2 = db.database().ref('/Dashboard').child('/StockOut');
        dbUnmount2.off();

        var dbUnmount3 = db.database().ref('/Product');
        dbUnmount3.off();
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.Scroll}>
                <ScrollView>
                    <View style={styles.header1}>
                        <View style={styles.header2}>
                            <Image source={require('../Image/ICONdashboard.png')} style={styles.header3} />
                            <Text style={styles.TextInHeader1}>กระดานข้อมูล</Text>
                        </View>
                        <TouchableOpacity style={styles.header4} onPress={this.Back}>
                            <Text style={styles.TextInHeader2}>{'<'} ย้อนกลับ</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Scroll}>
                        <View style={styles.Table}>
                            <View style={styles.InsideTable1}>
                                <View style={styles.RowTable}>
                                    <Image source={require('../Image/PinDashboard.png')} style={styles.ImgTable} />
                                    <Text style={styles.TextTable}>สินค้าที่เพิ่มล่าสุด</Text>
                                </View>
                            </View>
                            <View style={{ flex: 3.5, justifyContent: 'center' }}>
                                <Text style={styles.TextSty}>ชื่อสินค้า : {this.state.dataTable1.name}  ({this.state.dataTable1.id})</Text>
                                <Text style={styles.TextSty}>รายละเอียด : {this.state.dataTable1.detail}</Text>
                                <Text style={styles.TextSty}>จำนวนสินค้าที่เพิ่มล่าสุด : {this.state.dataTable1.lastQty}  ชิ้น</Text>
                            </View>
                        </View>
                        <View style={styles.Table}>
                            <View style={styles.InsideTable2}>
                                <View style={styles.RowTable}>
                                    <Image source={require('../Image/PinDashboard.png')} style={styles.ImgTable} />
                                    <Text style={styles.TextTable}>สินค้าที่เบิกล่าสุด</Text>
                                </View>
                            </View>
                            <View style={{ flex: 3.5, justifyContent: 'center' }}>
                                <Text style={styles.TextSty}>ชื่อสินค้า : {this.state.dataTable2.name}  ({this.state.dataTable2.id})</Text>
                                <Text style={styles.TextSty}>รายละเอียด : {this.state.dataTable2.detail}</Text>
                                <Text style={styles.TextSty}>จำนวนสินค้าที่เบิกล่าสุด : {this.state.dataTable2.lastQty}  ชิ้น</Text>
                            </View>
                        </View>
                        <View style={styles.Table}>
                            <View style={styles.InsideTable3}>
                                <View style={styles.RowTable}>
                                    <Image source={require('../Image/PinDashboard.png')} style={styles.ImgTable} />
                                    <Text style={styles.TextTable}>สินค้าคงคลังที่มากที่สุด</Text>
                                </View>
                            </View>
                            <View style={{ flex: 3.5, justifyContent: 'center' }}>
                                {
                                    this.state.checkData == true && (
                                        <View>
                                            <Text style={styles.TextSty}>ชื่อสินค้า : {this.state.dataTable3.name}  ({this.state.dataTable3.id})</Text>
                                            <Text style={styles.TextSty}>รายละเอียด : {this.state.dataTable3.detail}</Text>
                                            <Text style={styles.TextSty}>จำนวนสินค้า : {this.state.dataTable3.quantity}  ชิ้น</Text>
                                        </View>)}
                            </View>
                        </View>
                        <View style={styles.Table}>
                            <View style={styles.InsideTable4}>
                                <View style={styles.RowTable}>
                                    <Image source={require('../Image/PinDashboard.png')} style={styles.ImgTable} />
                                    <Text style={styles.TextTable}>สินค้าคงคลังที่น้อยที่สุด</Text>
                                </View>
                            </View>
                            <View style={{ flex: 3.5, justifyContent: 'center' }}>
                                {
                                    this.state.checkData == true && (
                                        <View>
                                            <Text style={styles.TextSty}>ชื่อสินค้า : {this.state.dataTable4.name}  ({this.state.dataTable4.id})</Text>
                                            <Text style={styles.TextSty}>รายละเอียด : {this.state.dataTable4.detail}</Text>
                                            <Text style={styles.TextSty}>จำนวนสินค้า : {this.state.dataTable4.quantity}  ชิ้น</Text>
                                        </View>)}
                            </View>
                        </View>
                        <View style={styles.TableLast}>
                            <Text style={styles.TextLast}>*** ถ้าข้อมูลของสินค้ามีมากกว่า 1 จะเรียงตามรหัสสินค้า ***</Text>
                            <Text style={styles.TextLast}></Text>
                        </View>
                    </View>
                </ScrollView>
                {this._maybeRenderUploadingOverlay()}
            </View>

        );
    }
}
const styles = StyleSheet.create({
    Scroll: {
        flex: 1,
        backgroundColor: '#D9EAFB',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Table: {
        width: 0.9 * deviceWidth,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        height: 0.3 * deviceWidth,
        borderRadius: 1 / 20 * 0.2 * deviceWidth,
        marginTop: 0.05 * deviceWidth,
    },
    TableLast: {
        width: 0.9 * deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0.02 * deviceWidth,
        marginBottom: 0.04 * deviceWidth,
    },
    TextTable: {
        fontSize: deviceWidth / 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginLeft: 0.02 * deviceWidth,
    },
    TextLast: {
        fontSize: deviceWidth / 34,
        color: 'red',
        alignItems: 'center',
    },
    InsideTable1: {
        flex: 1,
        backgroundColor: '#498cf7',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    InsideTable2: {
        flex: 1,
        backgroundColor: '#33aa44',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    InsideTable3: {
        flex: 1,
        backgroundColor: '#F2AE43',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    InsideTable4: {
        flex: 1,
        backgroundColor: '#de4438',
        justifyContent: 'center',
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
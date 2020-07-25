import React from 'react';
import {
  Alert, Linking, Dimensions, LayoutAnimation, Text, View,
  StatusBar, StyleSheet, TouchableOpacity, AsyncStorage, Image
} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

export default class Scan_StockIn extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: false,
  });
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
  };
  ResetState = () => {
    this.setState({
      hasCameraPermission: null,
      lastScannedUrl: null,
    })
  }
  Back = () => {
    const { navigate } = this.props.navigation;
    this.ResetState();
    navigate('Menu')
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {this.state.hasCameraPermission === null
            ? <Text>กำลังขออนุญาตจากกล้อง</Text>
            : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                ไม่ได้รับอนุญาตจากกล้อง
                    </Text>
              : <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{
                  height: deviceHeight,
                  width: deviceWidth,
                }}>
                <View style={{ flex: 1,justifyContent: 'space-around', }}>
                  <View style={{ flex: 1.5, alignItems: 'center', width: deviceWidth, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={styles.header1}>
                      <View style={styles.header2}>
                        <Image source={require('../Image/ICONscan.png')} style={styles.header3} />
                        <Text style={styles.TextInHeader1}>สแกน QR Code</Text>
                      </View>
                      <TouchableOpacity style={styles.header4} onPress={this.Back}>
                        <Text style={styles.TextInHeader2}>{'<'} ย้อนกลับ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.space1}>
                    <View style={styles.InSpace1} />
                    <View style={styles.InSpace1} />
                  </View>
                  <View style={styles.space2} >
                    <Text style={styles.InSpace2}>โปรดวาง QR Code ให้ห่างจากกล้องถ่ายรูป 20 ถึง 30 ซม.</Text>
                    <Text style={styles.InSpace2}>โดยให้มุมทั้ง 4 ของ QR Code อยู่ภายใต้กรอบ</Text>
                  </View>
                </View>
              </BarCodeScanner>
          }

          {this._maybeRenderUrl()}

          {/* <StatusBar hidden /> ปิดตรงแถบสัญญาณโทรสับข้างบน */}
        </View>
      </View>
    );
  }

  _handlePressUrl = () => {
    const { navigate } = this.props.navigation;

    Alert.alert(
      'ต้องการเพิ่มสินค้าคงคลัง : ', this.state.lastScannedUrl || '',
      [
        {
          text: 'ใช่',
          //onPress: () => Linking.openURL(this.state.lastScannedUrl), โค้ดนี้ใช้เปิดลิงค์ URL
          onPress: async () => {
            try {
              await AsyncStorage.setItem('KeyLastScanerStockIn', JSON.stringify({ lastScannedUrl: this.state.lastScannedUrl }))
              navigate('StockIn')
              this.ResetState();
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
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            รหัสสินค้า : {this.state.lastScannedUrl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this._handlePressCancel}>
          <Text style={styles.cancelButtonText}>
            ยกเลิก
              </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    height: 0.15 * deviceWidth,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urlText: {
    color: '#fff',
    fontSize: deviceWidth / 18,
    borderBottomWidth: 5,
    borderColor: '#ffffff',
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: deviceWidth / 20,
    fontWeight: 'bold'
  },
  header1: {
    alignItems: 'center',
    borderBottomWidth: 5,
    borderColor: '#ffffff',
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
    color: '#ffffff',
    marginLeft: 0.02 * deviceWidth,
  },
  TextInHeader2: {
    fontSize: deviceWidth / 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  space1: {
    flex: 3,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  space2: {
    alignItems: 'center',
    flex: 2,
    width: deviceWidth,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  InSpace1: {
    width: 0.1* deviceWidth,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  InSpace2: {
    color: '#ffffff',
    fontSize: deviceWidth / 30,
    padding: 10
  },
});
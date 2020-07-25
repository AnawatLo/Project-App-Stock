import React from 'react';
import {
  Platform, StyleSheet, Text, View, Button, TouchableOpacity, Keyboard, Alert,
  AsyncStorage, TextInput, Image, KeyboardAvoidingView, ScrollView, Dimensions, ActivityIndicator
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Expo from 'expo'

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

export default class Login extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: false,
  });

  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      organization: false,
      behavior: 'position',
    };
  }
  ResetState = () => {
    this.setState({
      uploading: false,
    })
  }

  async signInWithGoogleAsync() {
    const { db } = this.props.screenProps
    this.setState({ uploading: true }, async () => {
      try {
        await Expo.Google.logInAsync({
          androidClientId: '116113221624-54u3asjus9s73b84c98ciq6o5dmfagik.apps.googleusercontent.com',
          iosClientId: '116113221624-dgl3l9rq6kevpjia90upv06eetk23avr.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
        }).then(async (result) => {
          const { navigate } = this.props.navigation;
          if (result.type === 'success') {
            this.setState({
              loginEmail: result.user.email,
              loginName: result.user.name,
              loginPic: result.user.photoUrl,
            });
            this.checkEmail(result.user.email, result.user.name, result.user.photoUrl);
          } else {
            this.setState({ uploading: false })
            return { cancelled: true };
          }
        }).catch(() => this.setState({ uploading: false }))
      } catch (e) {
        return { error: true };
      }
    })
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
  checkType = (email, name, photoUrl) => {
    Alert.alert(
      'เข้าใช้งานครั้งแรกกรุณาระบุสถานะ',
      '',
      [
        { text: 'นักศึกษา', onPress: async () => { this.studentType(email, name, photoUrl) } },
        { text: 'อาจารย์/บุคลากร', onPress: async () => { this.employeeType(email, name, photoUrl) } },
      ],
      { cancelable: false }
    )
  }
  studentType = (email, name, photoUrl) => {
    const { db } = this.props.screenProps
    const { navigate } = this.props.navigation;
    const type = 'student'
    let dbUploadEmail = db.database().ref('/User');
    dbUploadEmail.push({
      employeeID: email,
      employeeName: name,
      employeePic: photoUrl,
      typeUser: type,
    });
    this.setState({
      uploading: false
    });
    navigate('Menu')
  }
  employeeType = (email, name, photoUrl) => {
    const { db } = this.props.screenProps
    const { navigate } = this.props.navigation;
    const type = 'employee'
    let dbUploadEmail = db.database().ref('/User');
    dbUploadEmail.push({
      employeeID: email,
      employeeName: name,
      employeePic: photoUrl,
      typeUser: type,
    });
    this.setState({
      uploading: false
    });
    navigate('Menu')
  }
  checkEmail = async (email, name, photoUrl) => {
    const { db } = this.props.screenProps
    const { navigate } = this.props.navigation;
    const employeeID = email
    let dbDataUser = db.database().ref('/User').on('value', async (snapshot) => {
      const result = snapshot.val()
      const employeeKey = Object.keys(result).filter(key => result[key].employeeID == employeeID)[0]

      try {
        await AsyncStorage.setItem('keyUser', JSON.stringify({ keyUser: employeeKey }))
        await AsyncStorage.setItem('loginName', JSON.stringify({ loginName: name }))
        await AsyncStorage.setItem('loginPic', JSON.stringify({ loginPic: photoUrl }))

      } catch (error) {
        console.log(error)
      }

      if (employeeKey) {
        this.setState({
          uploading: false
        });
        navigate('Menu')
      } else {
        this.checkType(email, name, photoUrl);
      }
    })
  }

  keyboardDidHideListener() {
    this.keyboardDidHideListener =
      Keyboard
        .addListener('keyboardDidHide', this._keyboardDidHide);
  }
  _keyboardDidHide() {
    Keyboard.dismiss();
  }

  render() {

    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container}>
        <View style={styles.space1}>
          <Image source={require('../Image/Logo.png')} style={styles.ImgLogo} />
          <Text style={styles.Welcome}>
            ยินดีต้อนรับเข้าสู่แอปพลิเคชัน
                  </Text>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={() => { this.signInWithGoogleAsync() }} >
            <Text style={styles.buttonText} >เข้าสู่ระบบด้วย Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.space2}>
          <Text style={styles.SignupTitle}>
            @2018 Applied mathematics KMITL, All Rights Reserved.
          </Text>
        </View>
        {this._maybeRenderUploadingOverlay()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#72b0f3',
  },
  ImgLogo: {
    width: 0.3 * deviceHeight,
    height: 0.3 * deviceHeight,
  },
  space1: {
    marginTop: 0.2 * deviceWidth,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  space2: {
    marginBottom: 0.06 * deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Welcome: {
    marginTop: 0.1 * deviceWidth,
    fontSize: deviceWidth / 18,
    textAlign: 'center',
    color: '#22313F',
    marginBottom: 0.05 * deviceWidth,
  },
  SignupTitle: {
    fontSize: deviceWidth / 34,
    textAlign: 'center',
    color: '#22313F',
  },
  Signup: {
    marginTop: 0.01 * deviceWidth,
    fontSize: deviceWidth / 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  inputBox: {
    width: 0.8 * deviceWidth,
    backgroundColor: '#ffffff',
    borderRadius: 1 / 2 * 0.8 * deviceWidth,
    paddingHorizontal: 16,
    fontSize: deviceWidth / 20,
    height: 0.08 * deviceWidth,
    color: '#22313F',
    marginVertical: 10,
    justifyContent: 'center'
  },
  button: {
    width: 0.8 * deviceWidth,
    backgroundColor: '#2d4052',
    borderRadius: 1 / 2 * 0.15 * deviceWidth,
    marginVertical: 10,
    height: 0.15 * deviceWidth,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: deviceWidth / 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center'
  }
});


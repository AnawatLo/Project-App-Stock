import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';

import _Login from './component/Login';
import _Menu from './component/Menu';
import _Dashboard from './component/Dashboard';
import _MyProduct from './component/MyProduct';
import _MyProductStu from './component/MyProductStu';
import _MyProductPro from './component/MyProductprofessor';
import _ScanStockIn from './component/Scan_StockIn';
import _StockIn from './component/StockIn';
import _ScanStockOut from './component/Scan_StockOut';
import _StockOut from './component/StockOut';
import _ScanFindStock from './component/Scan_FindStock';
import _FindStock from './component/FindStock';
import _Activity from './component/Activity';
import _AddPro from './component/AddProduct';
import _ListTran from './component/ListTransaction';

const Application = StackNavigator({
  Login: { screen: _Login },
  Menu: { screen: _Menu },
  Menu1: { screen: _Dashboard },
  Menu2: { screen: _MyProduct },
  AddPro: { screen: _AddPro },
  Menu3: { screen: _ScanStockIn },
  StockIn: { screen: _StockIn },
  Menu4: { screen: _ScanStockOut },
  StockOut: { screen: _StockOut },
  Menu5: { screen: _ScanFindStock },
  FindStock: { screen: _FindStock },
  Menu6: { screen: _Activity },
  ListTran: { screen: _ListTran },
  MyProStu: { screen: _MyProductStu },
  MyProPro: { screen: _MyProductPro },
}, {
    navigationOptions: {
      gesturesEnabled: false,
      // gesturesEnabled: false, เอาไว้ปิดการเลื่อนข้ามStack
    }
  });
export default class App extends React.Component {
  constructor(props) {
    super(props)
    config = {
      apiKey: "AIzaSyAH5-dHoQxhRDaYF7diyxL-M1xRmLDQRiM",
      authDomain: "stockapplication-202917.firebaseapp.com",
      databaseURL: "https://stockapplication-202917.firebaseio.com",
      projectId: "stockapplication-202917",
      storageBucket: "stockapplication-202917.appspot.com",
      messagingSenderId: "116113221624"
    };
    firebase.initializeApp(config);
  }

  render() {

    return (
      <Application screenProps={{ db: firebase }} />
      // <Signup />
    );
  }
}


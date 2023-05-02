import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import AppNavigator from "navigations/AppNavigator";

const App = props => {

  return (
    <AppNavigator {...props} />
  )
}
export default App;
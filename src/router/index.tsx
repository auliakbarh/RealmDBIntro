import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StackNavigator from './StackNavigator';
import * as ScreenNames from './screenNames';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator backBehavior={'none'}>
        <Tab.Screen name={ScreenNames.TAB_NAME.home} options={{title: 'Home'}}>
          {props => (
            <StackNavigator
              {...props}
              initialRouteName={ScreenNames.STACK_NAME.home}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name={ScreenNames.TAB_NAME.about}
          options={{title: 'About'}}>
          {props => (
            <StackNavigator
              {...props}
              initialRouteName={ScreenNames.STACK_NAME.about}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

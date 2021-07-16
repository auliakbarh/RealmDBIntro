import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import * as ScreenNames from './screenNames';
import {HomeContainer, UserListContainer} from 'screens';

const Stack = createStackNavigator();

interface Props {
  initialRouteName: string;
}

const options: StackNavigationOptions = {
  title: 'Simple Project',
};

const StackNavigator: React.FC<Props> = ({initialRouteName}) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={options}>
      <Stack.Screen
        name={ScreenNames.STACK_NAME.home}
        component={HomeContainer}
      />
      <Stack.Screen
        name={ScreenNames.STACK_NAME.userList}
        component={UserListContainer}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

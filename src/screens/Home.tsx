import React from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';

interface Props {}

const HomeContainer: React.FC<Props> = ({}) => {
  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.screen]}>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#e7e7e7',
    padding: 16,
  },
});

export default HomeContainer;

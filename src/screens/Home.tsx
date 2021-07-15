import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {Button} from '@/components';
import DB from '@/services';
import {UsersSchemeName} from '@/models';
import MockData from '@/assets/json';
import {UsersType} from '@/models';

interface Props {}

const HomeContainer: React.FC<Props> = ({}) => {
  const setDB = async () => {
    const dataUser: UsersType[] = MockData.MOCK_DATA_USER;
    const db = new DB();
    const result = await db.bulkInsert({
      name: UsersSchemeName,
      data: dataUser,
      primaryKey: 'id',
    });

    console.log(result.data?.length);
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.screen]}>
      <Button
        label={'Set Database'}
        onPress={setDB}
        style={[styles.marginB16]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#e7e7e7',
    padding: 16,
  },
  marginB16: {
    marginBottom: 16,
  },
});

export default HomeContainer;

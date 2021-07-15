import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, Text, FlatList} from 'react-native';
import {Button} from '@/components';
import DB from '@/services';
import {UsersSchemeName, CustomersSchemeName} from '@/models';
import MockData from '@/assets/json';
import {UsersType, CustomersType} from '@/models';

interface Props {}

const HomeContainer: React.FC<Props> = ({}) => {
  const db = new DB();
  const [action, setAction] = useState<'show' | 'hide'>('show');
  const [schemeNames, setSchemeNames] = useState<string[]>([]);
  const [databaseSize, setdatabaseSize] = useState<{[key: string]: number}>({});
  const [disableButton, setDisableButton] = useState({
    user: false,
    customer: false,
  });
  const handlerDisable = (key: string, value: boolean) => {
    setDisableButton(prevState => ({...prevState, [key]: value}));
  };

  const setDB = async (data: any[], name: string) => {
    const result = await db.bulkInsert({
      name,
      data,
    });
    if (result.error) {
      console.log(result.message);
    } else {
      console.log(result.data?.length);
    }
    await getSizeDB();
    return result;
  };

  const setDBUser = async () => {
    handlerDisable('user', true);
    setTimeout(async () => {
      const data: UsersType[] = MockData.MOCK_DATA_USER;
      await setDB(data, UsersSchemeName).then(() =>
        handlerDisable('user', false),
      );
    }, 100);
  };

  const setDBCustomer = async () => {
    handlerDisable('customer', true);
    setTimeout(async () => {
      const data: CustomersType[] = MockData.MOCK_DATA_CUSTOMER;
      await setDB(data, CustomersSchemeName).then(async () =>
        handlerDisable('customer', false),
      );
    }, 100);
  };

  const truncateDB = async () => {
    const result = await db.truncateAll();
    console.log(JSON.stringify(result, null, 2));
    await getSizeDB();
  };

  const showSchemeNames = () => {
    switch (action) {
      case 'show':
        setAction('hide');
        setSchemeNames(db.allSchemeNames());
        break;
      case 'hide':
        setAction('show');
        setSchemeNames([]);
        break;
      default:
        break;
    }
  };

  const getSizeDB = async () => {
    const result = await db.getSize();
    if (!result.error) {
      const data = result.data as {
        [ket: string]: number;
      };
      setdatabaseSize(data);
      setAction('hide');
      setSchemeNames(db.allSchemeNames());
    }
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.screen]}>
      <Button
        label={'Set Database User'}
        onPress={setDBUser}
        style={[styles.marginB16]}
        disabled={disableButton.user}
      />
      <Button
        label={'Set Database Customer'}
        onPress={setDBCustomer}
        style={[styles.marginB16]}
        disabled={disableButton.customer}
      />
      <Button
        label={'Truncate Database'}
        onPress={truncateDB}
        style={[styles.marginB16]}
      />
      <Button
        label={`${action === 'show' ? 'Show' : 'Hide'} Scheme Names`}
        onPress={showSchemeNames}
        style={[styles.marginB16]}
      />
      <FlatList
        data={schemeNames}
        contentContainerStyle={
          schemeNames.length > 0 ? styles.containerSchemeNames : {}
        }
        keyExtractor={item => item}
        renderItem={({item, index}) => (
          <Text>
            {`${index + 1}. ${item} `}
            {databaseSize[item] ? `: ${databaseSize[item]} data` : ': 0 data'}
          </Text>
        )}
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
  containerSchemeNames: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#788399',
  },
});

export default HomeContainer;

/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Button, TextInput} from '@/components';
import {CustomersService} from '@/services';
import {CustomersType} from '@/models';
import {CollectionChangeCallback, Object} from 'realm';
import {useNavigation} from '@react-navigation/native';

interface Props {}

const CustomerListContainer: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const customersService = new CustomersService();

  const deleteAll = async () => {
    await customersService.deleteAllData();
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Customer List',
      headerRight: () => (
        <TouchableOpacity style={styles.deleteAllContainer} onPress={deleteAll}>
          <Text>Delete All</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const [disabledButton, setDisabledButton] = useState({
    setData: false,
  });
  const handlerDisabledButton = (key: string, value: boolean) => {
    setDisabledButton(prevState => ({...prevState, [key]: value}));
  };
  const [action, setAction] = useState<'insert' | 'update' | 'delete'>(
    'insert',
  );
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [customerName, setCustomerName] = useState<string>('');

  const [data, setData] = useState<CustomersType[]>([]);
  const getCustomerObject = () => {
    const result = customersService.loadAllData() as CustomersType[];
    setData(result);
  };

  const setDataUsers = async () => {
    handlerDisabledButton('setData', true);
    await customersService.setDataCustomers();
  };

  useEffect(() => {
    const customers = customersService.obj();
    const listener: CollectionChangeCallback<Object> = (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      customerCollection,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      changes,
    ) => {
      getCustomerObject();
      handlerDisabledButton('setData', false);

      /*
      changes.insertions.forEach(index => {
        let insertedTasks = customerCollection[index];
        console.log(
          `insertedCustomer: ${JSON.stringify(insertedTasks, null, 2)}`,
        );
      });
      changes.deletions.forEach(index => {
        let deletedTasks = customerCollection[index];
        console.log(
          `A task was deleted at the ${index} index: \n${JSON.stringify(
            deletedTasks,
            null,
            2,
          )}`,
        );
      });
      changes.newModifications.forEach(index => {
        let modifiedTask = customerCollection[index];
        console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`);
      });
      */
    };
    customers.addListener(listener);
    return () => {
      console.log('remove all customers listener');
      customers.removeAllListeners();
    };
  }, []);

  const [selectedList, setSelectedList] = useState<string | undefined>(
    undefined,
  );

  const renderItem = ({item}: {item: CustomersType}) => {
    return (
      <TouchableOpacity
        style={[
          styles.userList,
          selectedList === item._id && styles.selectedUserList,
        ]}
        onPress={() => setSelectedList(item._id)}>
        <Text style={styles.label}>{`${item.name} ${
          item.phone ? item.phone : ''
        }`}</Text>
      </TouchableOpacity>
    );
  };

  const insert = () => {
    if (customerName.length > 0) {
      customersService.insert(customerName);
    }
  };

  const deleteItem = () => {
    if (selectedList !== undefined) {
      customersService.deleteById(selectedList);
    }
  };

  const update = () => {
    if (selectedList !== undefined && customerName.length > 0) {
      customersService.update(selectedList, customerName);
    }
  };

  const sort = () => {
    switch (sortBy) {
      case 'desc':
        return customersService.sortByName('DESC');
      case 'asc':
      default:
        return customersService.sortByName('ASC');
    }
  };

  const handleSort = () => {
    const result = sort();
    // @ts-ignore
    setData(result);
  };

  useEffect(() => {
    handleSort();
  }, [sortBy]);

  const run = () => {
    switch (action) {
      case 'insert':
        insert();
        break;
      case 'update':
        update();
        break;
      case 'delete':
        deleteItem();
        break;
      default:
        break;
    }
    setSelectedList(undefined);
    setCustomerName('');
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.screen]}>
      <Button
        label={'Set Data'}
        style={styles.marginB16}
        onPress={setDataUsers}
        disabled={disabledButton.setData}
      />
      <View>
        <Text style={styles.marginB16}>Sort By:</Text>
        <View style={[styles.rowSpaceEven, styles.marginB16]}>
          <Button
            label={'Ascending'}
            disabled={sortBy === 'asc'}
            useDisabledStyle={false}
            style={[
              styles.actionButton,
              sortBy === 'asc' && styles.actionButtonActive,
            ]}
            onPress={() => setSortBy('asc')}
          />
          <View style={styles.separatorHorizontal} />
          <Button
            label={'Descending'}
            disabled={sortBy === 'desc'}
            useDisabledStyle={false}
            style={[
              styles.actionButton,
              sortBy === 'desc' && styles.actionButtonActive,
            ]}
            onPress={() => setSortBy('desc')}
          />
        </View>
        <Text style={styles.marginB16}>Modify:</Text>
        <View style={[styles.rowSpaceEven, styles.marginB16]}>
          <Button
            label={'Insert'}
            style={[
              styles.actionButton,
              action === 'insert' && styles.actionButtonActive,
            ]}
            onPress={() => setAction('insert')}
          />
          <View style={styles.separatorHorizontal} />
          <Button
            label={'Update'}
            style={[
              styles.actionButton,
              action === 'update' && styles.actionButtonActive,
            ]}
            onPress={() => setAction('update')}
          />
          <View style={styles.separatorHorizontal} />
          <Button
            label={'Delete'}
            style={[
              styles.actionButton,
              action === 'delete' && styles.actionButtonActive,
            ]}
            onPress={() => setAction('delete')}
          />
        </View>
        <View style={[styles.row, styles.marginB16]}>
          <TextInput
            style={styles.textInput}
            onChangeText={setCustomerName}
            value={customerName}
          />
          <View style={styles.separatorHorizontal} />
          <Button label={'Run'} style={styles.buttonRun} onPress={run} />
        </View>
      </View>
      <Text style={styles.marginB16}>Total: {data.length}</Text>
      <FlatList
        data={data}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        removeClippedSubviews={false}
        onEndReachedThreshold={0.1}
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
  userList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  selectedUserList: {
    backgroundColor: '#4b92f8',
    borderRadius: 8,
    padding: 16,
    borderColor: '#003e9a',
    borderWidth: 1,
  },
  label: {
    color: '#2f2f2f',
    fontWeight: 'bold',
  },
  separator: {
    height: 8,
  },
  deleteAllContainer: {
    marginHorizontal: 16,
  },
  rowSpaceEven: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#8cb8fd',
  },
  actionButtonActive: {
    backgroundColor: '#2e5dea',
  },
  separatorHorizontal: {
    width: 8,
  },
  textInput: {
    flex: 5,
  },
  buttonRun: {
    flex: 1,
  },
});

export default CustomerListContainer;

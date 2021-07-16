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
import {UsersService} from '@/services';
import {UsersType} from '@/models';
import {CollectionChangeCallback, Object} from 'realm';
import {useNavigation} from '@react-navigation/native';

interface Props {}

const UserListContainer: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const usersService = new UsersService();

  const deleteAll = async () => {
    await usersService.deleteAllData();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.deleteAllContainer} onPress={deleteAll}>
          <Text>Delete All</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const [action, setAction] = useState<'insert' | 'update' | 'delete'>(
    'insert',
  );
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [firstName, setFirstName] = useState<string>('');

  const [data, setData] = useState<UsersType[]>([]);
  const getUserObject = () => {
    const result = usersService.loadAllData() as UsersType[];
    setData(result);
  };

  const setDataUsers = async () => {
    await usersService.setDataUsers();
  };

  useEffect(() => {
    const users = usersService.obj();
    const listener: CollectionChangeCallback<Object> = (
      usersCollection,
      changes,
    ) => {
      console.log('listening users');
      getUserObject();

      changes.insertions.forEach(index => {
        let insertedTasks = usersCollection[index];
        console.log(`insertedUser: ${JSON.stringify(insertedTasks, null, 2)}`);
      });

      changes.deletions.forEach(index => {
        let deletedTasks = usersCollection[index];
        // Deleted objects cannot be accessed directly,
        // but we can update a UI list, etc. knowing the index.
        console.log(
          `A task was deleted at the ${index} index: \n${JSON.stringify(
            deletedTasks,
            null,
            2,
          )}`,
        );
      });

      changes.newModifications.forEach(index => {
        let modifiedTask = usersCollection[index];
        console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`);
      });
    };
    users.addListener(listener);
    return () => {
      console.log('remove all users listener');
      users.removeAllListeners();
    };
  }, []);

  const [selectedList, setSelectedList] = useState<number | undefined>(
    undefined,
  );

  const renderItem = ({item}: {item: UsersType}) => {
    return (
      <TouchableOpacity
        style={[
          styles.userList,
          selectedList === item.id && styles.selectedUserList,
        ]}
        onPress={() => setSelectedList(item.id)}>
        <Text style={styles.label}>{`${item.first_name} ${
          item.last_name ? item.last_name : ''
        }`}</Text>
      </TouchableOpacity>
    );
  };

  const insert = () => {
    if (firstName.length > 0) {
      usersService.insert(firstName);
    }
  };

  const deleteItem = () => {
    if (selectedList !== undefined) {
      usersService.deleteById(selectedList);
    }
  };

  const update = () => {
    if (selectedList !== undefined && firstName.length > 0) {
      usersService.update(selectedList, firstName);
    }
  };

  const sort = () => {
    switch (sortBy) {
      case 'desc':
        return usersService.sortByFirstName('DESC');
      case 'asc':
      default:
        return usersService.sortByFirstName('ASC');
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
    setFirstName('');
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.screen]}>
      <Button
        label={'Set Data'}
        style={styles.marginB16}
        onPress={setDataUsers}
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
            onChangeText={setFirstName}
            value={firstName}
          />
          <View style={styles.separatorHorizontal} />
          <Button label={'Run'} style={styles.buttonRun} onPress={run} />
        </View>
      </View>
      <FlatList
        data={data}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={item => item.id.toString()}
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

export default UserListContainer;

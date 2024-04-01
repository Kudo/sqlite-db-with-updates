import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite/next';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [row, setRow] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    queryDatabaseAsync()
      .then((row) => setRow(JSON.stringify(row, null, 2)))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text>{row}</Text>
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <StatusBar style="auto" />
    </View>
  );
}

async function queryDatabaseAsync(): Promise<Record<string, any>> {
  const localDbPath = FileSystem.documentDirectory + 'SQLite/myDatabaseName.db';

  if (!(await FileSystem.getInfoAsync(localDbPath)).exists) {
    if (
      !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite'))
        .exists
    ) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + 'SQLite'
      );
    }
    const assetDb = require('./assets/myDatabaseName.db');
    const asset = Asset.fromModule(assetDb);
    if (!asset.uri) {
      throw new Error(`Invalid asset: ${JSON.stringify(asset)}`);
    }
    await FileSystem.downloadAsync(
      Asset.fromModule(assetDb).uri,
      FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
    );
  }

  const db = await SQLite.openDatabaseAsync('myDatabaseName.db');
  return await db.getFirstAsync<any>('SELECT * FROM test');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

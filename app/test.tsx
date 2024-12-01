import {Link} from 'expo-router';
import {StyleSheet} from 'react-native';

import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {getItems} from "@/app/utils/SecureStoreChain";
import {useEffect, useState} from "react";


async function GetKey() {
  return await getItems('itemKey'); // Assuming getItems is defined and working.
}

export default function Test() {
  const [keyValue, setKeyValue] = useState<string|null>(null);

  useEffect(() => {
    // Fetch the key value when the component mounts
    async function fetchKey() {
      const value = await GetKey();
      setKeyValue(value); // Store the resolved value in state
    }

    fetchKey();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">test.</ThemedText>
        <Link href="/indexes" style={styles.link}>
          {/* Display the token from localStorage */}
          <ThemedText type="link">{localStorage.getItem('thisistoken')}!</ThemedText>
          {/* Display the resolved keyValue */}
          <ThemedText type="link">{keyValue || 'Loading...'}</ThemedText>
        </Link>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Teste2() {
    return (
        <View style={styles.container}>
            <Text>Teste2</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 5
    },
});

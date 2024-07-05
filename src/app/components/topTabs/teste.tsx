import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Teste1() {
    return (
        <View style={styles.container}>
            <Text>Teste 1</Text>
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
    title: {
        fontWeight: "500",
        fontSize: 22
    },
});

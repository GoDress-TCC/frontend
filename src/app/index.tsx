import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                <Text style={{ fontSize: 26, fontWeight: 700, color:"#593C9D" }}>Teste de integração</Text>
                <Text>backend - frontend</Text>
            </View>
            <View style={styles.subcontainer}>
                <Link href={"/auth/login"} style={styles.button}>Login</Link>
                <Link href={"/auth/register"} style={styles.button}>Registro</Link>
            </View>
            <Text style={{ color: "grey", fontSize: 10 }}>powered by GoDress</Text> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 40,
        paddingHorizontal: 20
    },
    subcontainer: {
        alignItems: "center", 
        width: "100%",
        gap: 10
    },
    button: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        color: "#fff",
        fontWeight: 500,
        width: "100%",
        textAlign: "center"
    }
});

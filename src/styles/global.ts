import { StyleSheet } from "react-native";
import Fonts from "../services/utils/Fonts";
import fonts from "../services/fonts";



export const globalColors = {
    primary: "#593C9D",
    secundary: "#F8F7F4",
    black: "#000",
    white: "#fff",
    dirtyGreen: "rgba(11, 156, 49, 0.5)"
};

export const globalStyles = StyleSheet.create({
    globalContainer: {
        backgroundColor: globalColors.secundary,
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 20,
    },

    globalContainerForLists: {
        backgroundColor: globalColors.secundary,
        flex: 1,
        paddingTop: 50,
    },

    mainTitle: {
        fontFamily: Fonts['montserrat-extrabold'],
        fontSize: 22,
    },

    subTitle: {
        fontFamily: Fonts['montserrat-bold'],
        fontSize: 18,
    },

    styledContainer: {
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 10,
        flexDirection: "column",
        gap: 5,
        alignItems: "center",
        borderColor: globalColors.primary,
        borderLeftWidth: 8,
        borderBottomWidth: 8,
        borderWidth: 1
    },

    
    tinyStyledContainer: {
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 10,
        flexDirection: "column",
        gap: 5,
        alignItems: "center",
        borderColor: globalColors.primary,
        borderBottomWidth: 5,
        borderWidth: 1
    },

    button: {
        backgroundColor: globalColors.primary,
        fontFamily: fonts['montserrat-black'],
        fontSize: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },

    message: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center" 
    },

    flatListContainer: {
        flex: 1,
        marginTop: 20
    }

});

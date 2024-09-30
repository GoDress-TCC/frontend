import { StyleSheet } from "react-native";
import Fonts from "../services/utils/Fonts";
import fonts from "../services/fonts";



export const globalColors = {
    primary:"#593C9D",
    secundary:"#F8F7F4",
    black:"#000",
    white:"#fff",
};

export const globalStyles = StyleSheet.create({
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
      },

    button:{
        backgroundColor:globalColors.primary,
        fontFamily:fonts['montserrat-black'],
        fontSize:13,
        justifyContent:'center',
        alignItems:'center', 
    },

});
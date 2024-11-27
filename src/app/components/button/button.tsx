import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native'
import React from 'react'
import { globalColors } from '@/src/styles/global'
import Fonts from '@/src/services/utils/Fonts'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesome5 } from '@expo/vector-icons';

interface ButtonProps {
    onPress?: () => void;
    title?: string;
    loading?: boolean;
    disabled?: boolean;
    color?: string;
    colorTitle?: string;
    icon?: string;
    borderButton?: boolean;
}

const MyButton: React.FC<ButtonProps> = ({ onPress, title, loading, disabled, color, colorTitle, icon, borderButton }) => {

    return (

        <TouchableOpacity style={[
            !borderButton && !disabled &&
            {
                backgroundColor: color !== undefined ? color : globalColors.primary,
            },
            disabled &&
            {
                backgroundColor: "grey",
            },
            {
                borderRadius: 10,
                paddingVertical: 15,
                width: "100%",
                alignItems: "center",
            },
            borderButton && {
                borderWidth: 2  ,
                borderColor: color !== undefined ? color : globalColors.primary,
            }
        ]}
            onPress={onPress}
            disabled={disabled}
        >
            {loading === true ?
                <ActivityIndicator size="small" color="#fff" />
                :
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {icon !== undefined &&
                        <FontAwesome5 name={icon} size={24} color={colorTitle !== undefined ? colorTitle : borderButton ? globalColors.primary : "#fff"} />
                    }
                    <Text style={{ color: colorTitle !== undefined ? colorTitle : borderButton ? globalColors.primary : "#fff", fontFamily: Fonts['montserrat-black'], }}>{title}</Text>
                </View>
            }
        </TouchableOpacity>
    )
}

export default MyButton;

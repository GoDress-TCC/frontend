import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { globalColors } from '@/src/styles/global'
import Fonts from '@/src/services/utils/Fonts'
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface ButtonProps {
    onPress?: () => void;
    title?: string;
    loading?: boolean;
    disabled?: boolean;
    color?: string;
    colorTitle?: string;

}

const MyButton: React.FC<ButtonProps> = ({ onPress, title, loading, disabled, color,colorTitle  }) => {

    return (

        <TouchableOpacity style={{
            backgroundColor: color !== undefined ? color : globalColors.primary,
            borderRadius: 10,
            paddingVertical: 15,
            width: "100%",
            alignItems: "center",
        }}
            onPress={onPress}
            disabled={disabled}
        >
            {loading === true ? 
                <ActivityIndicator size="small" color="#fff" /> 
                : 
                <Text style={{ color: colorTitle !== undefined ? colorTitle: globalColors.white , fontFamily: Fonts['montserrat-black'], }}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

export default MyButton;

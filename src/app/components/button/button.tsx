import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { globalColors } from '@/src/styles/global'
import Fonts from '@/src/services/utils/Fonts'

interface ButtonProps {
    onPress?: () => void;
    title?: string;
    loading?: boolean;
    disabled?: boolean;
    type?: string;
}

const MyButton: React.FC<ButtonProps> = ({ onPress, title, loading, disabled, type }) => {

    return (

        <TouchableOpacity style={{
            backgroundColor: type === "cancel" ? "gray" : globalColors.primary,
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
                <Text style={{ color: '#fff', fontFamily: Fonts['montserrat-black'], }}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

export default MyButton;

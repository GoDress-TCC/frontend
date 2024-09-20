import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { globalStyles } from '@/src/styles/global'
import { Clothing } from '@/src/services/types/types'
import Fonts from '@/src/services/utils/Fonts'

interface ButtonProps {
    onPress?: () => void;
    title: string;
    loading?: boolean;
    disabled?: boolean
}

export const MyButton: React.FC<ButtonProps> = ({ onPress, title, loading, disabled }) => {

    return (

        <TouchableOpacity style={{
            backgroundColor: "#593C9D",
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


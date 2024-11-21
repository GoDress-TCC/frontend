import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { globalColors, globalStyles } from '@/src/styles/global'
import { router } from 'expo-router'

interface mainHeaderProps {
    title: string;
    backButton?: boolean;
}

const MainHeader: React.FC<mainHeaderProps> = ({ title, backButton }) => {
    return (
        <View style={{ flexDirection: "row", gap: 10 }}>
            {backButton &&
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='chevron-back' size={30} color={globalColors.primary} />
                </TouchableOpacity>
            }
            <Text style={globalStyles.mainTitle}>{title}</Text>
        </View>
    )
}

export default MainHeader;
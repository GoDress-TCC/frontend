import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { globalColors, globalStyles } from '@/src/styles/global'
import MyButton from '../button/button'
import Fonts from '@/src/services/utils/Fonts'

const { width } = Dimensions.get('window')

interface mainHeaderProps {
    title?: string;
    backButton?: boolean;
    functionButtonTitle?: string;
    functionButtonIcon?: keyof typeof FontAwesome5.glyphMap;
    functionButtonOnPress?: () => void;
}

const MainHeader: React.FC<mainHeaderProps> = ({ title, backButton, functionButtonTitle, functionButtonOnPress, functionButtonIcon }) => {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
                {backButton &&
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='chevron-back' size={30} color={globalColors.primary} />
                    </TouchableOpacity>
                }
                <Text style={globalStyles.mainTitle}>{title}</Text>
            </View>

            {functionButtonTitle &&
                <TouchableOpacity style={{
                    backgroundColor: globalColors.primary,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 5
                }}
                    onPress={functionButtonOnPress}
                >
                    {functionButtonIcon &&
                        <FontAwesome5 name={functionButtonIcon} size={16} color={globalColors.white} />
                    }
                    <Text style={{ color: globalColors.white, fontFamily: Fonts['montserrat-black'], }}>{functionButtonTitle}</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

export default MainHeader;
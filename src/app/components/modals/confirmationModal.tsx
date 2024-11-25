import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import ModalScreen from './modalScreen';
import { globalStyles } from '@/src/styles/global';
import MyButton from '../button/button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: () => void;
    title: string;
    buttonTitle: string;
    color?: string;
    description?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onRequestClose, 
    onSubmit, 
    title, 
    color, 
    description, 
    buttonTitle 
}) => {
    const backgroundOpacity = useRef(new Animated.Value(0)).current;
    const [isVisible, setIsVisible] = React.useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            Animated.timing(backgroundOpacity, {
                toValue: 0.4,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(backgroundOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start(() => {
                setIsVisible(false); 
            });
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <ModalScreen isOpen={isVisible} onRequestClose={onRequestClose}>
            <Pressable onPress={onRequestClose} style={{ height: "100%", width: "100%" }}>
                <Animated.View 
                    style={{ 
                        backgroundColor: 'black', 
                        opacity: backgroundOpacity, 
                        position: 'absolute', 
                        width: '100%', 
                        height: '100%' 
                    }} 
                />
                <View 
                    style={{ 
                        backgroundColor: "#fff", 
                        width: "100%", 
                        height: "25%", 
                        borderTopLeftRadius: 30, 
                        borderTopRightRadius: 30, 
                        paddingVertical: 20, 
                        paddingHorizontal: 16, 
                        position: 'absolute', 
                        bottom: 0, 
                        alignItems: 'center' 
                    }}
                >
                    <View style={{ alignItems: "center", marginBottom: 30, gap: 5 }}>
                        <Text style={globalStyles.mainTitle}>{title}</Text>
                        <Text>{description}</Text>
                    </View>

                    <View style={{ gap: 10, flex: 1, justifyContent: 'flex-end', width: '100%' }}>
                        <MyButton color={color} title={buttonTitle} onPress={onSubmit} />
                        <MyButton color="gray" title="Cancelar" onPress={onRequestClose} />
                    </View>
                </View>
            </Pressable>
        </ModalScreen>
    );
};

export default ConfirmationModal;

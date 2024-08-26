import { KeyboardAvoidingView, Modal as RNModal, ModalProps, View, StyleSheet } from "react-native"

type PROPS = ModalProps & {
    isOpen: boolean;
    withInput?: boolean;
}

export default function ModalScreen({ isOpen, withInput, children, ...rest }: PROPS) {
    const content = withInput ? (
        <KeyboardAvoidingView style={styles.modal} behavior="padding">{children}</KeyboardAvoidingView>
    ) : (
        <View style={styles.modal}>{children}</View>
    )

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="slide"
            statusBarTranslucent
            {...rest}
        >
            {content}
        </RNModal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
})

import { KeyboardAvoidingView, Modal as RNModal, ModalProps, View, StyleSheet } from "react-native"

type PROPS = ModalProps & {
    isOpen: boolean;
    withInput?: boolean;
}

export default function Modal({ isOpen, withInput, children, ...rest }: PROPS) {
    const content = withInput ? (
        <KeyboardAvoidingView style={styles.modal} behavior="padding">{children}</KeyboardAvoidingView>
    ) : (
        <View style={styles.modal}>{children}</View>
    )

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="fade"
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.22)",
    },
})

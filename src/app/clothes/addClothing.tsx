import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraView, FlashMode } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import ColorThief from 'color-thief-ts';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';;
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { STORAGE } from '@/src/services/firebase/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Category } from '@/src/services/types/types';
import { useCats } from '@/src/services/contexts/catsContext';
import { useUser } from '@/src/services/contexts/userContext';
import { clothingGender, clothingKind, clothingStyle, clothingTemperature, clothingTissue } from '@/src/services/local-data/dropDownData';
import { useClothes } from '@/src/services/contexts/clothesContext';
import Api from '@/src/services/api';

import ModalScreen from '../components/modals/modalScreen';

type FormData = {
    catId?: string;
    image?: string;
    kind: string;
    type: string;
    color: string;
    style: string;
    temperature: string;
    gender?: string;
    tissue?: string;
    fav?: boolean
};

const saveClothingSchema = yup.object({
    catId: yup.string().optional(),
    image: yup.string().optional(),
    kind: yup.string().required("Tipo é obrigatório"),
    type: yup.string().required("Type é obrigatório"),
    color: yup.string().required("Cor é obrigatória"),
    style: yup.string().required("Estilo é obrigatória"),
    temperature: yup.string().required("Temperatura é obrigatória"),
    gender: yup.string().optional(),
    tissue: yup.string().optional(),
    fav: yup.boolean().optional()
}).required();

export default function CameraScreen() {
    // Permissions
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
    const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean>(false);

    // photo
    const [image, setImage] = useState<string | undefined>();
    const [flash, setFlash] = useState<FlashMode>('off');

    // saveClothingScreen
    const [saveClothingScreenOpen, setSaveClothingScreenOpen] = useState<boolean>(false);
    const [moreOptions, setMoreOptions] = useState<boolean>(false);
    const [color, setColor] = useState<string>("");

    // contexts
    const { cats, getCats } = useCats();
    const { getClothes } = useClothes();
    const { user, getUser } = useUser();

    // Camera
    const cameraRef = useRef<CameraView>(null);

    const form = useForm<FormData>({
        defaultValues: {
            catId: "",
            image: "",
            kind: "",
            type: "",
            color: "",
            style: "",
            temperature: "",
            gender: "",
            tissue: "",
            fav: false
        },
        resolver: yupResolver(saveClothingSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset, watch, setValue } = form;

    const favoriteValue = watch('fav');

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');

            getCats();
            getUser();
            setValue('gender', user?.gender);
        })();
    }, []);

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                <Text><Text style={{ color: "red" }}>Sem acesso à câmera ou galeria</Text>. Para este recurso, altorize a GoDress nas configurações de seu smartphone.</Text>
            </View>
        )
    }

    const takePicture = async () => {
        if (cameraRef) {
            try {                
                const data = await cameraRef.current?.takePictureAsync();
                const colorThief = new ColorThief();
                
                console.log(data);
                setImage(data?.uri);
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const uploadImage = async (uri: string, removed: boolean): Promise<string | undefined> => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(STORAGE, removed === false ? `removebg/${Date.now()}` : `images/${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, blob);

        return await getDownloadURL(snapshot.ref);
    };

    const removeImageBackground = async (): Promise<string | null> => {
        if (image) {
            const uploadedImageUrl = await uploadImage(image, false);

            if (uploadedImageUrl) {
                try {
                    const response = await Api.post('/clothing/remove_background', { image: uploadedImageUrl });
                    console.log(response.data.message);
                    return response.data.imageUrl;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            }
        }

        return null;
    };

    const onSubmitCreateClothing: SubmitHandler<FormData> = async (data) => {
        const processedImage = await removeImageBackground();
        console.log(processedImage);

        if (image) {
            if (processedImage !== null && processedImage !== undefined) {
                data.image = processedImage;
            }
            else {
                const uploadedImageUrl = await uploadImage(image, true);
                alert("RemoveBG sem créditos.");
                data.image = uploadedImageUrl;
            }
        }

        if (!data.catId) { delete data.catId };

        await Api.post('/clothing', data)
            .then(response => {
                console.log(response.data);
                reset();
                getClothes();
                router.back();
            })
            .catch(error => {
                console.log(error.response.data)
            })

    };


    return (
        <View style={styles.container}>
            {!image ?
                <CameraView style={{ flex: 1 }} facing='back' flash={flash} ref={cameraRef}>
                    <View style={styles.cameraContainer}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cameraButton} onPress={router.back}>
                                <FontAwesome5 name="arrow-left" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <View style={[styles.buttonContainer, { justifyContent: "center" }]}>
                                <TouchableOpacity style={[styles.cameraButton, { position: "absolute", left: 1 }]} onPress={pickImage}>
                                    <MaterialIcons name='add-photo-alternate' size={20} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={takePicture}>
                                    <MaterialIcons name="motion-photos-on" size={70} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.cameraButton, { position: "absolute", right: 1 }]}
                                    onPress={() => { setFlash(flash === 'off' ? 'on' : 'off'); }}>

                                    <MaterialIcons name={flash === "on" ? "flash-on" : "flash-off"} size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </CameraView>
                :
                <View style={styles.container}>
                    <ImageBackground source={{ uri: image }} style={{ flex: 1 }} resizeMode='cover'>
                        <View style={[styles.cameraContainer, { justifyContent: 'flex-end' }]}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.textCameraButton} onPress={() => [setImage(""), reset(), setColor("")]}>
                                    <FontAwesome6 name="repeat" size={28} color="white" />
                                    <Text style={styles.buttonText}>Alterar foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.textCameraButton} onPress={() => setSaveClothingScreenOpen(true)}>
                                    <FontAwesome5 name="check" size={28} color="white" />
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View >
            }
            <ModalScreen isOpen={saveClothingScreenOpen} withInput={true} onRequestClose={() => { setSaveClothingScreenOpen(false) }}>
                <View style={styles.modalScreenContent}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", marginHorizontal: 20 }}>
                        <TouchableOpacity onPress={() => { setSaveClothingScreenOpen(false) }} style={{ position: "absolute", left: 20 }}>
                            <FontAwesome5 name="arrow-left" size={18} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 18, fontWeight: "500" }}>Salvar peça de roupa</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1, width: "100%", paddingHorizontal: 20 }}>
                        <View style={{ width: "100%", height: 450, marginTop: 10, borderRadius: 10, overflow: 'hidden' }}>
                            <ImageBackground source={{ uri: image }} style={{ alignItems: "flex-end", justifyContent: "flex-end", flex: 1 }} resizeMode='stretch'>
                                <TouchableOpacity onPress={() => { setValue('fav', !favoriteValue) }}>
                                    <MaterialIcons name={favoriteValue ? 'favorite' : 'favorite-border'} size={24} color={favoriteValue ? 'red' : '#fff'} style={styles.fav} />
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                            <Controller
                                control={control}
                                name="kind"
                                render={({ field: { value, onChange } }) => (
                                    <View style={[styles.controllerContainer, { width: "40%" }]}>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                style={styles.picker}
                                                selectedValue={value}
                                                onValueChange={(itemValue) => {
                                                    onChange(itemValue);
                                                    const selectedItem = clothingKind.find(item => item.value === itemValue);
                                                    if (selectedItem) {
                                                        setValue('type', selectedItem.type);
                                                        setValue('temperature', selectedItem.temperature);
                                                    }
                                                }}
                                            >
                                                <Picker.Item label="Tipo" value="" />
                                                {clothingKind.map(item => (
                                                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                                                ))}
                                            </Picker>
                                        </View>
                                        {errors.kind && <Text style={styles.error}>{errors.kind.message}</Text>}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name="style"
                                render={({ field: { value, onChange } }) => (
                                    <View style={[styles.controllerContainer, { width: "40%" }]}>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                style={styles.picker}
                                                selectedValue={value}
                                                onValueChange={(itemValue) => onChange(itemValue)}
                                            >
                                                <Picker.Item label="Estilo" value="" />
                                                {clothingStyle.map(item => (
                                                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                                                ))}
                                            </Picker>
                                        </View>
                                        {errors.style && <Text style={styles.error}>{errors.style.message}</Text>}
                                    </View>
                                )}
                            />

                            {/* Comentário: Pegar cor automaticamente e mudar para um picker de cor com um quadrado representando a selecionada*/}

                            <Controller
                                control={control}
                                name="color"
                                render={({ field: { value, onChange } }) => (
                                    <View style={[styles.controllerContainer, { width: "16%" }]}>
                                        <TextInput
                                            style={[styles.input, { textAlign: "center", height: 70 }, color !== "" ? { borderColor: `${color}`, borderWidth: 2 } : { borderColor: "#000", borderWidth: 1 }]}
                                            onChangeText={(text) => { onChange(text), setColor(text) }}
                                            placeholder="Cor"
                                            value={value}
                                            autoCapitalize="none"
                                        />
                                        {errors.color && <Text style={styles.error}>{errors.color.message}</Text>}
                                    </View>
                                )}
                            />
                        </View>

                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }} onPress={() => { setMoreOptions(!moreOptions) }}>
                            <MaterialIcons name={moreOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={18} color={"grey"} />
                            <Text style={styles.comment}>{moreOptions ? 'Menos' : 'Mais'} opções</Text>
                        </TouchableOpacity>

                        {moreOptions === true &&
                            <View style={{ flexDirection: "column", gap: 20 }}>
                                <Controller
                                    control={control}
                                    name="temperature"
                                    render={({ field: { value, onChange } }) => (
                                        <View style={[styles.controllerContainer, { width: "100%" }]}>
                                            <View style={styles.pickerContainer}>
                                                <Picker
                                                    style={styles.picker}
                                                    selectedValue={value}
                                                    onValueChange={(itemValue) => onChange(itemValue)}
                                                >
                                                    <Picker.Item label="Temperatura " value="" />
                                                    {clothingTemperature.map(item => (
                                                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                                                    ))}
                                                </Picker>
                                            </View>
                                            {errors.temperature && <Text style={styles.error}>{errors.temperature.message}</Text>}
                                        </View>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="gender"
                                    render={({ field: { value, onChange } }) => (
                                        <View style={[styles.controllerContainer, { width: "100%" }]}>
                                            <View style={styles.pickerContainer}>
                                                <Picker
                                                    style={styles.picker}
                                                    selectedValue={value}
                                                    onValueChange={(itemValue) => onChange(itemValue)}
                                                >
                                                    <Picker.Item label="Gênero" value="" />
                                                    {clothingGender.map(item => (
                                                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                                                    ))}
                                                </Picker>
                                            </View>
                                            {errors.gender && <Text style={styles.error}>{errors.gender.message}</Text>}
                                        </View>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="tissue"
                                    render={({ field: { value, onChange } }) => (
                                        <View style={[styles.controllerContainer, { width: "100%" }]}>
                                            <View style={styles.pickerContainer}>
                                                <Picker
                                                    style={styles.picker}
                                                    selectedValue={value}
                                                    onValueChange={(itemValue) => onChange(itemValue)}
                                                >
                                                    <Picker.Item label="Tecido" value="" />
                                                    {clothingTissue.map(item => (
                                                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                                                    ))}
                                                </Picker>
                                            </View>
                                            {errors.tissue && <Text style={styles.error}>{errors.tissue.message}</Text>}
                                        </View>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="catId"
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Dropdown
                                                style={styles.input}
                                                data={cats}
                                                labelField="name"
                                                valueField="_id"
                                                placeholder="Selecione uma categoria"
                                                search
                                                searchPlaceholder='Pesquisar'
                                                value={value}
                                                onChange={(item: Category) => {
                                                    onChange(item._id);
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </View>
                        }

                    </ScrollView>

                    <View style={{ width: "100%", paddingHorizontal: 20 }}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmitCreateClothing)}>
                            <Text style={styles.submitButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ModalScreen >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraContainer: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cameraButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.22)",
        height: 60,
        width: 60,
        borderRadius: 100,
    },
    textCameraButton: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        backgroundColor: "rgba(0, 0, 0, 0.22)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "500"
    },
    modalScreenContent: {
        backgroundColor: "#fff",
        width: "100%",
        height: "95%",
        paddingTop: 40,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: "center",
        gap: 10
    },
    fav: {
        margin: 20
    },
    submitButton: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        width: "100%",
    },
    error: {
        color: 'red',
        fontSize: 10,
        fontWeight: "500",
        alignSelf: "flex-start"
    },
    comment: {
        color: "grey",
        fontWeight: "500",
        marginVertical: 10
    },
    controllerContainer: {
        flexDirection: "column",
        gap: 2,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 5,
        height: 70
    },
    picker: {
        width: "100%",
        height: "100%"
    }
});

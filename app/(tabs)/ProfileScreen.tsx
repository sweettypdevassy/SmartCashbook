import { useState, useEffect } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../config/firebaseConfig"; // Ensure you have Firebase configured
import React from 'react';
export default function ProfileScreen() {
    const auth = getAuth();
    const user = auth.currentUser;

    const [name, setName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
            setEmail(user.email || "");
            setPhotoURL(user.photoURL || null);
        }
    }, [user]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        setUploading(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `profile_pictures/${user?.uid}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            await updateProfile(user!, { photoURL: downloadURL });
            setPhotoURL(downloadURL);
            Alert.alert("Success", "Profile picture updated!");
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload image.");
        }
        setUploading(false);
    };

    const updateProfileInfo = async () => {
        if (!user) return;

        try {
            await updateProfile(user, { displayName: name });
            Alert.alert("Success", "Profile updated!");
        } catch (error) {
            console.error("Profile update error:", error);
            Alert.alert("Error", "Failed to update profile.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert("Logged Out", "You have been signed out.");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                {photoURL ? (
                    <Image source={{ uri: photoURL }} style={styles.profileImage} />
                ) : (
                    <View style={[styles.profileImage, styles.placeholder]}>
                        <Text style={styles.placeholderText}>Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
            />
            <Button title="Update Profile" onPress={updateProfileInfo} disabled={uploading} />
            <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
    placeholder: { backgroundColor: "#ddd", justifyContent: "center", alignItems: "center" },
    placeholderText: { color: "#777" },
    input: { width: "90%", borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
    disabledInput: { backgroundColor: "#f0f0f0" },
});

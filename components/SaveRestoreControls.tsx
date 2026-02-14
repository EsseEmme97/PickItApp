import { Colors } from "@/constants/Colors";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface Props {
  isEditChanged: boolean;
  onSave: () => void;
  onRestore: () => void;
}

export default function SaveRestoreControls({ isEditChanged, onSave, onRestore }: Props) {
  if (!isEditChanged) return null;

  return (
    <Animated.View entering={FadeInUp} style={styles.container}>
      <Pressable style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>Salva modifiche</Text>
      </Pressable>
      <Pressable style={styles.restoreButton} onPress={onRestore}>
        <Text style={styles.restoreText}>Ripristina</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "19%",
    right: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  saveButton: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: Colors.VERDE,
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontFamily: "Quicksand_400Regular",
  },
  restoreButton: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: Colors.GIALLO,
    justifyContent: "center",
    alignItems: "center",
  },
  restoreText: {
    color: "black",
    fontFamily: "Quicksand_400Regular",
  },
});

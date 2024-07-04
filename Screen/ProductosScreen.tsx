import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import { db } from "../Config/Config2";

export const ProductosScreen = ({ navigation }: any) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [titleColor, setTitleColor] = useState("#36BA98");

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleColor((prevColor) => (prevColor === "#36BA98" ? "white" : "#36BA98"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function writeProductData(name: string, description: string, price: string, category: string) {
    const db = getDatabase();
    set(ref(db, `products/` + name), {
      name: name,
      description: description,
      price: price,
      category: category,
    });
    Alert.alert("Mensaje", "Producto registrado");
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>Registro de Producto</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          style={styles.input}
          value={productName}
          onChangeText={(text) => setProductName(text)}
          placeholder="Introduce el nombre del producto"
        />
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={styles.input}
          value={productDescription}
          onChangeText={(text) => setProductDescription(text)}
          placeholder="Introduce la descripción del producto"
        />
        <Text style={styles.label}>Precio:</Text>
        <TextInput
          style={styles.input}
          value={productPrice}
          onChangeText={(text) => setProductPrice(text)}
          keyboardType="numeric"
          placeholder="Introduce el precio del producto"
        />
        <Text style={styles.label}>Categoría:</Text>
        <TextInput
          style={styles.input}
          value={productCategory}
          onChangeText={(text) => setProductCategory(text)}
          placeholder="Introduce la categoría del producto"
        />
        <TouchableOpacity style={styles.button} onPress={() => writeProductData(productName, productDescription, productPrice, productCategory)}>
          <Text style={styles.buttonText}>Registrar Producto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegistroAlmacen')}>
          <Text style={styles.buttonText}>Ver Productos Registrados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 16,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

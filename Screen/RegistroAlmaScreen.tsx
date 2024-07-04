import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getDatabase, onValue, ref } from "firebase/database";
import { db } from "../Config/Config2";

interface Producto {
  key: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export const RegistroAlmaScreen = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    const starCountRef = ref(db, 'products/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataTemp = Object.keys(data).map((key) => ({ key, ...data[key] }));
        setProductos(dataTemp);
      } else {
        setProductos([]);
      }
    });
  }, []);

  const toggleProducto = (key: string) => {
    if (productoSeleccionado === key) {
      setProductoSeleccionado(null);
    } else {
      setProductoSeleccionado(key);
    }
  };

  const showAlert = (producto: Producto) => {
    Alert.alert(
      'Más Información',
      `ID: ${producto.key}\nNombre: ${producto.name}\nDescripción: ${producto.description}\nPrecio: ${producto.price}\nCategoría: ${producto.category}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Registrados</Text>
      {/* Sección para mostrar detalles de un registro por ID */}
      {productoSeleccionado && (
        <View style={styles.productDetails}>
          <Text style={styles.productText}>ID: {productos.find(p => p.key === productoSeleccionado)?.key}</Text>
          <Text style={styles.productText}>Nombre: {productos.find(p => p.key === productoSeleccionado)?.name}</Text>
          <Text style={styles.productText}>Descripción: {productos.find(p => p.key === productoSeleccionado)?.description}</Text>
          <Text style={styles.productText}>Precio: {productos.find(p => p.key === productoSeleccionado)?.price}</Text>
          <Text style={styles.productText}>Categoría: {productos.find(p => p.key === productoSeleccionado)?.category}</Text>
        </View>
      )}
      
      {/* Sección para mostrar una lista con un campo específico de cada registro */}
      <View style={styles.productListContainer}>
        {productos.map((producto) => (
          <TouchableOpacity key={producto.key} onPress={() => toggleProducto(producto.key)}>
            <View style={styles.productItem}>
              <Text style={styles.productName}>{producto.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    backgroundColor: "#222", // Ejemplo de color de fondo para el contenedor principal
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff", // Color del texto del título
  },
  productListContainer: {
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 10, // Espacio horizontal dentro del contenedor de la lista de productos
  },
  productItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  productName: {
    color: "#fff", // Color del texto del nombre del producto
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productDetails: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  productText: {
    color: "#fff", // Color del texto de los productos
    marginBottom: 5, // Espacio entre cada texto de producto
  },
});

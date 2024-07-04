import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import { getDatabase, onValue, ref, update, remove } from "firebase/database";
import { db } from "../Config/Config2";

interface Producto {
  key: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export const EditarEliminarScreen = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");

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

  const editarProducto = async () => {
    if (!productoEditando) return;

    const { key, name, description, price, category } = productoEditando;
    const dbRef = ref(db, `products/${key}`);
    try {
      await update(dbRef, {
        name: nuevoNombre || name,
        description: nuevaDescripcion || description,
        price: nuevoPrecio || price,
        category: nuevaCategoria || category,
      });
      Alert.alert("Mensaje", "El producto se ha editado correctamente.");
      setProductoEditando(null); // Limpiamos el estado de edición después de editar
    } catch (error: any) {
      console.error("Error al editar el producto:", error.message || error);
    }
  };

  const confirmarEliminar = (producto: Producto) => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro de eliminar el producto '${producto.name}'?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => eliminarProducto(producto),
          style: "destructive",
        },
      ]
    );
  };

  const eliminarProducto = async (producto: Producto) => {
    const dbRef = ref(db, `products/${producto.key}`);
    try {
      await remove(dbRef);
      Alert.alert("Mensaje", "El producto se ha eliminado correctamente.");
    } catch (error: any) {
      console.error("Error al eliminar el producto:", error.message || error);
    }
  };

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setNuevoNombre(producto.name);
    setNuevaDescripcion(producto.description);
    setNuevoPrecio(producto.price);
    setNuevaCategoria(producto.category);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar y Eliminar Registros</Text>
      <View style={styles.productListContainer}>
        {productos.map((producto) => (
          <View key={producto.key} style={styles.productItem}>
            <Text style={styles.productName}>{producto.name}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleEditar(producto)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => confirmarEliminar(producto)}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal o formulario para editar */}
      {productoEditando && (
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={nuevaDescripcion}
            onChangeText={setNuevaDescripcion}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            value={nuevoPrecio}
            onChangeText={setNuevoPrecio}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoría"
            value={nuevaCategoria}
            onChangeText={setNuevaCategoria}
          />
          <TouchableOpacity style={styles.saveButton} onPress={editarProducto}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productName: {
    flex: 1,
    color: "#fff", // Color del texto del nombre del producto
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "#DC3545",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    zIndex: 999,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
});

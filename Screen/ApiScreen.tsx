import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';

const API_URL = 'https://jritsqmet.github.io/web-api/musica.json';

interface Song {
  id: string;
  title: string;
  artist: {
    name: string;
    genre: string;
    year_formed: number;
  };
  album: string;
  year: number;
  duration: string;
  media: {
    url: string;
    cover_image: string;
  };
}

export const ApiScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Song[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos');
      })
      .finally(() => setLoading(false));
  }, []);

  const showMessage = (item: Song) => {
    Alert.alert(
      item.title,
      `Artista: ${item.artist.name}\nÁlbum: ${item.album}\nAño: ${item.year}\nGénero: ${item.artist.genre}`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Canciones</Text>
      {isLoading ? (
        <Text style={styles.loadingText}>Cargando datos...</Text>
      ) : (
        <FlatList
          data={data.musica}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => showMessage(item)}>
              <Image style={styles.image} source={{ uri: item.media.cover_image }} />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.subtitleText}>{item.artist.name} - {item.album}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '90%'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
  },
});


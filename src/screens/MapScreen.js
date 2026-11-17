import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: -7.9666,
  longitude: 112.6326,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export default function MapScreen({ sharedLocation }) {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(
    sharedLocation
      ? {
          latitude: sharedLocation.coords.latitude,
          longitude: sharedLocation.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }
      : DEFAULT_REGION
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sharedLocation) {
      const target = {
        latitude: sharedLocation.coords.latitude,
        longitude: sharedLocation.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
      setRegion(target);
      if (mapRef.current) {
        mapRef.current.animateToRegion(target, 1000);
      }
    } else {
      locateUser();
    }
  }, [sharedLocation]);

  const locateUser = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const userTarget = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };
        setRegion(userTarget);
        if (mapRef.current) {
          mapRef.current.animateToRegion(userTarget, 1000);
        }
      }
    } catch (e) {
      console.log('Location error:', e);
    } finally {
      setLoading(false);
    }
  };

  const centerCamera = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 600);
    }
  };

  const handleZoom = (zoomIn) => {
    if (!mapRef.current) return;
    const factor = zoomIn ? 0.5 : 2.0;
    const newRegion = {
      ...region,
      latitudeDelta: Math.max(0.002, region.latitudeDelta * factor),
      longitudeDelta: Math.max(0.002, region.longitudeDelta * factor),
    };
    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 300);
  };

  return (
    <View style={styles.container}>
      {/* Peta Interaktif */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        onRegionChangeComplete={(r) => setRegion(r)}
        showsCompass={false}
      >
        {/* Lingkaran Akurasi User */}
        <Circle
          center={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          radius={140}
          strokeColor="rgba(37, 99, 235, 0.4)"
          strokeWidth={1.5}
          fillColor="rgba(37, 99, 235, 0.15)"
        />

        {/* Custom Marker Pin */}
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Lokasi Anda"
          description={`Lat: ${region.latitude.toFixed(4)}, Lng: ${region.longitude.toFixed(4)}`}
        >
          <View style={styles.customPinContainer}>
            <View style={styles.pinShadow} />
            <View style={styles.pinBody}>
              <View style={styles.pinInnerDot} />
            </View>
          </View>
        </Marker>
      </MapView>

      {/* Floating Card Info di Atas */}
      <View style={styles.floatingHeaderCard}>
        <View style={styles.pinIconWrapper}>
          <MaterialIcons name="location-on" size={24} color="#EF4444" />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.badgeRow}>
            <Text style={styles.cardTitle}>Lokasi Saya</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>GPS Aktif</Text>
            </View>
          </View>
          <Text style={styles.cardCoords}>
            Lat: {region.latitude.toFixed(5)}  •  Lng: {region.longitude.toFixed(5)}
          </Text>
        </View>
      </View>

      {/* Kontrol di Sisi Kanan (Thumb Zone) */}
      <View style={styles.actionControls}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={centerCamera}
          activeOpacity={0.75}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <MaterialIcons name="my-location" size={22} color="#0F172A" />
          )}
        </TouchableOpacity>

        <View style={styles.zoomControlGroup}>
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => handleZoom(true)}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => handleZoom(false)}
            activeOpacity={0.7}
          >
            <Feather name="minus" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  map: {
    width: width,
    height: '100%',
  },
  floatingHeaderCard: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  pinIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  cardCoords: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  actionControls: {
    position: 'absolute',
    right: 18,
    bottom: 30,
    alignItems: 'center',
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  zoomControlGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  zoomBtn: {
    width: 48,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  customPinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinShadow: {
    position: 'absolute',
    bottom: -2,
    width: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pinBody: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  pinInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

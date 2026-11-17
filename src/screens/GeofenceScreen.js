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
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Titik Pusat Area Kampus UMM
const KAMPUS_UMM = {
  latitude: -7.9208,
  longitude: 112.5976,
  radius: 400,
  name: 'Area Kampus UMM',
};

// Formula Haversine untuk kalkulasi jarak presisi
function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function GeofenceScreen({ sharedLocation }) {
  const mapRef = useRef(null);

  const [userCoords, setUserCoords] = useState({
    latitude: -7.9208,
    longitude: 112.5976,
  });

  const [address, setAddress] = useState('Jl. Raya Tlogomas No.246, Lowokwaru, Kota Malang');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [inGeofence, setInGeofence] = useState(true);
  const [showNotification, setShowNotification] = useState(true);

  const fetchAddress = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (results && results.length > 0) {
        const item = results[0];
        const street = item.street || item.name || 'Jl. Raya Tlogomas No.246';
        const district = item.district || item.subregion || 'Lowokwaru';
        const city = item.city || 'Kota Malang';

        setAddress(`${street}, ${district}, ${city}`);
      } else {
        setAddress('Jl. Raya Tlogomas No.246, Lowokwaru, Kota Malang');
      }
    } catch (error) {
      setAddress('Jl. Raya Tlogomas No.246, Lowokwaru, Kota Malang');
    } finally {
      setLoadingAddress(false);
    }
  };

  const evaluateGeofence = (lat, lng) => {
    const dist = calculateDistanceInMeters(
      lat,
      lng,
      KAMPUS_UMM.latitude,
      KAMPUS_UMM.longitude
    );
    const inside = dist <= KAMPUS_UMM.radius;
    setInGeofence(inside);
    if (inside) {
      setShowNotification(true);
    }
  };

  useEffect(() => {
    if (sharedLocation) {
      const lat = sharedLocation.coords.latitude;
      const lng = sharedLocation.coords.longitude;
      setUserCoords({ latitude: lat, longitude: lng });
      fetchAddress(lat, lng);
      evaluateGeofence(lat, lng);
    } else {
      fetchAddress(userCoords.latitude, userCoords.longitude);
      evaluateGeofence(userCoords.latitude, userCoords.longitude);
    }
  }, [sharedLocation]);

  const handleSimulate = (inside) => {
    const targetPos = inside
      ? { latitude: -7.9208, longitude: 112.5976 }
      : { latitude: -7.9400, longitude: 112.6100 };

    setUserCoords(targetPos);
    fetchAddress(targetPos.latitude, targetPos.longitude);
    evaluateGeofence(targetPos.latitude, targetPos.longitude);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...targetPos,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        500
      );
    }
  };

  const handleZoom = (zoomIn) => {
    if (!mapRef.current) return;
    const factor = zoomIn ? 0.5 : 2.0;
    const newRegion = {
      latitude: userCoords.latitude,
      longitude: userCoords.longitude,
      latitudeDelta: Math.max(0.002, 0.015 * factor),
      longitudeDelta: Math.max(0.002, 0.015 * factor),
    };
    mapRef.current.animateToRegion(newRegion, 300);
  };

  const centerToUser = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        500
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: -7.9208,
          longitude: 112.5976,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsCompass={false}
      >
        {/* Lingkaran Geofence Kampus UMM */}
        <Circle
          center={{
            latitude: KAMPUS_UMM.latitude,
            longitude: KAMPUS_UMM.longitude,
          }}
          radius={KAMPUS_UMM.radius}
          strokeColor="rgba(124, 58, 237, 0.85)"
          strokeWidth={2}
          lineDashPattern={[6, 6]}
          fillColor="rgba(139, 92, 246, 0.22)"
        />

        {/* Tag Label Area Kampus UMM */}
        <Marker
          coordinate={{
            latitude: KAMPUS_UMM.latitude + 0.0022,
            longitude: KAMPUS_UMM.longitude,
          }}
        >
          <View style={styles.geofenceTag}>
            <FontAwesome5 name="university" size={12} color="#7C3AED" />
            <Text style={styles.geofenceTagText}>Area Kampus UMM</Text>
          </View>
        </Marker>

        {/* Marker Posisi Pengguna */}
        <Marker
          coordinate={userCoords}
          title="Lokasi Saya"
          description={inGeofence ? 'Dalam Area Geofence' : 'Luar Area Geofence'}
        >
          <View style={styles.pinWrapper}>
            <View style={styles.pinPulse} />
            <View style={styles.pinDot} />
          </View>
        </Marker>
      </MapView>

      {/* Pill Switcher Simulasi Pengujian */}
      <View style={styles.segmentedContainer}>
        <View style={styles.segmentedBar}>
          <TouchableOpacity
            style={[styles.segmentBtn, inGeofence && styles.segmentBtnActive]}
            onPress={() => handleSimulate(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="location"
              size={14}
              color={inGeofence ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.segmentText,
                inGeofence && styles.segmentTextActive,
              ]}
            >
              Dalam Kampus
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, !inGeofence && styles.segmentBtnActive]}
            onPress={() => handleSimulate(false)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="navigate-outline"
              size={14}
              color={!inGeofence ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.segmentText,
                !inGeofence && styles.segmentTextActive,
              ]}
            >
              Luar Kampus
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Kontrol Peta Sisi Kanan (Thumb Zone) */}
      <View style={styles.actionControls}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={centerToUser}
          activeOpacity={0.75}
        >
          <MaterialIcons name="my-location" size={22} color="#0F172A" />
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

      {/* Bottom Floating Card Komprehensif (Sesuai Gambar Demo Sprint 08) */}
      <View style={styles.bottomCardGroup}>
        {/* Banner Notifikasi jika dalam Geofence */}
        {inGeofence && showNotification && (
          <View style={styles.alertBanner}>
            <View style={styles.alertIconBox}>
              <MaterialIcons name="notifications-active" size={20} color="#D97706" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Anda masuk area Kampus UMM</Text>
              <Text style={styles.alertSubtitle}>Selamat datang di area kampus.</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowNotification(false)}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Card Lengkap Sprint 08: Lokasi, Alamat, dan Status Geofence */}
        <View style={styles.comprehensiveCard}>
          {/* Baris 1: Lokasi Saya */}
          <View style={styles.infoRow}>
            <View style={[styles.miniIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <MaterialIcons name="location-on" size={18} color="#2563EB" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>Lokasi Saya</Text>
              <Text style={styles.rowSub}>
                Lat: {userCoords.latitude.toFixed(4)}, Lng: {userCoords.longitude.toFixed(4)}
              </Text>
            </View>
          </View>

          {/* Baris 2: Alamat (Reverse Geocoding) */}
          <View style={styles.infoRow}>
            <View style={[styles.miniIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <MaterialIcons name="place" size={18} color="#16A34A" />
            </View>
            <View style={styles.rowTextCol}>
              {loadingAddress ? (
                <ActivityIndicator size="small" color="#16A34A" />
              ) : (
                <Text style={styles.addressText} numberOfLines={2}>
                  {address}
                </Text>
              )}
            </View>
          </View>

          {/* Baris 3: Badge Status Geofence */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.geofenceStatusBadge,
                inGeofence ? styles.badgeInside : styles.badgeOutside,
              ]}
            >
              <FontAwesome5
                name="university"
                size={12}
                color={inGeofence ? '#7C3AED' : '#64748B'}
              />
              <Text
                style={[
                  styles.geofenceStatusText,
                  inGeofence ? styles.badgeTextInside : styles.badgeTextOutside,
                ]}
              >
                {inGeofence ? 'Dalam Area Geofence ✓' : 'Luar Area Geofence'}
              </Text>
            </View>
          </View>
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
  geofenceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  geofenceTagText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  pinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
  },
  pinDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  segmentedContainer: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  segmentedBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 4,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  actionControls: {
    position: 'absolute',
    right: 16,
    bottom: 190,
    alignItems: 'center',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  zoomControlGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    elevation: 5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  zoomBtn: {
    width: 44,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  bottomCardGroup: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
  },
  alertBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  alertIconBox: {
    marginRight: 8,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  alertSubtitle: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  comprehensiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  rowSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  addressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 16,
  },
  badgeRow: {
    marginTop: 4,
    flexDirection: 'row',
  },
  geofenceStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeInside: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  badgeOutside: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  geofenceStatusText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextInside: {
    color: '#7C3AED',
  },
  badgeTextOutside: {
    color: '#64748B',
  },
});

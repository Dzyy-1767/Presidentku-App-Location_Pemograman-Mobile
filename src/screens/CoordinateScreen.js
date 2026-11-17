import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

export default function CoordinateScreen({ onLocationUpdate }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tekan tombol di bawah untuk membaca GPS');
  const [isError, setIsError] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    setIsError(false);
    setStatusMessage('Sedang mencari satelit GPS...');

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsError(true);
        setStatusMessage('Izin akses lokasi belum diberikan');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      setStatusMessage('Data lokasi berhasil disinkronkan');
      if (onLocationUpdate) {
        onLocationUpdate(currentLocation);
      }
    } catch (error) {
      setIsError(true);
      setStatusMessage('Gagal mengakses GPS. Pastikan GPS aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Kartu Utama Lokasi */}
      <View style={styles.card}>
        {/* Lingkaran Ikon & Status */}
        <View style={styles.pinCircle}>
          <MaterialIcons name="location-pin" size={42} color="#2563EB" />
        </View>

        <Text style={styles.cardHeading}>Lokasi Saat Ini</Text>
        <Text style={styles.cardSubheading}>
          Koordinat presisi perangkat secara real-time
        </Text>

        <View style={styles.divider} />

        {/* List Data Koordinat */}
        <View style={styles.dataList}>
          {/* Latitude */}
          <View style={styles.dataItem}>
            <View style={styles.dataLeft}>
              <View style={styles.iconBadge}>
                <MaterialIcons name="my-location" size={18} color="#2563EB" />
              </View>
              <Text style={styles.dataLabel}>Latitude</Text>
            </View>
            <Text style={styles.dataValue}>
              {location ? location.coords.latitude.toFixed(6) : '-7.9666'}
            </Text>
          </View>

          {/* Longitude */}
          <View style={styles.dataItem}>
            <View style={styles.dataLeft}>
              <View style={styles.iconBadge}>
                <MaterialIcons name="my-location" size={18} color="#2563EB" />
              </View>
              <Text style={styles.dataLabel}>Longitude</Text>
            </View>
            <Text style={styles.dataValue}>
              {location ? location.coords.longitude.toFixed(6) : '112.6326'}
            </Text>
          </View>

          {/* Accuracy */}
          <View style={[styles.dataItem, styles.lastItem]}>
            <View style={styles.dataLeft}>
              <View style={styles.iconBadge}>
                <Feather name="bar-chart-2" size={18} color="#2563EB" />
              </View>
              <Text style={styles.dataLabel}>Accuracy</Text>
            </View>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyText}>
                {location && location.coords.accuracy
                  ? `±${location.coords.accuracy.toFixed(1)} m`
                  : '±5.0 m'}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Hint */}
        <View style={[styles.statusBox, isError && styles.statusBoxError]}>
          <Ionicons
            name={isError ? 'alert-circle' : 'information-circle'}
            size={16}
            color={isError ? '#DC2626' : '#2563EB'}
          />
          <Text style={[styles.statusText, isError && styles.statusTextError]}>
            {statusMessage}
          </Text>
        </View>

        {/* Tombol Ambil Lokasi */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={fetchLocation}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonInner}>
              <MaterialIcons name="my-location" size={20} color="#FFFFFF" style={styles.btnIcon} />
              <Text style={styles.buttonLabel}>Ambil Lokasi</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  pinCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubheading: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 18,
  },
  dataList: {
    width: '100%',
    marginBottom: 20,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  dataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  accuracyBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  accuracyText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 22,
  },
  statusBoxError: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 12,
    color: '#0369A1',
    marginLeft: 8,
    flex: 1,
  },
  statusTextError: {
    color: '#B91C1C',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

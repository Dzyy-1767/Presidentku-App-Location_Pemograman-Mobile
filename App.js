import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './src/components/Header';
import CoordinateScreen from './src/screens/CoordinateScreen';
import MapScreen from './src/screens/MapScreen';
import GeofenceScreen from './src/screens/GeofenceScreen';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

function MainApp() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('COORDINATE');
  const [sharedLocation, setSharedLocation] = useState(null);

  const handleLocationUpdate = (loc) => {
    setSharedLocation(loc);
  };

  return (
    <View style={styles.container}>
      {/* Header PRESIDENTKU dengan Safe Area Atas Dinamis */}
      <Header />

      {/* Layar Konten Aktif */}
      <View style={styles.contentArea}>
        {activeTab === 'COORDINATE' && (
          <CoordinateScreen onLocationUpdate={handleLocationUpdate} />
        )}
        {activeTab === 'MAP' && (
          <MapScreen sharedLocation={sharedLocation} />
        )}
        {activeTab === 'GEOFENCE' && (
          <GeofenceScreen sharedLocation={sharedLocation} />
        )}
      </View>

      {/* Bottom Navigation Bar dengan Safe Area Bawah Dinamis */}
      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom: Math.max(insets.bottom, 14),
            height: 60 + Math.max(insets.bottom, 14),
          },
        ]}
      >
        {/* Tab 1: Koordinat */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('COORDINATE')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconWrapper,
              activeTab === 'COORDINATE' && styles.iconWrapperActive,
            ]}
          >
            <MaterialIcons
              name="my-location"
              size={22}
              color={activeTab === 'COORDINATE' ? '#2563EB' : '#94A3B8'}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'COORDINATE' && styles.navLabelActive,
            ]}
          >
            Koordinat
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Peta */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('MAP')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconWrapper,
              activeTab === 'MAP' && styles.iconWrapperActive,
            ]}
          >
            <Feather
              name="map"
              size={21}
              color={activeTab === 'MAP' ? '#2563EB' : '#94A3B8'}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'MAP' && styles.navLabelActive,
            ]}
          >
            Peta
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Geofence */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('GEOFENCE')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconWrapper,
              activeTab === 'GEOFENCE' && styles.iconWrapperActive,
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={21}
              color={activeTab === 'GEOFENCE' ? '#2563EB' : '#94A3B8'}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'GEOFENCE' && styles.navLabelActive,
            ]}
          >
            Geofence
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Mengikuti warna header agar saat transisi tidak ada flicker putih
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 2,
  },
  iconWrapperActive: {
    backgroundColor: '#EFF6FF',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  navLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});

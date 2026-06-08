import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import HomeScreen from '../pages/home/HomeScreen';
import MyBondsScreen from '../pages/bond/MyBondsScreen';
import ScanBondScreen from '../pages/bond/ScanBondScreen';
import MarketplaceScreen from '../pages/marketplace/MarketplaceScreen';
import ProfileScreen from '../pages/profile/ProfileScreen';
import { colors } from '../utils/assets';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const icons = { Home: '🏠', MyBonds: '📋', Scan: '📷', Market: '🏪', Profile: '👤' };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isScan = route.name === 'Scan';

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, isScan && styles.scanTab]}
            onPress={() => navigation.navigate(route.name)}>
            {isScan ? (
              <View style={styles.scanBtn}>
                <Text style={{ fontSize: 24 }}>{icons[route.name]}</Text>
              </View>
            ) : (
              <>
                <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {route.name}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabBar = () => (
  <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="MyBonds" component={MyBondsScreen} />
    <Tab.Screen name="Scan" component={ScanBondScreen} />
    <Tab.Screen name="Market" component={MarketplaceScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', paddingBottom: 20, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: '#E2E8F0', position: 'absolute', bottom: 0, left: 0, right: 0,
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  scanTab: { marginTop: -20 },
  scanBtn: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  tabLabel: { fontSize: 10, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  tabLabelActive: { color: colors.primary, fontWeight: '700' },
});

export default BottomTabBar;

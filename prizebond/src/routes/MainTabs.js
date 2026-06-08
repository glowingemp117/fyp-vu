import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../constants/colors";

// Screens
import HomeScreen from "../pages/home/HomeScreen";
import MyBondsScreen from "../pages/bond/MyBondsScreen";
import AddBondScreen from "../pages/bond/AddBondScreen";
import ScanBondScreen from "../pages/bond/ScanBondScreen";
import MarketplaceScreen from "../pages/marketplace/MarketplaceScreen";
import CreateListingScreen from "../pages/marketplace/CreateListingScreen";
import DrawsListScreen from "../pages/draws/DrawsListScreen";
import ProfileScreen from "../pages/profile/ProfileScreen";
import NotificationsScreen from "../pages/notifications/NotificationsScreen";
import EditProfileScreen from "../pages/editProfile/EditProfileScreen";
import ChangePasswordScreen from "../pages/changepassword/ChangePasswordScreen";
import LanguageScreen from "../pages/languageScreen/LanguageScreen";
import TermsConditionsScreen from "../pages/termsConditions/TermsConditionsScreen";
import AboutScreen from "../pages/AboutScreen/AboutScreen";
import PrivacyPolicyScreen from "../pages/privacyPolicy/PrivacyPolicyScreen";
import ThemeScreen from "../pages/themescreen/ThemeScreen"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Stacks = () => {
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Draws" component={DrawsListScreen} />
  </Stack.Navigator>;
};

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}
    <Stack.Screen name="AddBond" component={AddBondScreen} />
  </Stack.Navigator>
);

const BondsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BondsMain" component={MyBondsScreen} />
    <Stack.Screen name="AddBond" component={AddBondScreen} />
  </Stack.Navigator>
);

const MarketStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MarketMain" component={MarketplaceScreen} />
    <Stack.Screen name="CreateListing" component={CreateListingScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen
      name="ChangePasswordScreen"
      component={ChangePasswordScreen}
    />
    <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
    <Stack.Screen name="TermsConditionsScreen" component={TermsConditionsScreen} />
    <Stack.Screen name="AboutScreen" component={AboutScreen} />
    <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
    <Stack.Screen name="ThemeScreen" component={ThemeScreen} />
  </Stack.Navigator> 
);

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const tabs = [
    { name: "Home", icon: "home", activeIcon: "home" },
    { name: "Bonds", icon: "ticket-outline", activeIcon: "ticket" },
    { name: "Scanner", icon: "line-scan", activeIcon: "line-scan" },
    { name: "Market", icon: "store-outline", activeIcon: "store" },
    { name: "Profile", icon: "account-outline", activeIcon: "account" },
  ];

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = tabs[index];
          const isScanner = index === 2;

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          if (isScanner) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={tabStyles.scannerBtn}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    tabStyles.scannerCircle,
                    isFocused && tabStyles.scannerActive,
                  ]}
                >
                  <Icon name={tab.icon} size={26} color={COLORS.white} />
                </View>
                <Text style={tabStyles.scannerLabel}>Scan</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={tabStyles.tabBtn}
              activeOpacity={0.7}
            >
              <Icon
                name={isFocused ? tab.activeIcon : tab.icon}
                size={22}
                color={isFocused ? COLORS.primary : COLORS.gray[400]}
              />
              <Text
                style={[tabStyles.label, isFocused && tabStyles.labelActive]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Bonds" component={BondsStack} />
      <Tab.Screen name="Scanner" component={ScanBondScreen} />
      <Tab.Screen name="Market" component={MarketStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: COLORS.gray[400],
    marginTop: 4,
    fontWeight: "600",
  },
  labelActive: {
    color: COLORS.primary,
  },
  scannerBtn: {
    alignItems: "center",
    flex: 1,
    marginTop: -30,
  },
  scannerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scannerActive: {
    backgroundColor: COLORS.primaryLight,
  },
  scannerLabel: {
    fontSize: 10,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "700",
  },
});

export default MainTabs;

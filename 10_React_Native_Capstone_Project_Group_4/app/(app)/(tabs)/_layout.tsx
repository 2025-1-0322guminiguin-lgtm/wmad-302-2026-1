import { CrimsonAmbientBackdrop } from '@/components/CrimsonAmbientBackdrop';
import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useDesignMode } from "@/context/DesignModeContext";

export default function TabsLayout() {
  const { totals } = useCart();
  const { isCrimson } = useDesignMode();
  const insets = useSafeAreaInsets();

  return (
    <>
      <CrimsonAmbientBackdrop />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: isCrimson ? "#FFFFFF" : "#1E293B",
          tabBarInactiveTintColor: isCrimson ? "#94A3B8" : "#64748B",
          tabBarActiveBackgroundColor: isCrimson
            ? "rgba(225, 29, 72, 0.28)"
            : "rgba(251, 191, 36, 0.34)",
          tabBarItemStyle: {
            borderRadius: 12,
            marginHorizontal: 6,
            marginVertical: 4,
          },
          tabBarStyle: {
            backgroundColor: isCrimson ? "rgba(12, 12, 18, 0.96)" : "rgba(255, 255, 255, 0.95)",
            borderTopWidth: 1,
            borderTopColor: isCrimson ? "rgba(225, 29, 72, 0.42)" : "rgba(226, 232, 240, 0.95)",
            height: 60 + (Platform.OS === "web" ? 0 : Math.max(insets.bottom, 6)),
            paddingBottom: Platform.OS === "web" ? 6 : Math.max(insets.bottom, 6),
            paddingTop: 4,
            ...(Platform.OS === "web"
              ? ({
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                } as Record<string, string>)
              : { elevation: 10 }),
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Shop",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="storefront-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarBadge: totals.totalQuantity > 0 ? totals.totalQuantity : undefined,
            tabBarBadgeStyle: {
              backgroundColor: isCrimson ? "#E11D48" : "#1E293B",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: "800",
            },
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="categories" options={{ href: null }} />
        <Tabs.Screen name="product/[id]" options={{ href: null }} />
        <Tabs.Screen name="homeStyles" options={{ href: null }} />
        <Tabs.Screen name="searchStyles" options={{ href: null }} />
        <Tabs.Screen name="cartStyles" options={{ href: null }} />
        <Tabs.Screen name="profileStyles" options={{ href: null }} />
        <Tabs.Screen name="categoriesStyles" options={{ href: null }} />
      </Tabs>
    </>
  );
}

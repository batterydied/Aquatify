import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#3A6D8C',
        headerShown: false, // Global option to hide the header
      }}
    >
      <Tabs.Screen 
      name="home" 
      options={{
        title: '',
        tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color}/>
          ),
      }}
      />
      <Tabs.Screen 
      name="favorites" 
      options={{
        title: '',
        tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" size={size * 0.8} color={color}/> 
          ),
      }}
      />
      <Tabs.Screen 
      name="cart" 
      options={{
        title: '',
        tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-cart" size={size} color={color}/>
          ),
      }}
      />
      <Tabs.Screen 
      name="setting" 
      options={{
        title: '',
        tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size * 0.9} color={color}/>
          ),
      }}
      />
      <Tabs.Screen 
      name="(product)/[productId]"
      options={{
        href: null,
      }}
      />
    </Tabs>
  );
}

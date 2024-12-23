import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: 'red',
        headerShown: false, // Global option to hide the header
      }}
    >
      {/* Add more Tabs.Screen components here */}
    </Tabs>
  );
}

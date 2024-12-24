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
      <Tabs.Screen 
      name="home" 
      options={{
        title: 'Home',
      }}
      />
      <Tabs.Screen 
      name="setting" 
      options={{
        title: 'Setting',
      }}
      />
    </Tabs>
  );
}

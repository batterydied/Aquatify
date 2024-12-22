import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: 'blue',
        headerShown: false,
    }}>
      <Tabs.Screen name="TestPage"></Tabs.Screen>
    </Tabs>
  );
}

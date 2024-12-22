import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: 'red',
        headerShown: false,
     }}>
    </Tabs>
  );
}

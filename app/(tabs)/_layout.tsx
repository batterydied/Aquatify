import { Tabs } from 'expo-router';
export default function TabLayout(){
    return (
        <Tabs>
        <Tabs.Screen name="Home" options={
            {
                title: "Home",
            }
        } />
        <Tabs.Screen name="Cart" options={
            {
                title: "Cart",
            }
        } />
        <Tabs.Screen name="Profile" options={
            {
                title: "User",
            }
        } />
        </Tabs>
    )
}
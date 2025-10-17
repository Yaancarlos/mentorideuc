import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminUsers from "./users";
import {Ionicons} from "@expo/vector-icons";
import Home from "@/app/(admin)/index";
import Profile from "@/app/(admin)/Profile";
import UsersAdmin from "@/app/(admin)/info/index";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Usuarios') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // @ts-ignore
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={Home} />
            <Tab.Screen name="Usuarios" component={UsersAdmin} />
            <Tab.Screen name="Perfil" component={Profile} />
        </Tab.Navigator>
    );
}
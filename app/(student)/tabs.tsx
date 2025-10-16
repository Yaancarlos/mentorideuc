import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "./index";
import {Ionicons} from "@expo/vector-icons";
import BookingScreen from "@/app/(student)/BookingScreen";
import SessionsListScreen from "@/app/(student)/sessions/index";
import Profile from "@/app/(student)/Profile";

const Tab = createBottomTabNavigator();

export default function StudentTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Sesiones') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Agendar') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // @ts-ignore
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={Dashboard} />
            <Tab.Screen name="Sesiones" component={SessionsListScreen} />
            <Tab.Screen name="Agendar" component={BookingScreen} />
            <Tab.Screen name="Perfil" component={Profile} />
        </Tab.Navigator>
    );
}

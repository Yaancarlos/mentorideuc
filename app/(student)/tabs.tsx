import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "./index";
import StudentSessions from "./sessions";
import {Ionicons} from "@expo/vector-icons";
import BookingScreen from "@/app/(student)/BookingScreen";

const Tab = createBottomTabNavigator();

export default function StudentTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Sessions') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Booking') {
                        iconName = focused ? 'book' : 'book-outline';
                    }

                    // @ts-ignore
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Sessions" component={StudentSessions} />
            <Tab.Screen name="Booking" component={BookingScreen} />
        </Tab.Navigator>
    );
}

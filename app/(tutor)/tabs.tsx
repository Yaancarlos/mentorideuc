import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "./index";
import TutorSessions from "./sessions";
import {Ionicons} from "@expo/vector-icons";
import MyCalendarScreen from "@/app/(tutor)/CalendarScreen";

const Tab = createBottomTabNavigator();

export default function TutorTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Sessions') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name == 'Calendario') {
                        iconName = focused ? 'book' : 'book-outline';
                    }

                    // @ts-ignore
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Sessions" component={TutorSessions} />
            <Tab.Screen name="Calendario" component={MyCalendarScreen} />
        </Tab.Navigator>
    );
}

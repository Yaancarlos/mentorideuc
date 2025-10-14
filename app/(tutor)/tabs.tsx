import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "./index";
import SessionsListScreenTutor from "@/app/(tutor)/sessions/index";
import {Ionicons} from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MyCalendarScreen from "@/app/(tutor)/CalendarScreen";
import PendingSessions from "@/app/(tutor)/PendingSessions";
import Profile from "@/app/(tutor)/Profile";

const Tab = createBottomTabNavigator();

export default function TutorTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Agenda') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name == 'Calendario') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name == 'Pendientes') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name == 'Sesiones') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name == 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // @ts-ignore
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={Dashboard} />
            <Tab.Screen name="Agenda" component={SessionsListScreenTutor} />
            <Tab.Screen name="Calendario" component={MyCalendarScreen} />
            <Tab.Screen name="Pendientes" component={PendingSessions} />
            <Tab.Screen name="Perfil" component={Profile} />
        </Tab.Navigator>
    );
}

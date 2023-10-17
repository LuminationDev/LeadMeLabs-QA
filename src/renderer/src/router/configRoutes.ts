//Config Tool screens
import WelcomeScreen from "@renderer/tool-config/screens/WelcomeScreen.vue";
import ChecklistScreen from "@renderer/tool-config/screens/ChecklistScreen.vue";
import LightScreen from "@renderer/tool-config/screens/LightScreen.vue";
import RoomScreen from "@renderer/tool-config/screens/RoomScreen.vue";
import BlindScreen from "@renderer/tool-config/screens/BlindScreen.vue";
import ProjectorScreen from "@renderer/tool-config/screens/ProjectorScreen.vue";
import SplicerScreen from "@renderer/tool-config/screens/SplicerScreen.vue";
import LedRingScreen from "@renderer/tool-config/screens/LedRingScreen.vue";
import StationScreen from "@renderer/tool-config/screens/StationScreen.vue";
import SceneScreen from "@renderer/tool-config/screens/SceneScreen.vue";
import FinalScreen from "@renderer/tool-config/screens/FinalScreen.vue";

/**
 * Routes used for the Config tool
 */
export const configToolRoutes = [
    {
        path: '/config/welcome',
        name: 'config-welcome',
        component: WelcomeScreen,
        meta: {
            next: '/config/checklist',
            prev: '/',
            progress: 0
        }
    },
    {
        path: '/config/checklist',
        name: 'checklist',
        component: ChecklistScreen,
        meta: {
            next: '/config/rooms',
            prev: '/config/welcome',
            progress: 10
        }
    },
    {
        path: '/config/rooms',
        name: 'rooms',
        component: RoomScreen,
        meta: {
            next: '/config/lights',
            prev: '/config/checklist',
            progress: 20
        }
    },
    {
        path: '/config/lights',
        name: 'lights',
        component: LightScreen,
        meta: {
            next: '/config/blinds',
            prev: '/config/rooms',
            progress: 30
        }
    },
    {
        path: '/config/blinds',
        name: 'blinds',
        component: BlindScreen,
        meta: {
            next: '/config/projectors',
            prev: '/config/lights',
            progress: 40
        }
    },
    {
        path: '/config/projectors',
        name: 'projectors',
        component: ProjectorScreen,
        meta: {
            next: '/config/splicers',
            prev: '/config/blinds',
            progress: 50
        }
    },
    {
        path: '/config/splicers',
        name: 'splicers',
        component: SplicerScreen,
        meta: {
            next: '/config/ledRings',
            prev: '/config/projectors',
            progress: 60
        }
    },
    {
        path: '/config/ledRings',
        name: 'ledRings',
        component: LedRingScreen,
        meta: {
            next: '/config/stations',
            prev: '/config/splicers',
            progress: 70
        }
    },
    {
        path: '/config/stations',
        name: 'stations',
        component: StationScreen,
        meta: {
            next: '/config/scenes',
            prev: '/config/ledRings',
            progress: 80
        }
    },
    {
        path: '/config/scenes',
        name: 'scenes',
        component: SceneScreen,
        meta: {
            next: '/config/final',
            prev: '/config/ledRings',
            progress: 90
        }
    },
    {
        path: '/config/final',
        name: 'final',
        component: FinalScreen,
        meta: {
            prev: '/config/scenes',
            progress: 100
        }
    }
]
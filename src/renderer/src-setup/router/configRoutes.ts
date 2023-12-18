//Config Tool screens
import WelcomeView from "@renderer/src-setup/views/WelcomeView.vue";
import ChecklistView from "@renderer/src-setup/views/ChecklistView.vue";
import LightView from "@renderer/src-setup/views/LightView.vue";
import RoomView from "@renderer/src-setup/views/RoomView.vue";
import BlindView from "@renderer/src-setup/views/BlindView.vue";
import ProjectorView from "@renderer/src-setup/views/ProjectorView.vue";
import SplicerView from "@renderer/src-setup/views/SplicerView.vue";
import LedRingView from "@renderer/src-setup/views/LedRingView.vue";
import StationView from "@renderer/src-setup/views/StationView.vue";
import SceneView from "@renderer/src-setup/views/SceneView.vue";
import FinalView from "@renderer/src-setup/views/FinalView.vue";

/**
 * Routes used for the Config tool
 */
export const configToolRoutes = [
    {
        path: '/config/welcome',
        name: 'config-welcome',
        component: WelcomeView,
        meta: {
            next: '/config/checklist',
            prev: '/',
            progress: 0
        }
    },
    {
        path: '/config/checklist',
        name: 'checklist',
        component: ChecklistView,
        meta: {
            next: '/config/rooms',
            prev: '/config/welcome',
            progress: 10
        }
    },
    {
        path: '/config/rooms',
        name: 'rooms',
        component: RoomView,
        meta: {
            next: '/config/lights',
            prev: '/config/checklist',
            progress: 20
        }
    },
    {
        path: '/config/lights',
        name: 'lights',
        component: LightView,
        meta: {
            next: '/config/blinds',
            prev: '/config/rooms',
            progress: 30
        }
    },
    {
        path: '/config/blinds',
        name: 'blinds',
        component: BlindView,
        meta: {
            next: '/config/projectors',
            prev: '/config/lights',
            progress: 40
        }
    },
    {
        path: '/config/projectors',
        name: 'projectors',
        component: ProjectorView,
        meta: {
            next: '/config/splicers',
            prev: '/config/blinds',
            progress: 50
        }
    },
    {
        path: '/config/splicers',
        name: 'splicers',
        component: SplicerView,
        meta: {
            next: '/config/ledRings',
            prev: '/config/projectors',
            progress: 60
        }
    },
    {
        path: '/config/ledRings',
        name: 'ledRings',
        component: LedRingView,
        meta: {
            next: '/config/stations',
            prev: '/config/splicers',
            progress: 70
        }
    },
    {
        path: '/config/stations',
        name: 'stations',
        component: StationView,
        meta: {
            next: '/config/scenes',
            prev: '/config/ledRings',
            progress: 80
        }
    },
    {
        path: '/config/scenes',
        name: 'scenes',
        component: SceneView,
        meta: {
            next: '/config/final',
            prev: '/config/ledRings',
            progress: 90
        }
    },
    {
        path: '/config/final',
        name: 'final',
        component: FinalView,
        meta: {
            prev: '/config/scenes',
            progress: 100
        }
    }
]
import QuickCheck from "@renderer/tool-qa/screens/QuickCheck.vue";
import FullCheck from "@renderer/tool-qa/screens/FullCheck.vue";
import TheNetwork from "@renderer/tool-qa/components/fullCheck/screens/TheNetwork.vue";
import TheWindows from "@renderer/tool-qa/components/fullCheck/screens/TheWindows.vue";
import TheSoftware from "@renderer/tool-qa/components/fullCheck/screens/TheSoftware.vue";
import TheSecurity from "@renderer/tool-qa/components/fullCheck/screens/TheSecurity.vue";
import TheAppliances from "@renderer/tool-qa/components/fullCheck/Appliances/TheAppliances.vue";
import TheReport from "@renderer/tool-qa/components/fullCheck/Report/TheReport.vue";
import TheHardware from "@renderer/tool-qa/components/fullCheck/screens/TheHardware.vue";
import TheIMVR from "@renderer/tool-qa/components/fullCheck/screens/TheIMVR.vue";

/**
 * Routes used for the Quick Lab Check
 */
export const quickRoutes = [
    {
        path: '/check/quick',
        name: 'quick-setup',
        component: QuickCheck,
        meta: {
            prev: '/check/selection'
        }
    },
    {
        path: '/check/quick/auto',
        name: 'quick-auto',
        component: QuickCheck,
        meta: {
            prev: '/check/quick'
        }
    }
];

/**
 * Describes each page within the QA tool.
 * NOTE this does not yet align with the routes, they need to be changed manually if the screens are moved around.
 */
export const navigation = [
    {
        route: "/check/full/hardware",
        title: "Hardware",
        component: TheHardware,
        progress: 0, //TODO work out how to automate this
        screens: [ //TODO Work out how to auto generate the pages/auto checks
            { title: "Battery", objectName: "BATTERY", progress: 10 },
            { title: "Cabling & Routing", objectName: "CABLING", progress: 20 },
            { title: "Projectors", objectName: "PROJECTOR", progress: 30 },
            { title: "Keyboard", objectName: "KEYBOARD", progress: 40 },
            { title: "BIOS", objectName: "BIOS", progress: 50 },
        ],
        checks: {
            auto: [],
            manual: ['BATTERY', 'CABLING', 'PROJECTOR', 'KEYBOARD', 'BIOS'] //TODO Work out how to automate this
        }
    },
    {
        route: "/check/full/networking",
        title: "Network",
        component: TheNetwork,
        progress: 31,
        screens: [
            { title: "Network", objectName: "NETWORK", progress: 50 },
            { title: "CBus Options", objectName: "CBUS", progress: 60 }
        ],
        checks: {
            auto: [],
            manual: ['NETWORK', 'CBUS']
        }
    },
    {
        route: "/check/full/windows",
        title: "Windows",
        component: TheWindows,
        progress: 61,
        screens: [

            { title: "Settings", objectName: "WINDOWS", progress: 80 },
        ],
        checks: {
            auto: ['windows_checks'],
            manual: ['WINDOWS']
        }
    },
    {
        route: "/check/full/security",
        title: "Security",
        component: TheSecurity,
        progress: 81,
        screens: [
            { title: "BIOS", objectName: "BITWARDEN", progress: 90 },
        ],
        checks: {
            auto: [],
            manual: ['BITWARDEN']
        }
    },
    {
        route: "/check/full/software",
        title: "Software",
        component: TheSoftware,
        progress: 91,
        screens: [
            { title: "Steam", objectName: "STEAM", progress: 95 },
        ],
        checks: {
            auto: ['software_checks', 'steam_config_checks'],
            manual: ['STEAM']
        }
    },
    {
        route: "/check/full/imvr",
        title: "IMVR Stations",
        component: TheIMVR,
        progress: 96,
        screens: [
            { title: "Vive", objectName: "VIVE", progress: 20 },
            { title: "Launching", objectName: "LAUNCHING", progress: 100 },
        ],
        checks: {
            auto: [],
            manual: ['VIVE']
        }
    },
    // {
    //     route: "/check/full/leadme",
    //     title: "LeadMe",
    //     component: "",
    //     progress: 0,
    //     screens : [],
    //     checks: {
    //         auto: [],
    //         manual: []
    //     }
    // }
]

/**
 * Automatically generate the routes for the basic checks from the data structure above.
 */
const createBasicRoutes = (): [{}] => {
    const routes: [{}] = [{}];

    navigation.forEach((entry, navigationIndex) => {
        const descriptionRoute = {
            path: entry.route,
            name: `full-${entry.title.toLowerCase()}`,
            component: entry.component,
            meta: {
                next: generateNextPath("description", navigationIndex, 0),
                prev: generatePreviousPath("description", navigationIndex, 0),
                progress: entry.progress
            }
        };

        routes.push(descriptionRoute);

        if (entry.checks.auto.length > 0) {
            entry.checks.auto.forEach((autoCheck, pageIndex) => {
                const autoRoute = {
                    path: `${entry.route}/auto/${autoCheck}`,
                    name: `full-${entry.title.toLowerCase()}-auto-${autoCheck}`,
                    component: entry.component,
                    meta: {
                        next: generateNextPath("auto", navigationIndex, pageIndex),
                        prev: generatePreviousPath("auto", navigationIndex, pageIndex),
                        progress: entry.progress
                    }
                };
                routes.push(autoRoute);
            });
        }

        if (entry.screens.length > 0) {
            entry.screens.forEach((screen, pageIndex) => {
                const manualRoute = {
                    path: `${entry.route}/${screen.objectName.toLowerCase()}`,
                    name: `full-${entry.title.toLowerCase()}-${screen.objectName.toLowerCase()}`,
                    component: entry.component,
                    meta: {
                        addComment: true,
                        userInput: true,
                        canSkip: true,
                        next: generateNextPath("manual", navigationIndex, pageIndex),
                        prev: generatePreviousPath("manual", navigationIndex, pageIndex),
                        progress: screen.progress,
                        trackerName: screen.objectName
                    }
                };
                routes.push(manualRoute);
            });
        }

        const reportRoute = {
            path: `${entry.route}/report`,
            name: `full-${entry.title.toLowerCase()}-report`,
            component: entry.component,
            meta: {
                next: generateNextPath("report", navigationIndex, 0),
                prev: generatePreviousPath("report", navigationIndex, 0),
                progress: entry.screens[entry.screens.length -1].progress,
                nextText: 'Proceed'
            }
        };
        routes.push(reportRoute);
    });

    console.log(routes);

    return routes;
}

/**
 * Generate the next path based on the user's current location.
 * @param pageType A string of the page that a user is on. [description, auto, manual or report]
 * @param navigationIndex A number of the current route index as per the navigation array
 * @param pageIndex A number of the individual page index of the auto checks or navigation entries screens
 */
const generateNextPath = (pageType: string, navigationIndex: number, pageIndex: number) => {
    const entry = navigation[navigationIndex];

    if (pageType === 'report' && navigationIndex === navigation.length - 1) {
        return '/check/full/report';
    }

    switch (pageType) {
        case 'description':
            return entry.checks.auto.length > 0
                ? `${entry.route}/auto/${entry.checks.auto[0]}`
                : `${entry.route}/${entry.screens[0].objectName.toLowerCase()}`;

        case 'auto':
            return pageIndex < entry.checks.auto.length - 1
                ? `${entry.route}/auto/${entry.checks.auto[pageIndex + 1]}`
                : `${entry.route}/${entry.screens[0].objectName.toLowerCase()}`;

        case 'manual':
            return pageIndex < entry.screens.length - 1
                ? `${entry.route}/${entry.screens[pageIndex + 1].objectName.toLowerCase()}`
                : `${entry.route}/report`;

        case 'report':
            const nextEntry = navigation[navigationIndex + 1];
            return `${nextEntry.route}`;

        default:
            return "/";
    }
};

/**
 * Generate the previous path based on the user's current location.
 * @param pageType A string of the page that a user is on. [description, auto, manual or report]
 * @param navigationIndex A number of the current route index as per the navigation array
 * @param pageIndex A number of the individual page index of the auto checks or navigation entries screens
 */
const generatePreviousPath = (pageType: string, navigationIndex: number, pageIndex: number) => {
    const entry = navigation[navigationIndex];

    if (navigationIndex === -1) {
        const lastEntry = navigation[navigation.length - 1];
        return `${lastEntry.route}/report`;
    }

    switch (pageType) {
        case 'description':
            return navigationIndex === 0 ? '/check/full' : `${navigation[navigationIndex - 1].route}/report`;

        case 'auto':
            return pageIndex > 0
                ? `${entry.route}/auto/${entry.checks.auto[pageIndex - 1]}`
                : entry.route;

        case 'manual':
            if (pageIndex > 0) {
                return `${entry.route}/${entry.screens[pageIndex - 1].objectName.toLowerCase()}`;
            } else if (entry.checks.auto.length > 0) {
                return `${entry.route}/auto/${entry.checks.auto[entry.checks.auto.length - 1]}`;
            } else {
                return `${entry.route}`;
            }

        case 'report':
            return `${entry.route}/${entry.screens[entry.screens.length - 1].objectName.toLowerCase()}`;

        default:
            return "/";
    }
};

/**
 * Routes used for the Full Lab Check
 */
export const fullRoutes = [
    {
        path: '/check/full',
        name: 'full-description',
        component: FullCheck,
        meta: {
            next: '/check/full/appliances',
            nextText: 'Start Test',
            prev: '/check/selection'
        }
    },

    //Appliance Route
    {
        path: '/check/full/appliances',
        name: 'full-appliance',
        component: TheAppliances,
        meta: {
            addComment: true,
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: navigation[0].route,
            prev: '/check/full',
            progress: 0
        }
    },

    //Auto generated routes
    ...createBasicRoutes(),

    //Basic report preview
    {
        path: '/check/full/report',
        name: 'full-report',
        component: TheReport,
        meta: {
            prev: generatePreviousPath("report", -1, 0),
            progress: 100
        }
    }
];

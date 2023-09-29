import { NavigationItem } from "../tool-qa/interfaces";
import QuickCheck from "@renderer/tool-qa/screens/QuickCheck.vue";
import FullCheck from "@renderer/tool-qa/screens/FullCheck.vue";
import TheAppliances from "@renderer/tool-qa/components/fullCheck/Appliances/TheAppliances.vue";
import TheReport from "@renderer/tool-qa/components/fullCheck/Report/TheReport.vue";
import TheIMVR from "@renderer/tool-qa/components/fullCheck/screens/TheIMVR.vue";
import BasicSection from "@renderer/tool-qa/components/fullCheck/screens/BasicSection.vue";

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
export const navigation: Array<NavigationItem> = [
    {
        route: "/check/full/hardware",
        title: "Hardware",
        description: "Something about the section...",
        screens: [
            { title: "Battery", objectName: "BATTERY"},
            { title: "Video Cables", objectName: "VIDEO_CABLES"},
            { title: "Projectors", objectName: "PROJECTORS"},
            { title: "Keyboard", objectName: "KEYBOARD"},
            { title: "BIOS Settings", objectName: "BIOS_SETTINGS"},
        ],
        checks: {
            auto: [],
            manual: [] as string[]
        }
    },
    {
        route: "/check/full/networking",
        title: "Network",
        description: "Configure network settings to ensure seamless lab connectivity.",
        screens: [
            { title: "MileSight Router", objectName: "MILESITE_ROUTER"},
            { title: "C-Bus Template", objectName: "CBUS"}
        ],
        checks: {
            auto: [],
            manual: [] as string[]
        }
    },
    {
        route: "/check/full/windows",
        title: "Windows",
        description: "Something about the section...",
        screens: [
            { title: "Handover Doc", objectName: "HANDOVER"},
            { title: "Drivers", objectName: "DRIVERS"},
            { title: "Executables", objectName: "EXECUTABLES"},
        ],
        checks: {
            auto: ['windows_checks'],
            manual: [] as string[]
        }
    },
    {
        route: "/check/full/security",
        title: "Security",
        description: "Something about the section...",
        screens: [
            { title: "Passwords", objectName: "PASSWORDS"},
            { title: "LeadMe", objectName: "LEADME_SECURITY"},
        ],
        checks: {
            auto: [],
            manual: [] as string[]
        }
    },
    {
        route: "/check/full/software",
        title: "Software",
        description: "Something about the section...",
        screens: [
            { title: "Steam", objectName: "STEAM"},
        ],
        checks: {
            auto: ['software_checks', 'steam_config_checks'],
            manual: [] as string[]
        }
    },
    {
        route: "/check/full/imvr",
        title: "IMVR Stations",
        description: "Something about the section...",
        screens: [
            { title: "Vive Console", objectName: "VIVE"},
            { title: "Launching", objectName: "LAUNCHING", component: TheIMVR}, //Use a custom screen component
            { title: "Virtual Reality", objectName: "VIRTUAL_REALITY"}
        ],
        checks: {
            auto: [],
            manual: [] as string[]
        }
    },
    // {
    //     route: "/check/full/leadme",
    //     title: "LeadMe",
    //     component: "",
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

    //Calculate the total pages to use for the progress
    let previousProgress = 0;
    let currentCheck = 0;
    let totalChecks = navigation.reduce((total, obj) => total + obj.screens.length + obj.checks.auto.length, 0);

    navigation.forEach((entry: NavigationItem, navigationIndex: number) => {
        //Create the manual checks for each navigation item
        entry.checks.manual = entry.screens.map(screen => screen.objectName);

        //Create a description page (this may not be needed in the future)
        const descriptionRoute = {
            path: entry.route,
            name: `full-${entry.title.toLowerCase()}`,
            component: entry.component ?? BasicSection, //entry.component is checked first then BasicSection as the default
            meta: {
                next: generateNextPath("description", navigationIndex, 0),
                prev: generatePreviousPath("description", navigationIndex, 0),
                progress: previousProgress
            }
        };
        routes.push(descriptionRoute);

        //Create any auto check pages (this can be none)
        if (entry.checks.auto.length > 0) {
            entry.checks.auto.forEach((autoCheck: string, pageIndex: number) => {
                const autoRoute = {
                    path: `${entry.route}/auto/${autoCheck}`,
                    name: `full-${entry.title.toLowerCase()}-auto-${autoCheck}`,
                    component: entry.component ?? BasicSection, //entry.component is checked first then BasicSection as the default
                    meta: {
                        next: generateNextPath("auto", navigationIndex, pageIndex),
                        prev: generatePreviousPath("auto", navigationIndex, pageIndex),
                        progress: (() => {
                            //Work out percentage and set the previous percentage progress
                            return previousProgress = Math.floor((++currentCheck / totalChecks) * 100);
                        })()
                    }
                };
                routes.push(autoRoute);
            });
        }

        //Create any manual check pages
        if (entry.screens.length > 0) {
            entry.screens.forEach((screen: {title: string, objectName: string, component?: any}, pageIndex: number) => {
                const manualRoute = {
                    path: `${entry.route}/${screen.objectName.toLowerCase()}`,
                    name: `full-${entry.title.toLowerCase()}-${screen.objectName.toLowerCase()}`,
                    component: screen.component ?? entry.component ?? BasicSection, //screen.component is checked first, then entry.component then BasicSection as the default
                    meta: {
                        addComment: true,
                        userInput: true,
                        canSkip: true,
                        next: generateNextPath("manual", navigationIndex, pageIndex),
                        prev: generatePreviousPath("manual", navigationIndex, pageIndex),
                        progress: (() => {
                            //Work out percentage and set the progress in the navigation object & set the previous percentage progress
                            return screen['progress'] = previousProgress = Math.floor((++currentCheck / totalChecks) * 100);
                        })(),
                        trackerName: screen.objectName
                    }
                };
                routes.push(manualRoute);
            });
        }

        //Create the report page
        const reportRoute = {
            path: `${entry.route}/report`,
            name: `full-${entry.title.toLowerCase()}-report`,
            component: entry.component ?? BasicSection, //entry.component is checked first then BasicSection as the default
            meta: {
                next: generateNextPath("report", navigationIndex, 0),
                prev: generatePreviousPath("report", navigationIndex, 0),
                progress: previousProgress,
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

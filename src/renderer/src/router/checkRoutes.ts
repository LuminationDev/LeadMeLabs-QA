import QuickCheck from "@renderer/tool-qa/screens/QuickCheck.vue";
import FullCheck from "@renderer/tool-qa/screens/FullCheck.vue";
import TheAppliances from "@renderer/tool-qa/components/fullCheck/Appliances/TheAppliances.vue";
import ManualCheck from "@renderer/tool-qa/components/fullCheck/screens/ManualCheck.vue";
import { HARDWARE, IMVR, NETWORK, SECURITY, SOFTWARE, WINDOWS } from "../assets/checks/_fullcheckValues";
import { CheckObject, Route } from "../tool-qa/interfaces/_routeItems";
import TheIMVR from "../tool-qa/components/fullCheck/screens/TheIMVR.vue";
import BasicAutoCheck from "../tool-qa/components/fullCheck/screens/AutoCheck.vue";
import BasicReport from "../tool-qa/components/fullCheck/Report/Results/BasicReport.vue";
import OverallReport from "../tool-qa/components/fullCheck/Report/OverallReport.vue";
import FinaliseReport from "../tool-qa/components/fullCheck/Report/FinaliseReport.vue";

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
 * Generic metadata that is the same across all manual routes
 */
const manualMetaData = () => {
    return {
        type: 'manual', //The checks on this page are all manual
        addComment: true,
        userInput: true, //Requires user input to proceed to the next page
        canSkip: true,
    };
}

/**
 * Use this variable to track the progress over the different screens, each screen is assigned it as ++currentProgress
 * incrementing it before the next screen.
 */
let currentProgress = 0;
const calculateProgress = () => {
    //return ++currentProgress; //Quick way to count how many checks there are.
    return Math.floor(++currentProgress/38 * 100); //TODO WARNING: 38 is a static number it will change depending when more checks are added.
}

/**
 * Generates route configurations from an array of check objects.
 * @param checkArray - An array of check objects representing hardware checks.
 * @param previousRoute - A string of the previous route outside the object array.
 * @param nextRoute - A string of the next route outside the object array.
 * @returns Array, An array of route configurations for the checks.
 */
const generateRoutesFromObjectArray = (checkArray: CheckObject[], previousRoute: string, nextRoute: string): Route[] => {
    const routes: Route[] = [];

    checkArray.forEach((section, sectionIndex) => {
        const categories = section.category;



        categories.forEach((categoryObj, categoryIndex) => {
            const categoryName = Object.keys(categoryObj)[0];
            const category = categoryObj[categoryName];
            const path = `/check/full/${section.parent}/${section.page}/${categoryName.toLowerCase()}`;
            const name = `full-${section.parent}-${section.page}-${categoryName.toLowerCase()}`;

            const route: Route = {
                path,
                name,
                component: ManualCheck,
                meta: {
                    description: category.description,
                    page: section.page,
                    category: categoryName,
                    next: getNextPath(checkArray, sectionIndex, categoryIndex, nextRoute),
                    prev: getPrevPath(checkArray, sectionIndex, categoryIndex, previousRoute),
                    progress: calculateProgress(),
                    ...manualMetaData(),
                },
            };

            routes.push(route);
        });
    });

    return routes;
};

/**
 * Retrieves the next path based on navigation object, category, and check indices.
 * @param checkArray - An array of navigation objects.
 * @param checkIndex - The index of the current navigation object.
 * @param categoryIndex - The index of the current category within the navigation object.
 * @param lastItemPath - A string of the route that is after the current navigation object.
 * @returns string, The next path for navigation.
 */
const getNextPath = (
    checkArray: CheckObject[],
    checkIndex: number,
    categoryIndex: number,
    lastItemPath: string
): string => {
    if (categoryIndex < checkArray[checkIndex].category.length - 1) {
        const nextCategory = checkArray[checkIndex].category[categoryIndex + 1];
        const nextCategoryKey = Object.keys(nextCategory)[0];
        return `/check/full/${checkArray[checkIndex].parent}/${checkArray[checkIndex].page.toLowerCase()}/${nextCategoryKey.toLowerCase()}`;
    } else if (checkIndex < checkArray.length - 1) {
        const nextHardware = checkArray[checkIndex + 1];
        const nextCategory = nextHardware.category[0];
        const nextCategoryKey = Object.keys(nextCategory)[0];
        return `/check/full/${checkArray[checkIndex].parent}/${checkArray[checkIndex + 1].page.toLowerCase()}/${nextCategoryKey.toLowerCase()}`;
    } else {
        return lastItemPath;  // No next path for the last item
    }
};

/**
 * Retrieves the previous path based on navigation object, category, and check indices.
 * @param checkArray - An array of navigation objects.
 * @param checkIndex - The index of the current navigation object.
 * @param categoryIndex - The index of the current category within the navigation object.
 * @param firstItemPath - A string of the route that is before the current navigation object.
 * @returns string, The previous path for navigation.
 */
const getPrevPath = (
    checkArray: CheckObject[],
    checkIndex: number,
    categoryIndex: number,
    firstItemPath: string
): string => {
    if (categoryIndex > 0) {
        const prevCategory = checkArray[checkIndex].category[categoryIndex - 1];
        const prevCategoryKey = Object.keys(prevCategory)[0];
        return `/check/full/${checkArray[checkIndex].parent}/${checkArray[checkIndex].page.toLowerCase()}/${prevCategoryKey.toLowerCase()}`;
    } else if (checkIndex > 0) {
        const prevHardware = checkArray[checkIndex - 1];
        const prevCategory = prevHardware.category[prevHardware.category.length - 1];
        const prevCategoryKey = Object.keys(prevCategory)[0];
        return `/check/full/${checkArray[checkIndex].parent}/${checkArray[checkIndex - 1].page.toLowerCase()}/${prevCategoryKey.toLowerCase()}`;
    } else {
        return firstItemPath;  // No prev path for the first item
    }
};

/**
 * Retrieves the first path based on a navigation object.
 * @param checkArray - An array of navigation objects.
 * @returns string, The first path for navigation.
 */
const getFirstRoute = (checkArray: CheckObject[]) => {
    const firstRoute = checkArray[0];
    return `/check/full/${firstRoute.parent}/${firstRoute.page}/${Object.keys(firstRoute.category[0])[0].toLowerCase()}`;
}

/**
 * Retrieves the last path based on a navigation object.
 * @param checkArray - An array of navigation objects.
 * @returns string, The last path for navigation.
 */
const getLastRoute = (checkArray: CheckObject[]) => {
    const lastRoute = checkArray[checkArray.length - 1];
    return `/check/full/${lastRoute.parent}/${lastRoute.page}/${Object.keys(lastRoute.category[lastRoute.category.length - 1])[0].toLowerCase()}`;
}

/**
 * Routes used for the Full Lab Check
 */
export const fullRoutes = [
    {
        path: '/check/full/setup/devices/nuc',
        name: 'full-setup-devices-nuc',
        component: FullCheck,
        meta: {
            next: '/check/full/setup/devices/tablets',
            prev: '/',
            progress: calculateProgress()
        }
    },

    {
        path: '/check/full/setup/devices/tablets',
        name: 'full-setup-devices-tablets',
        component: FullCheck,
        meta: {
            next: '/check/full/setup/devices/stations',
            prev: '/check/full/setup/devices/nuc',
            progress: calculateProgress()
        }
    },

    {
        path: '/check/full/setup/devices/stations',
        name: 'full-setup-devices-stations',
        component: FullCheck,
        meta: {
            next: '/check/full/setup/appliances',
            prev: '/check/full/setup/devices/tablets',
            progress: calculateProgress()
        }
    },

    //Appliance Route
    {
        path: '/check/full/setup/appliances',
        name: 'full-setup-appliances',
        component: TheAppliances,
        meta: {
            addComment: true,
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/hardware/battery/cabinet',
            prev: '/check/full/setup/devices/stations',
            progress: calculateProgress()
        }
    },

    ...generateRoutesFromObjectArray(HARDWARE, '/check/full/setup/appliances', '/check/full/hardware/report'),

    //HARDWARE REPORT
    {
        path: '/check/full/hardware/report',
        name: 'full-hardware-report',
        component: BasicReport,
        meta: {
            page: "hardware",
            description: "Physical checks of Lab hardware",
            next: '/check/full/network/network_checks',
            prev: getLastRoute(HARDWARE),
            progress: calculateProgress()
        }
    },

    {
        path: '/check/full/network/network_checks',
        name: 'full-network-network_checks',
        component: BasicAutoCheck,
        meta: {
            parent: 'network',
            checkType: 'network_checks',
            addComment: true,
            next: getFirstRoute(NETWORK),
            prev: '/check/full/hardware/report',
            progress: calculateProgress()
        }
    },
    ...generateRoutesFromObjectArray(NETWORK, '/check/full/network/network_checks', '/check/full/network/report'),
    {
        // todo IPv4 settings
    },
    {
        // todo network checks from matt's notion, also station can access heroku, nuc can access heroku, cbus script id is correct
    },

    //NETWORK REPORT
    {
        path: '/check/full/network/report',
        name: 'full-network-report',
        component: BasicReport,
        meta: {
            page: "network",
            description: "TODO write something in checkRoutes",
            next: '/check/full/windows/windows_checks',
            prev: '/check/full/network/network_checks',
            progress: calculateProgress()
        }
    },

    //Manually add the automatic routes between the necessary checks
    {
        // todo - WOL -> Wake on magic packet
        // todo - date time to be manual when offline
        path: '/check/full/windows/windows_checks',
        name: 'full-windows-windows_checks',
        component: BasicAutoCheck,
        meta: {
            parent: 'windows',
            checkType: 'windows_checks',
            addComment: true,
            next: getFirstRoute(WINDOWS),
            prev: '/check/full/network/report',
            progress: calculateProgress()
        }
    },
    ...generateRoutesFromObjectArray(WINDOWS, '/check/full/windows/windows_checks',  '/check/full/windows/report'),

    //WINDOWS REPORT
    {
        path: '/check/full/windows/report',
        name: 'full-windows-report',
        component: BasicReport,
        meta: {
            page: "windows",
            description: "TODO write something in checkRoutes",
            next: '/check/full/security/security_checks',
            prev: getLastRoute(WINDOWS),
            progress: calculateProgress()
        }
    },

    // todo for security - projector is not default
    // todo - bring the auto tablet checks in here
    {
        path: '/check/full/security/security_checks',
        name: 'full-security-security_checks',
        component: BasicAutoCheck,
        meta: {
            parent: 'security',
            checkType: 'security_checks',
            addComment: true,
            next: getFirstRoute(SECURITY),
            prev: '/check/full/windows/report',
            progress: calculateProgress()
        }
    },
    ...generateRoutesFromObjectArray(SECURITY, '/check/full/security/security_checks',  '/check/full/security/report'),

    //SECURITY REPORT
    {
        path: '/check/full/security/report',
        name: 'full-security-report',
        component: BasicReport,
        meta: {
            page: "security",
            description: "TODO write something in checkRoutes",
            next: '/check/full/software/software_checks',
            prev: getLastRoute(SECURITY),
            progress: calculateProgress()
        }
    },

    {
        path: '/check/full/software/software_checks',
        name: 'full-software-software_checks',
        component: BasicAutoCheck,
        meta: {
            parent: 'software',
            checkType: 'software_checks',
            addComment: true,
            next: '/check/full/software/steam_config_checks',
            prev: '/check/full/security/report',
            progress: calculateProgress()
        }
    },
    {
        path: '/check/full/software/steam_config_checks',
        name: 'full-software-steam_config_checks',
        component: BasicAutoCheck,
        meta: {
            parent: 'software',
            checkType: 'steam_config_checks',
            addComment: true,
            next: getFirstRoute(SOFTWARE),
            prev: '/check/full/software/software_checks',
            progress: calculateProgress()
        }
    },
    ...generateRoutesFromObjectArray(SOFTWARE, '/check/full/software/steam_config_checks',  '/check/full/software/report'),

    //SOFTWARE REPORT
    {
        path: '/check/full/software/report',
        name: 'full-software-report',
        component: BasicReport,
        meta: {
            page: "software",
            description: "TODO write something in checkRoutes",
            next: '/check/full/imvr/experience_checks',
            prev: getLastRoute(SOFTWARE),
            progress: calculateProgress()
        }
    },

    {
        // todo - block this behind IMVR connection
        // todo - headset, base station and controller firmware, each station can detect two controllers, headset connection
        path: '/check/full/imvr/experience_checks', // todo this full thing
        name: 'full-imvr-experience_checks',
        component: TheIMVR,
        meta: {
            page: 'experience_checks',
            parent: 'imvr',
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/imvr/imvr_checks',
            prev: getLastRoute(SOFTWARE),
            progress: calculateProgress()
        }
    },
    {
        path: '/check/full/imvr/imvr_checks',
        name: 'full-imvr-imvr_checks',
        component: BasicAutoCheck,
        meta: {
            parent: 'imvr',
            checkType: 'imvr_checks',
            addComment: true,
            next: getFirstRoute(IMVR),
            prev: '/check/full/imvr/experience_checks',
            progress: calculateProgress()
        }
    },
    ...generateRoutesFromObjectArray(IMVR, '/check/full/imvr/imvr_checks',  "/check/full/overall/report"),
    // todo - decide if needed - manual leadme labs ux checks
    // todo export and upload, including all json files

    //IMVR REPORT
    {
        path: '/check/full/imvr/report',
        name: 'full-imvr-report',
        component: BasicReport,
        meta: {
            page: "imvr",
            description: "TODO write something in checkRoutes",
            next: '/check/full/overall/report',
            prev: getLastRoute(IMVR),
            progress: calculateProgress()
        }
    },

    //OVERALL REPORT
    {
        path: '/check/full/overall/report',
        name: 'full-overall-report',
        component: OverallReport,
        meta: {
            page: "overall",
            description: "TODO write something in checkRoutes",
            next: '/check/full/overall/submit',
            prev: '/check/full/imvr/report',
            progress: calculateProgress()
        }
    },

    //SUBMIT REPORT
    {
        path: '/check/full/overall/submit',
        name: 'full-overall-submit',
        component: FinaliseReport,
        meta: {
            next: '/check/full/overall/download',
            prev: '/check/full/overall/report'
        }
    },

    //DOWNLOAD REPORT
    {
        path: '/check/full/overall/download',
        name: 'full-overall-download',
        component: FinaliseReport,
        meta: {
            next: '',
            prev: '/check/full/overall/submit'
        }
    }
];
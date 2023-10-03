import QuickCheck from "@renderer/tool-qa/screens/QuickCheck.vue";
import FullCheck from "@renderer/tool-qa/screens/FullCheck.vue";
import TheAppliances from "@renderer/tool-qa/components/fullCheck/Appliances/TheAppliances.vue";
import ManualCheck from "@renderer/tool-qa/components/fullCheck/screens/ManualCheck.vue";
import {HARDWARE, IMVR, NETWORK, SECURITY, SOFTWARE, WINDOWS} from "../assets/checks/_fullcheckValues";
import { CheckObject, Route } from "../tool-qa/interfaces/_routeItems";
import TheIMVR from "../tool-qa/components/fullCheck/screens/TheIMVR.vue";
import BasicAutoCheck from "../tool-qa/components/fullCheck/BasicAutoCheck.vue";

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
            const path = `/check/full/hardware/${section.page}/${categoryName.toLowerCase()}`;
            const name = `full-hardware-${section.page}-${categoryName.toLowerCase()}`;

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
                    progress: 0,
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
        return `/check/full/hardware/${checkArray[checkIndex].page.toLowerCase()}/${nextCategoryKey.toLowerCase()}`;
    } else if (checkIndex < checkArray.length - 1) {
        const nextHardware = checkArray[checkIndex + 1];
        const nextCategory = nextHardware.category[0];
        const nextCategoryKey = Object.keys(nextCategory)[0];
        return `/check/full/hardware/${checkArray[checkIndex + 1].page.toLowerCase()}/${nextCategoryKey.toLowerCase()}`;
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
        return `/check/full/hardware/${checkArray[checkIndex].page.toLowerCase()}/${prevCategoryKey.toLowerCase()}`;
    } else if (checkIndex > 0) {
        const prevHardware = checkArray[checkIndex - 1];
        const prevCategory = prevHardware.category[prevHardware.category.length - 1];
        const prevCategoryKey = Object.keys(prevCategory)[0];
        return `/check/full/hardware/${checkArray[checkIndex - 1].page.toLowerCase()}/${prevCategoryKey.toLowerCase()}`;
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
    return `/check/full/hardware/${firstRoute.page}/${Object.keys(firstRoute.category[0])[0].toLowerCase()}`;
}

/**
 * Retrieves the last path based on a navigation object.
 * @param checkArray - An array of navigation objects.
 * @returns string, The last path for navigation.
 */
const getLastRoute = (checkArray: CheckObject[]) => {
    const lastRoute = checkArray[checkArray.length - 1];
    return `/check/full/hardware/${lastRoute.page}/${Object.keys(lastRoute.category[lastRoute.category.length - 1])[0].toLowerCase()}`;
}

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
            next: '/check/full/hardware/battery/cabinet',
            prev: '/check/full',
            progress: 0
        }
    },

    ...generateRoutesFromObjectArray(HARDWARE, '/check/full/appliances', getFirstRoute(NETWORK)),
    //Manually add the automatic routes between the necessary checks
    {
        path: '/check/full/windows/auto',
        name: 'full-imvr-experiences',
        component: BasicAutoCheck,
        meta: {
            checkType: 'windows_checks',
            addComment: true,
            userInput: true,
            canSkip: true,
            next: getFirstRoute(NETWORK),
            prev: getLastRoute(HARDWARE),
            progress: 0
        }
    },
    ...generateRoutesFromObjectArray(NETWORK, getLastRoute(HARDWARE),  getFirstRoute(WINDOWS)),
    ...generateRoutesFromObjectArray(WINDOWS, getLastRoute(NETWORK),  getFirstRoute(SECURITY)),
    ...generateRoutesFromObjectArray(SECURITY, getLastRoute(WINDOWS),  getFirstRoute(SOFTWARE)),
    ...generateRoutesFromObjectArray(SOFTWARE, getLastRoute(SECURITY),  '/check/full/imvr/experiences'),
    {
        path: '/check/full/imvr/experiences',
        name: 'full-imvr-experiences',
        component: TheIMVR,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: getFirstRoute(IMVR),
            prev: getLastRoute(SOFTWARE),
            progress: 0
        }
    },
    ...generateRoutesFromObjectArray(IMVR, '/check/full/imvr/experiences',  ""),
];
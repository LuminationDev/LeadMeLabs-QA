import ManualCheck from "../../screens/checks/ManualCheck.vue";
import TheIMVR from "../../screens/imvr/TheIMVR.vue";
import BasicAutoCheck from "../../screens/checks/AutoCheck.vue";
import BasicReport from "../../screens/report/results/BasicReport.vue";
import TheOverallReport from "../../screens/report/TheOverallReport.vue";
import TheFinaliseReport from "../components/screens/TheFinaliseReport.vue";
import TheExperienceCheck from "../components/screens/TheExperienceCheck.vue";
import { IMVR } from "../../assets/checks/_fullcheckValues";
import { CheckObject, Route } from "../../interfaces/_routeItems";
import TheDetails from "../../screens/setup/TheDetails.vue";

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
    return Math.floor(++currentProgress/10 * 100);
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
            const path = `/experiences/${section.parent}/${section.page}/${categoryName.toLowerCase()}`;
            const name = `experiences-${section.parent}-${section.page}-${categoryName.toLowerCase()}`;

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
        return `/experiences/${checkArray[checkIndex].parent}/${checkArray[checkIndex].page.toLowerCase()}/${nextCategoryKey.toLowerCase()}`;
    } else if (checkIndex < checkArray.length - 1) {
        const nextHardware = checkArray[checkIndex + 1];
        const nextCategory = nextHardware.category[0];
        const nextCategoryKey = Object.keys(nextCategory)[0];
        return `/experiences/${checkArray[checkIndex].parent}/${checkArray[checkIndex + 1].page.toLowerCase()}/${nextCategoryKey.toLowerCase()}`;
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
        return `/experiences/${checkArray[checkIndex].parent}/${checkArray[checkIndex].page.toLowerCase()}/${prevCategoryKey.toLowerCase()}`;
    } else if (checkIndex > 0) {
        const prevHardware = checkArray[checkIndex - 1];
        const prevCategory = prevHardware.category[prevHardware.category.length - 1];
        const prevCategoryKey = Object.keys(prevCategory)[0];
        return `/experiences/${checkArray[checkIndex].parent}/${checkArray[checkIndex - 1].page.toLowerCase()}/${prevCategoryKey.toLowerCase()}`;
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
    return `/experiences/${firstRoute.parent}/${firstRoute.page}/${Object.keys(firstRoute.category[0])[0].toLowerCase()}`;
}

/**
 * Retrieves the last path based on a navigation object.
 * @param checkArray - An array of navigation objects.
 * @returns string, The last path for navigation.
 */
const getLastRoute = (checkArray: CheckObject[]) => {
    const lastRoute = checkArray[checkArray.length - 1];
    return `/experiences/${lastRoute.parent}/${lastRoute.page}/${Object.keys(lastRoute.category[lastRoute.category.length - 1])[0].toLowerCase()}`;
}

/**
 * Routes used for the Experience Launcher
 */
export const experienceRoutes = [
    {
        path: '/experiences/setup/details',
        name: 'experiences-setup-devices-details',
        component: TheDetails,
        meta: {
            next: '/experiences/setup/devices/nuc',
            prev: '/',
            userInput: true,
            progress: calculateProgress()
        }
    },
    {
        path: '/experiences/setup/devices/nuc',
        name: 'experiences-setup-devices-nuc',
        component: TheExperienceCheck,
        meta: {
            next: '/experiences/setup/devices/stations',
            prev: '/experiences/setup/details',
            userInput: true,
            canSkip: true,
            progress: calculateProgress()
        }
    },
    {
        path: '/experiences/setup/devices/stations',
        name: 'experiences-setup-devices-stations',
        component: TheExperienceCheck,
        meta: {
            next: '/experiences/imvr/pre_experience_checks',
            prev: '/experiences/setup/devices/nuc',
            progress: calculateProgress()
        }
    },

    {
        path: '/experiences/imvr/pre_experience_checks',
        name: 'experiences-imvr-pre_experience_checks',
        component: TheIMVR,
        meta: {
            page: 'pre_experience_checks',
            parent: 'imvr',
            addComment: true,
            canSkip: true,
            next: '/experiences/imvr/experience_checks',
            prev: '/experiences/setup/devices/stations',
            progress: calculateProgress()
        }
    },
    {
        path: '/experiences/imvr/experience_checks',
        name: 'experiences-imvr-experience_checks',
        component: TheIMVR,
        meta: {
            page: 'experience_checks',
            parent: 'imvr',
            addComment: true,
            canSkip: true,
            next: '/experiences/imvr/imvr_checks',
            prev: '/experiences/imvr/pre_experience_checks',
            progress: calculateProgress()
        }
    },
    {
        path: '/experiences/imvr/imvr_checks',
        name: 'experiences-imvr-imvr_checks',
        component: BasicAutoCheck,
        meta: {
            parent: 'imvr',
            checkType: 'imvr_checks',
            addComment: true,
            next: getFirstRoute(IMVR),
            prev: '/experiences/imvr/experience_checks',
            progress: calculateProgress()
        }
    },
    ...generateRoutesFromObjectArray(IMVR, '/experiences/imvr/imvr_checks',  '/experiences/imvr/report'),

    //IMVR REPORT
    {
        path: '/experiences/imvr/report',
        name: 'experiences-imvr-report',
        component: BasicReport,
        meta: {
            page: "imvr",
            description: "TODO write something in checkRoutes",
            next: "/experiences/overall/report",
            prev: getLastRoute(IMVR),
            progress: calculateProgress()
        }
    },

    //OVERALL REPORT
    {
        path: '/experiences/overall/report',
        name: 'experiences-overall-report',
        component: TheOverallReport,
        meta: {
            page: "overall",
            description: "TODO write something in checkRoutes",
            next: '/experiences/overall/submit',
            prev: '/experiences/imvr/report',
            progress: calculateProgress()
        }
    },

    //SUBMIT REPORT
    {
        path: '/experiences/overall/submit',
        name: 'experiences-overall-submit',
        component: TheFinaliseReport,
        meta: {
            next: '/experiences/overall/download',
            prev: '/experiences/overall/report'
        }
    },

    //DOWNLOAD REPORT
    {
        path: '/experiences/overall/download',
        name: 'experiences-overall-download',
        component: TheFinaliseReport,
        meta: {
            next: '',
            prev: '/experiences/overall/submit'
        }
    }
];

import * as FULL from '../assets/checks/_fullcheckValues';
import { useFullStore } from "./store/fullStore";
import { useStateStore } from "../store/stateStore";
import { QaCheckResult } from "../types/_qaCheckResult";
import { ALL_VALUES, HANDOVER } from "../assets/checks/_fullcheckValues";

let fullStore: any;
let stateStore: any;

export const initialiseStores = () => {
    stateStore = useStateStore();
    fullStore = useFullStore();
}

export const initialiseFullReport = () => {
    populateFullReportTrackerWithManualChecks();
    fullStore.buildQaList();
    populateFullReportTrackerWithAutoChecks();
}

/**
 * Run through each of the automatic checks in each section. Adding the required details and target devices to the
 * fullStore.reportTracker. The specific devices are then added on the auto check page when the results come in.
 */
const populateFullReportTrackerWithAutoChecks = () => {
    fullStore.qaGroups
        .forEach(group => {
            if (group.section !== null) {
                group.checks.forEach(check => {
                    const targetDevices = determineTargetDevices(check);
                    const checkItems = {key: check.id, description: check.extendedDescription}
                    fullStore.addCheckToReportTracker(group.section, group.id, checkItems, targetDevices);
                });
            }
        });
}

const determineTargetDevices = (check: QaCheckResult) => {
    return {
        "station": check.targets['station'],
        "tablet": check.targets['tablet'],
        "nuc": check.targets['nuc'],
        "cbus": check.targets['cbus']
    };
};

/**
 * Populate the fullStore.reportTracker with the basic sections and categories as laid out in the _fullcheckValues.ts
 * The individual checks will be added when that page is visited. If no checks are present in a section or category it
 * is considered skipped.
 */
export const populateFullReportTrackerWithManualChecks = () => {
    if (fullStore.reportTracker["labType"] === "Offline") {
        HANDOVER.category[0]['Handover details'].checks["Timezone"] = {
            description: "Has the time zone been set to the correct location.",
            guide: [
                {
                    imageSource: null,
                    text: '<h3>Open Settings</h3><p>Check the timezone dropdown.</p>'
                }
            ]
        }

        HANDOVER.category[0]['Handover details'].checks["Date time"] = {
            description: "Is the date and time set correctly.",
            guide: [
                {
                    imageSource: null,
                    text: '<h3>Open Settings</h3><p>Check the current date and time section.</p>'
                }
            ]
        }
    }

    for (const { parent, page, category } of ALL_VALUES.flat()) {
        fullStore.reportTracker[parent] ??= {};
        fullStore.reportTracker[parent][page] ??= {};

        for (const subCategory of category) {
            const checks = Object.entries(subCategory[Object.keys(subCategory)[0]].checks);

            for (const [check, { description }] of checks) {
                fullStore.reportTracker[parent][page][check] ??= {
                    description,
                    comments: [],
                    targets: subCategory[Object.keys(subCategory)[0]].targets,
                    devices: {}
                };
            }
        }
    }
};

export const addReportComment = (comment: string, parent: string, page: string, checkType: string) => {
    const sectionName = parent; //Auto check
    const pageName: string = page || checkType;

    if (!sectionName && !pageName) {
        return; // Neither sectionName nor pageName is defined
    }

    const key = sectionName || FULL[pageName?.toUpperCase()]?.parent; //Manual check

    if (key) {
        const section = fullStore.reportTracker[key][<string>pageName];
        section['comments'] ||= [];
        section['comments'].push({ date: stateStore.formattedDate(true), content: comment });
    }
}

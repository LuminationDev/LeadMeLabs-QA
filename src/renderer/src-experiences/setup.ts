import * as FULL from '../assets/checks/_fullcheckValues';
import { useExperienceStore } from "./store/experienceStore";
import { useStateStore } from "../store/stateStore";
import { QaCheckResult } from "./types/_qaCheckResult";
import { IMVR } from "../assets/checks/_fullcheckValues";

let stateStore: any;
let experienceStore: any;

export const initialiseStores = () => {
    stateStore = useStateStore();
    experienceStore = useExperienceStore();
}

export const initialiseExperienceReport = () => {
    populateExperienceReportTrackerWithAutoChecks();
    experienceStore.buildQaList();
    populateExperienceReportTrackerWithManualChecks();
}

/**
 * Run through each of the automatic checks in each section. Adding the required details and target devices to the
 * fullStore.reportTracker. The specific devices are then added on the auto check page when the results come in.
 */
const populateExperienceReportTrackerWithAutoChecks = () => {
    experienceStore.qaGroups
        .forEach(group => {
            if (group.section !== null) {
                group.checks.forEach(check => {
                    const targetDevices = determineTargetDevices(check);
                    const checkItems = {key: check.id, description: check.extendedDescription}
                    experienceStore.addCheckToReportTracker(group.section, group.id, checkItems, targetDevices);
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
export const populateExperienceReportTrackerWithManualChecks = () => {
    for (const { parent, page, category } of IMVR.flat()) {
        experienceStore.reportTracker[parent] ??= {};
        experienceStore.reportTracker[parent][page] ??= {};

        for (const subCategory of category) {
            const checks = Object.entries(subCategory[Object.keys(subCategory)[0]].checks);

            for (const [check, { description }] of checks) {
                experienceStore.reportTracker[parent][page][check] ??= {
                    description,
                    comments: [],
                    targets: subCategory[Object.keys(subCategory)[0]].targets,
                    devices: {}
                };
            }
        }
    }
};

export const addExperienceComment = (comment: string, parent: string, page: string, checkType: string) => {
    const sectionName = parent; //Auto check
    const pageName: string = page || checkType;

    if (!sectionName && !pageName) {
        return; // Neither sectionName nor pageName is defined
    }

    const key = sectionName || FULL[pageName?.toUpperCase()]?.parent; //Manual check

    if (key) {
        const section = experienceStore.reportTracker[key][<string>pageName];
        section['comments'] ||= [];
        section['comments'].push({ date: stateStore.formattedDate(true), content: comment });
    }
}

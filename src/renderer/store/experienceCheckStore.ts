import { defineStore } from "pinia";
import { useStateStore } from "./stateStore";
import { ExperienceDetails } from "../interfaces/_experienceDetails";
import { ExperienceCheck } from "../interfaces/_experiences";
import * as CONSTANT from "../assets/constants";

export const useExperienceCheckStore = defineStore({
    id: 'experienceCheck',
    state: () => ({
        allowRunningExperienceChecks: false,
        experienceErrors: Array<ExperienceCheck>(),
        experienceChecks: Array<ExperienceCheck>(),
        experiences: CONSTANT.EXPERIENCES.experiences,
        onlineExperiences: CONSTANT.EXPERIENCES.onlineExperiences
    }),
    actions: {
        /**
         * Check a Station's installed experiences for errors, these can be extra experiences that are installed and not
         * on the tier list or experiences that are missing that should be installed.
         */
        checkExperiencesForErrors(stationId: string, installedExperiences: string, noLicenseApplications: string, blockedFamilyMode: string) {
            if (installedExperiences === null || installedExperiences.length === 0) {
                console.log("Experiences not collected!");
                return;
            }

            //If the station is not in VR mode return
            if(!this.shouldStationBeVrCompatible(stationId)) return;

            //Build the expected experience list
            let expectedExperiences = this.experiences;
            // @ts-ignore
            if (useStateStore().getStore.reportTracker["labType"] === "Online") {
                expectedExperiences.push(...this.onlineExperiences);
            }

            //Check for unexpected experiences
            const jsonExperiences: ExperienceDetails[] = JSON.parse(installedExperiences);
            jsonExperiences.forEach((experience: ExperienceDetails) => {
                if (!experience) {
                    return;
                }

                if (experience.WrapperType === "Launcher") return;

                const isExpected = expectedExperiences.some(expected => expected.id === parseInt(experience.Id));
                if (isExpected) return;

                const station = { id: stationId, status: "pending", checkingStatus: "timeout", message: "Not expected" };
                const updatedTitle = experience.Name.replace(/^"(.*)"$/, '$1'); //Remove the leading and trailing quotes (")
                this.addOrUpdateError(this.experienceErrors, parseInt(experience.Id), updatedTitle, station);
            });

            //Check for experiences with no license or blocked by family mode before saying they are not installed
            let jsonNoLicenses: string[] = [];
            if (noLicenseApplications !== null && noLicenseApplications !== undefined) {
                jsonNoLicenses = JSON.parse(noLicenseApplications);
            }

            let jsonBlockedFamilyMode: string[] = [];
            if (blockedFamilyMode !== null && blockedFamilyMode !== undefined) {
                jsonBlockedFamilyMode = JSON.parse(blockedFamilyMode);
            }

            //Check for not installed experiences
            expectedExperiences.forEach(expected => {
                const isInstalled = jsonExperiences.some(installed => parseInt(installed.Id) === expected.id);
                if (isInstalled) return;

                let message = "Not installed";
                if (jsonNoLicenses.includes(expected.id.toString())) {
                    message = "No license";
                }
                if (jsonBlockedFamilyMode.includes(expected.id.toString())) {
                    message = "Blocked by family mode"
                }

                const station = { id: stationId, status: "pending", checkingStatus: "timeout", message };
                this.addOrUpdateError(this.experienceErrors, expected.id, expected.title, station);
            });

            this.experienceErrors = this.sortExperiences(this.experienceErrors);
        },

        /**
         * Add of update an entry in the experienceErrors array.
         */
        addOrUpdateError(errors: Array<ExperienceCheck>, id: number, title: string, station) {
            const index = errors.findIndex(error => error.id === id);

            if (index === -1) {
                errors.push({ id, title, stations: [station] });
            } else {
                const stationIndex = errors[index].stations.findIndex(stationEntry => stationEntry.id === station.id);
                if (stationIndex !== -1) {
                    errors[index].stations[stationIndex] = station;
                } else {
                    errors[index].stations.push(station);
                }
            }
        },

        /**
         * Update the experienceChecks array with any errors that were found when the installedAppliances for each
         * station were received from the NUC.
         */
        updateExperienceChecksWithErrors() {
            this.experienceErrors.forEach(experienceError => {
                const checkIndex = this.experienceChecks.findIndex(entry => entry.id == experienceError.id);
                experienceError.stations.forEach(station => {
                    useStateStore().getStore.addCheckToReportTracker("imvr", "pre_experience_checks",
                        {
                            key: experienceError.title,
                            description: ""
                        },
                        {
                            "station": true,
                            "tablet": false,
                            "nuc": false,
                            "cbus": false
                        });

                    useStateStore().getStore.updateReport(
                        "imvr",
                        "pre_experience_checks",
                        { passedStatus: "warning", checkingStatus: "timeout", message: station.message },
                        experienceError.title,
                        station.id);

                    if (checkIndex === -1) return;
                    const foundStation = this.experienceChecks[checkIndex].stations.find(entry => entry.id === station.id.toString());
                    if (!foundStation) return;

                    foundStation.status = "failed";
                    foundStation.checkingStatus = "checked";
                    foundStation.message = station.message;
                });
            });
        },

        sortExperiences(experienceList: any[]) {
            return experienceList.sort((a, b) => {
                const titleA = a.title.toLowerCase().replace(/^the /, ''); // Convert titles to lowercase for case-insensitive sorting
                const titleB = b.title.toLowerCase().replace(/^the /, '');

                if (titleA < titleB) {
                    return -1;
                } else if (titleA > titleB) {
                    return 1;
                } else {
                    return 0; // Titles are equal
                }
            });
        },

        buildExperienceChecks() {
            let stationIds = useStateStore().getStore.stations.map(station => station.getId())

            let sortedExperiences = this.experiences;
            // @ts-ignore
            if (useStateStore().getStore.reportTracker["labType"] === "Online") {
                sortedExperiences.push(...this.onlineExperiences);
            }
            sortedExperiences = this.sortExperiences(sortedExperiences);

            //Add the experiences to the reportTracker
            sortedExperiences.forEach(experience => {
                useStateStore().getStore.addCheckToReportTracker("imvr", "experience_checks",
                    {
                        key: experience.title,
                        description: ""
                    },
                    {
                        "station": true,
                        "tablet": false,
                        "nuc": false,
                        "cbus": false
                    });

                let stations = Array<any>()
                stationIds.forEach(stationId => {
                    if(!this.isStationVrCompatible(stationId)) return;

                    stations.push({
                        id: stationId,
                        status: null,
                        checkingStatus: "unchecked",
                        message: null
                    })
                });

                const index = this.experienceChecks.findIndex(entry => entry.id === experience.id);
                if(index === -1) {
                    this.experienceChecks.push({
                        id: experience.id,
                        title: experience.title,
                        stations: stations
                    });
                }
            });
        },

        startExperienceChecks() {
            this.allowRunningExperienceChecks = true
            if (this.experienceChecks.length === 0) {
                this.buildExperienceChecks()
            }
            this.experienceChecks[0].stations.forEach(station => {
                const index = useStateStore().getStore.stations.findIndex(s => s.id === station.id)
                //Do not attempt to run an experience if the Station is not a VR station
                if(!this.isStationVrCompatible(station.id)) return;

                if (index !== -1 && useStateStore().getStore.stations[index].vrStatuses?.openVrStatus === 'Connected') {
                    this.launchNextExperience(station.id)
                }
            })
        },

        launchNextExperience(stationId: string) {
            //find the next unpassed one
            let nextStationIndex = -1
            const alreadyChecking = (this.experienceChecks.findIndex(element => {
                nextStationIndex = element.stations.findIndex(element => element.id == stationId)
                if (nextStationIndex === -1) return false

                return element.stations[nextStationIndex].checkingStatus === "checking"
            }) !== -1)
            if (alreadyChecking) {
                return
            }
            const nextCheckIndex = this.experienceChecks.findIndex(element => {
                nextStationIndex = element.stations.findIndex(element => element.id == stationId)
                if (nextStationIndex === -1) return false

                return element.stations[nextStationIndex].checkingStatus === "unchecked"
            })

            const i = useStateStore().getStore.stations.findIndex(s => (s.getId() == stationId) && s.vrStatuses && s.vrStatuses.openVrStatus === "Connected" && s.vrStatuses.headsetStatus === "Connected")
            if (i === -1) {
                return;
            }

            this.launchExperience(nextCheckIndex, nextStationIndex)
        },

        launchExperienceOnAll(experienceIndex: number) {
            var stationIndex = 0
            this.experienceChecks[experienceIndex].stations.forEach(() => {
                this.launchExperience(experienceIndex, stationIndex)
                stationIndex++
            })
        },

        launchExperience(experienceIndex: number, stationIndex: number) {
            if (experienceIndex === -1 || stationIndex === -1) {
                return;
            }
            this.experienceChecks[experienceIndex].stations[stationIndex].checkingStatus = "checking"

            setTimeout(() => {
                useStateStore().sendMessage({
                    action: CONSTANT.ACTION.LAUNCH_EXPERIENCE,
                    actionData: {
                        stationId: this.experienceChecks[experienceIndex].stations[stationIndex].id,
                        experienceId: this.experienceChecks[experienceIndex].id
                    }
                })
            }, 3000)
            setTimeout(() => {
                if (this.experienceChecks[experienceIndex].stations[stationIndex].checkingStatus === 'checking') {
                    this.updateExperienceCheck(this.experienceChecks[experienceIndex].stations[stationIndex].id, this.experienceChecks[experienceIndex].id.toString(), "failed", "Timed out waiting for response")
                }
            }, 55000 + 3000)
        },

        updateExperienceCheck(stationId: string, experienceId: string, status: string, message: string) {
            const index = this.experienceChecks.findIndex(element => element.id.toString() == experienceId);
            if (index === -1) {
                return;
            }
            const stationIndex = this.experienceChecks[index].stations.findIndex(element => element.id == stationId);
            if (index === -1) {
                return;
            }
            this.experienceChecks[index].stations[stationIndex].status = status
            this.experienceChecks[index].stations[stationIndex].message = message

            //Update the report tracker
            useStateStore().getStore.updateReport(
                "imvr",
                "experience_checks",
                { passedStatus: status, message: message },
                this.experienceChecks[index].title,
                stationId);

            if (message.includes('Timed out')) {
                this.experienceChecks[index].stations[stationIndex].checkingStatus = "timeout";
            } else if (status === "passed" || status === "failed" || status === "warning") {
                this.experienceChecks[index].stations[stationIndex].checkingStatus = "checked";
            }

            if (!this.allowRunningExperienceChecks) {
                return;
            }

            this.launchNextExperience(stationId);
        },

        /**
         * Check if a Station is set to VR mode and has sent confirmation of it's details.
         * @param stationId
         */
        isStationVrCompatible(stationId: string): boolean {
            //If the station is not in VR mode return
            const index = useStateStore().getStore.stations.findIndex(element => element.getId() == stationId)
            if (index === -1) return false; //Station does not exist - do not continue regardless
            const station = useStateStore().getStore.stations[index];

            return !(station.details == null || station.details.stationMode !== "vr");
        },

        /**
         * Check if a Station should be set to VR mode.
         * @param stationId
         */
        shouldStationBeVrCompatible(stationId: string): boolean {
            //If the station is not in VR mode return
            const index = useStateStore().getStore.stations.findIndex(element => element.getId() == stationId)
            if (index === -1) return false; //Station does not exist - do not continue regardless
            const station = useStateStore().getStore.stations[index];

            return !(station.expectedDetails == null || station.expectedDetails.stationMode !== "vr");
        }
    },
    getters: {
        experienceChecksCompleted(state) {
            return state.experienceChecks.filter(check => {
                return check.stations.filter(station => station.checkingStatus !== 'checking' && station.status !== null).length === 0
            }).length === 0
        },
    }
});

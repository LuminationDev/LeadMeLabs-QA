import { defineStore } from 'pinia'
import {Blind, LedRing, Light, EpsonProjector, Room, Scene, Station, Splicer, PanasonicProjector} from '../models'
import { objectGenerator } from '../components/helpers/helper'
import CbusInterface from '../models/_cbus_interface'
import ApplianceInterface from '../models/_appliance_interface'
import ProjectorAppliance from '../models/_projector_appliance'
import idGenerator from '../components/helpers/idGenerator'
import Appliance from "../models/_appliance";
import SourceInterface from "../models/_source_interface";

export function isIncompleteGenericAppliance(appliance: ApplianceInterface): boolean {
    return !appliance.name || !appliance.room || !appliance.id || appliance.id <= 0
}

export function isIncompleteCbusAppliance(appliance: CbusInterface): boolean {
    return (
        isIncompleteGenericAppliance(appliance) ||
        !appliance.automationGroup ||
        appliance.automationGroup <= 0 ||
        !!(appliance.id && appliance.id < 1000000)
    ) // auto-generated id means not completed
}

export function isIncompleteEpsonAppliance(appliance: ProjectorAppliance): boolean {
    return isIncompleteGenericAppliance(appliance) || !appliance.ipAddress
}

export function isIncompleteRoom(room: Room): boolean {
    return !room.name || !room.id || room.id <= 0
}

export function isIncompleteStation(station: Station): boolean {
    return (
        !station.name ||
        !station.room ||
        !station.id ||
        !station.ip_address ||
        !station.mac_address ||
        !station.led_ring_id
    )
}

export function isIncompleteScene(scene: Scene): boolean {
    return isIncompleteCbusAppliance(scene) // todo - revisit this
}

export const useLabStore = defineStore({
    id: 'lab',
    state: () => ({
        rooms: [] as Room[],
        stations: [] as Station[],
        lights: [] as Light[],
        blinds: [] as Blind[],
        projectors: [] as ProjectorAppliance[],
        splicers: [] as Splicer[],
        sources: [] as SourceInterface[],
        ledRings: [] as LedRing[],
        scenes: [] as Scene[],
        trimmed: true as boolean,
        currentlyEditingAppliance: false,
        fetchingId: false
    }),

    getters: {
        getAllObject: (state) => {
            return {
                ...state.lights,
                ...state.projectors,
                ...state.scenes,
                ...state.blinds,
                ...state.stations,
                ...state.sources,
                ...state.rooms
            }
        },
        getCompletedStatus(state): any {
            return {
                lights: {
                    valid:
                        state.lights.filter((light) => isIncompleteCbusAppliance(light)).length <=
                        0,
                    count: state.lights.length
                },
                blinds: {
                    valid:
                        state.blinds.filter((blind) => isIncompleteCbusAppliance(blind)).length <=
                        0,
                    count: state.blinds.length
                },
                projectors: {
                    valid:
                        state.projectors.filter((projector) =>
                            isIncompleteEpsonAppliance(projector)
                        ).length <= 0,
                    count: state.projectors.length
                },
                splicers: {
                    valid:
                        state.splicers.filter((splicer) => isIncompleteCbusAppliance(splicer))
                            .length <= 0,
                    count: state.splicers.length
                },
                sources: {
                    valid:
                        state.sources.filter((source) => isIncompleteEpsonAppliance(source))
                            .length <= 0,
                    count: state.sources.length
                },
                ledRings: {
                    valid:
                        state.ledRings.filter((ledRing) => isIncompleteCbusAppliance(ledRing))
                            .length <= 0,
                    count: state.ledRings.length
                },
                rooms: {
                    valid: state.rooms.filter((room) => isIncompleteRoom(room)).length <= 0,
                    count: state.rooms.length
                },
                scenes: {
                    valid: state.scenes.filter((scene) => isIncompleteScene(scene)).length <= 0,
                    count: state.scenes.length
                },
                stations: {
                    valid:
                        state.stations.filter((station) => isIncompleteStation(station)).length <=
                        0,
                    count: state.stations.length
                }
            }
        },
        getApplianceCountInRoom: (state) => {
            return (type, room): number => {
                let appliances: Appliance[] = []
                switch (type) {
                    case 'lights':
                        appliances = state.lights
                        break
                    case 'ledRings':
                        appliances = state.ledRings
                        break
                    case 'projectors':
                        appliances = state.projectors
                        break
                    case 'sources':
                        appliances = state.sources
                        break
                    case 'stations':
                        appliances = state.stations
                        break
                    case 'scenes':
                        appliances = state.scenes
                        break
                    case 'blinds':
                        appliances = state.blinds
                        break
                    case 'splicers':
                        appliances = state.splicers
                        break
                }

                return appliances.filter((appliance) => {
                    return appliance.room === room
                }).length
            }
        },
        displayState() {
            const finalRes: any = []
            const allTypes: string[] = []
            // @ts-ignore $state exist
            for (const field in this.$state) {
                if (
                    field !== 'trimmed' &&
                    field !== 'rooms' &&
                    field !== 'currentlyEditingAppliance' &&
                    field !== 'fetchingId' &&
                    field !== 'stations'
                ) {
                    allTypes.push(field)
                }
            }
            for (const type of allTypes) {
                if (this[type].length !== 0) {
                    let properType
                    if (type === 'ledRings') {
                        properType = 'LED rings'
                    } else {
                        properType = type
                    }
                    const data = {
                        name: properType,
                        objects: this[type]
                    }
                    finalRes.push(data)
                }
            }

            return JSON.stringify(finalRes, null, 2)
        },
        getStations: (state) => {
            return JSON.stringify(state.stations, null, 2)
        },
        getListOfUsedLedRingId: (state) => {
            const ids: number[] = []
            for (let i = 0; i < state.stations.length; i++) {
                if (
                    !ids.includes(state.stations[i].led_ring_id) &&
                    state.stations[i].led_ring_id != 0
                ) {
                    ids.push(state.stations[i].led_ring_id)
                }
            }
            return ids
        }
    },
    actions: {
        loadJsonToStore(array): void {
            for (let i = 0; i < array.length; i++) {
                let key = array[i]['name']
                if (key === 'LED rings') key = 'ledRings'
                this[key] = array[i]['objects']
                // loop through objects to check room
                this[key].map((object) => {
                    // object.room
                    let newRoom = true
                    if (
                        this.rooms.map((room) => {
                            if (room.name == object.room) {
                                newRoom = false
                            }
                        })
                    )
                        if (newRoom) {
                            const roomObj = {
                                id: this.rooms.length + 1,
                                name: object.room
                            }
                            this.rooms.push(roomObj)
                        }
                })
            }
        },
        async duplicateItem(type: string, index: number) {
            console.log(type + ' ' + index)
            if (type !== 'splicers') {
                const item = Object.assign({}, this[type].slice(index, index + 1)[0])
                const nameSplit = item.name.split(' ')
                if (!isNaN(nameSplit[nameSplit.length -1])) {
                    const num = nameSplit.pop()
                    nameSplit.push(parseInt(num) + 1)
                    item.name = nameSplit.join(' ')
                }
                if (type === 'scenes') {
                    item.sceneId = idGenerator.generateRanId()
                    item.automationValue = item.automationValue + 1
                    item.id = item.sceneId + '' + item.automationValue
                } else {
                    item.id = idGenerator.generateRanId()
                    if (type === 'stations') {
                        item.id = this.stations.length + 1
                    }
                    if (type === 'lights' || type === 'ledRings' || type === 'blinds') {
                        item.automationId = item.automationId + 1
                    }
                }
                const isCbusInformationSet = await window.configApi.isCbusInformationSet()
                if (isCbusInformationSet && item.automationType === 'cbus') {
                    const cbusGeneratedId = await window.configApi.getCbusId(
                        item.automationBase,
                        item.automationGroup,
                        item.automationId
                    )
                    const value = parseInt(cbusGeneratedId)
                    if (value > 0) {
                        if (type === 'scenes') {
                            item.sceneId = parseInt(cbusGeneratedId)
                            item.id = Number(parseInt(cbusGeneratedId) + '' + item.automationValue)
                        } else {
                            item.id = parseInt(cbusGeneratedId)
                        }
                    }
                }
                this[type].splice(index + 1, 0, item)
            } else {
                const splicerIndex = index * 2 // times two because main splicer item exist at index 0,2,4,6 and so on
                const splicerItem = Object.assign(
                    {},
                    this[type].slice(splicerIndex, splicerIndex + 1)[0]
                )
                /**
                 * Deep copy preappliances to the new item
                 */
                splicerItem.preAppliances = [
                    Object.assign(
                        {},
                        //@ts-ignore object exist
                        this[type].slice(splicerIndex, splicerIndex + 1)[0].preAppliances[0]
                    )
                ]
                const nameSplit = splicerItem.name.split(' ')
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore todo
                if (!isNaN(nameSplit[nameSplit.length -1])) {
                    const num = nameSplit.pop()
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore todo
                    nameSplit.push(parseInt(num) + 1)
                    splicerItem.name = nameSplit.join(' ')
                }
                const splicerPower = Object.assign(
                    {},
                    this[type].filter((item) => item.name == splicerItem.name + ' Power')[0]
                )
                splicerItem.name = 'Splicer ' + (this[type].length / 2 + 1)
                splicerPower.name = splicerItem.name + ' Power'
                splicerItem.id = idGenerator.generateRanId()
                const powerId = idGenerator.generateRanId()
                if (splicerItem.preAppliances) {
                    splicerItem.preAppliances[0].id = powerId
                }
                splicerPower.id = powerId
                this[type].splice(splicerIndex + 2, 0, splicerItem, splicerPower)
            }
        },
        deleteItem(type: string, id: number) {
            const validTypes = [
                'lights',
                'projectors',
                'stations',
                'scenes',
                'sources',
                'blinds',
                'rooms',
                'splicers',
                'ledRings'
            ]

            if (validTypes.includes(type)) {
                console.log('deleting ' + type + ' ' + id)
                const index = this[type].findIndex((el) => el.id === id)
                if (index !== -1) {
                    if (type === 'sources') {
                        const projectorIndex = this['projectors'].findIndex(
                            (el) => el.name === this['sources'][index].name
                        )
                        if (projectorIndex !== -1) {
                            this['projectors'].splice(projectorIndex, 1)
                        }
                    }
                    this[type].splice(index, 1)
                }
            } else {
                console.log('invalid type detected: ' + type)
            }
        },
        reorderItem(type: string, index1: number, index2: number) {
            // check if both element indexes
            if (!this[type][index1] && !this[type][index2]) {
                return
            }
            ;[this[type][index1], this[type][index2]] = [this[type][index2], this[type][index1]]
        },
        trimEmptyData() {
            if (!this.trimmed) {
                const allTypes: string[] = []
                for (const field in this.$state) {
                    // this.$state[key]  -> iterate each key inside state
                    // console.log(this[field])
                    if (
                        field != 'trimmed' &&
                        field !== 'currentlyEditingAppliance' &&
                        field !== 'fetchingId'
                    ) {
                        allTypes.push(field)
                    }
                }
                for (const type of allTypes) {
                    let index = -1
                    while (
                        (index = this[type].findIndex(
                            (el) => el.name === '' || el.name === ' Power'
                        )) !== -1
                    ) {
                        this[type].splice(index, 1)
                    }
                }
                this.trimmed = true
            }
        },
        addOrUpdateItem(type: string, item?: ApplianceInterface, previousId?: number | string) {
            //Remove any sub-category
            let tokens: string[] = type.split("-");
            let mainType = tokens[0];

            // add new item
            this.trimmed = false
            // intercept to allow usage of addOrUpdateSplicer due to different functionality and requirements
            if (item == undefined) {
                let newItem
                if (type === 'stations') {
                    newItem = objectGenerator(type, this.stations.length + 1)
                } else {
                    newItem = objectGenerator(type)
                }
                this[mainType].push(newItem)
                if (type === 'splicers') {
                    const newItemPower = objectGenerator(type)
                    newItemPower.name += ' Power'
                    newItemPower.preAppliances = []
                    this[mainType].push(newItemPower)
                } else if (type == 'sources-epson') {
                    const newProjector = objectGenerator('projectors-epson')
                    this['projectors'].push(newProjector)
                }  else if (type == 'sources-panasonic') {
                    const newProjector = objectGenerator('projectors-panasonic')
                    this['projectors'].push(newProjector)
                }
            } else {
                // simply edit item if previous Id doesnt exist. if previous Id exists, find the index of the original light and replace
                const comparisonId = previousId != null ? previousId : item.id
                const index = this[mainType].findIndex(
                    (element) => Number(element.id) === Number(comparisonId)
                )
                if (type === 'rooms') {
                    const oldName = this[mainType][index].name
                    const newName = item.name
                    this.updateAllRooms(oldName, newName)
                }
                const oldVersion = this[mainType].find(
                    (element) => Number(element.id) === Number(comparisonId)
                )
                if (index !== -1) {
                    this[mainType].splice(index, 1, item)
                    if (mainType === 'sources') {
                        // Remove label field from projector item
                        // @ts-ignore ignoring cast
                        const projectorItem: EpsonProjector = Object.assign({}, item)
                        delete projectorItem.options
                        projectorItem.id = Number(Number(item.id) + 100 + '')
                        console.log(projectorItem)
                        this['projectors'].splice(index, 1, projectorItem)
                        // @ts-ignore ignoring cast
                        const source: SourceInterface = Object.assign({}, item)
                        this['sources'].splice(index, 1, source)
                    }
                    if (type === 'ledRings' && oldVersion) {
                        /**
                         * Scan all stations if there is any station using this LED ring id. if yes, replace id
                         * with new id to preserve relationship
                         */
                        this.stations.forEach((station) => {
                            if (
                                Number(station.led_ring_id) === Number(oldVersion.automationId) &&
                                item instanceof LedRing
                            ) {
                                station.led_ring_id = Number(item.automationId)
                            }
                        })
                    }

                    if (type === 'splicers' && item.name.endsWith(' Power')) {
                        const splicerSource = this.splicers.find((element) => {
                            if (element.name === item.name.substring(0, item.name.length - 6)) {
                                return true
                            }
                            if (
                                element.preAppliances &&
                                element.preAppliances.findIndex(
                                    (el) => el.id === item.id || el.id === previousId
                                ) !== -1
                            ) {
                                return true
                            }
                            return false
                        })
                        if (!splicerSource) {
                            return
                        }
                        console.log(splicerSource)
                        const index = this.splicers.findIndex(
                            (element) => element.id === splicerSource.id
                        )
                        const preAppliance = {
                            id: item.id,
                            value: 255,
                            type: 'splicers'
                        }
                        if (splicerSource.preAppliances) {
                            // @ts-ignore id will always be number in this case
                            splicerSource.preAppliances = [Object.assign({}, preAppliance)]
                        }
                        this.splicers.splice(index, 1, Object.assign({}, splicerSource))
                    }
                    this.scenes.forEach((scene) => {
                        if (scene.appliances) {
                            scene.appliances.forEach((element) => {
                                if (Number(element.id) === Number(previousId)) {
                                    element.id = Number(previousId)
                                }
                            })
                        }
                        if (scene.stations) {
                            scene.stations.forEach((element) => {
                                if (Number(element.id) === Number(previousId)) {
                                    element.id = Number(previousId)
                                }
                            })
                        }
                    })
                } else {
                    this[mainType].push(item)
                    if (type == 'sources-epson') {
                        // @ts-ignore ignoring cast
                        const projector: PanasonicProjector = Object.assign({}, item)
                        this['projectors'].push(projector)
                    }
                    else if (type == 'sources-panasonic') {
                        // @ts-ignore ignoring cast
                        const projector: PanasonicProjector = Object.assign({}, item)
                        this['projectors'].push(projector)
                    }
                }
            }
        },
        /**
         *
         * @param oldName
         * @param newName
         */
        updateAllRooms(oldName: string, newName: string) {
            // iterate through all appliances in the state and if the name is change it
            // simple boolean switch
            const allTypes: string[] = []
            for (const field in this.$state) {
                if (
                    field !== 'trimmed' &&
                    field !== 'rooms' &&
                    field !== 'currentlyEditingAppliance' &&
                    field !== 'fetchingId'
                ) {
                    allTypes.push(field)
                }
            }
            for (const type of allTypes) {
                this[type].forEach((el) => {
                    if (el !== undefined) {
                        if (el.room === oldName) {
                            el.room = newName
                        }
                    }
                })
            }
        },
        resetStore() {
            this.rooms = []
            this.stations = []
            this.lights = []
            this.blinds = []
            this.projectors = []
            this.splicers = []
            this.sources = []
            this.ledRings = []
            this.scenes = []
            this.trimmed = true
        },
        setCurrentlyEditingAppliance(value: boolean): void {
            this.currentlyEditingAppliance = value
        }
    }
})

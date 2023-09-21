import {
    Blind,
    LedRing,
    Light,
    Projector,
    Room,
    Scene,
    Source,
    Station,
    Splicer
} from '../../models'
import IdGen from './idGenerator'

export function checkObjectId(object, id): boolean {
    for (const key in object) {
        if (key === 'id') if (object[key] === id) return true
    }
    return false
}

export async function stall(stallTime = 1200): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, stallTime))
}

let LedRingIdCounter = 1
export const objectGenerator = (type: string, id?: number): any => {
    let newItem
    switch (type) {
        case 'lights':
            newItem = new Light()
            break
        case 'ledRings':
            newItem = new LedRing()
            newItem.automationId = LedRingIdCounter
            LedRingIdCounter++
            break
        case 'projectors':
            newItem = new Projector()
            // newItem.id = this.projectors.length + 19001
            break
        case 'sources':
            newItem = new Source()
            // newItem.id = this.sources.length + 201
            break
        case 'stations':
            newItem = new Station()
            if (id) {
                newItem.id = id
            }
            return newItem
            break
        case 'rooms':
            newItem = new Room()
            break
        case 'scenes':
            newItem = new Scene()
            // newItem.id = this.scenes.length + 301
            break
        case 'blinds':
            newItem = new Blind()
            // newItem.id = this.blinds.length + 401
            break
        case 'splicers':
            newItem = new Splicer()
            break
    }
    newItem.id = IdGen.generateRanId() // not the most random but should be fine
    return newItem
}

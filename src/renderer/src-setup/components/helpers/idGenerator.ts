let instance
const generatedNumbers: number[] = []

class IdGeneratorSingle {
    constructor() {
        if (instance) {
            throw new Error('New Instance cannot be created')
        }
        instance = this
    }

    generateRanId(): number {
        let randomId: number
        do {
            randomId = Math.floor(Math.random() * 1000000 + 1)
        } while (generatedNumbers.includes(randomId))
        return randomId
    }
}

const IdGen = Object.freeze(new IdGeneratorSingle())

export default IdGen

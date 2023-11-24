import { defineStore } from 'pinia'

export const useChecklistStore = defineStore({
    id: 'checklist',
    state: () => ({
        handoverDocument: false as boolean,
        anythingElse: false as boolean,
        networkAccess: false as boolean,
        cbusIpAndCreds: false as boolean,
        setupCbus: false as boolean,
        attemptConnectCbus: false as boolean,
        pageVisitCount: 0
    }),

    getters: {
        getCompletedStatus(state): any {
            return {
                valid:
                    state.handoverDocument &&
                    state.anythingElse &&
                    state.networkAccess &&
                    state.setupCbus,
                count: state.pageVisitCount
            }
        },
        getChecklistCompletedStatus(state): boolean {
            return (
                state.handoverDocument &&
                state.anythingElse &&
                state.networkAccess &&
                state.cbusIpAndCreds
            )
        },
        getCbusStatus(state): boolean {
            return state.setupCbus
        },
        getPageVisitCount(state): any {
            return state.pageVisitCount
        }
    },

    actions: {
        incrementPageVisitCount() {
            this.pageVisitCount++
        }
    }
})

async function getCanAccessVultr(): Promise<boolean> {
    try {
        const result = await fetch('https://leadme-healthcheck.sgp1.vultrobjects.com/healthcheck',
            {
                mode: 'no-cors',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "text/plain"
                }
            })
        var value = result.status < 300
        return Promise.resolve(value)
    } catch (e) {
        return Promise.resolve(false);
    }
}

export { getCanAccessVultr }
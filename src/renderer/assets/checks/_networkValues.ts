export const DESCRIPTIONS = {
    "Network": {
        testing: "Testing is underway",
        passed: "Your device can access the internet on this network.",
        failed: `<p>Your device <span class="font-semibold">can not</span> access the internet on this network.</p>`,
    },
    "Ports": {
        testing: "Testing is underway",
        passed: "The required ports are open and accessible.",
        failed: `<p>The required ports <span class="font-semibold">are not</span> open and accessible.</p>`,
    },
    "Firewall": {
        testing: "Testing is underway",
        passed: "The required websites can be accessed. (eg. Steam)",
        failed: `<p>The required websites <span class="font-semibold">can not</span> be accessed. (eg. Steam)</p>`,
    },
    "Speed Test": {
        testing: "Testing is underway",
        passed: "The network speed can support a Learning Lab.",
        failed: `<p>The network speed <span class="font-semibold">can not</span> support an online Learning Lab.</p>`,
    }
}

export const WEBSITES = [
    {
        "name": "Steam",
        "url": "https://store.steampowered.com/"
    },
    {
        "name": "Cloudflare",
        "url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1029110/header.jpg"
    },
    {
        "name": "LeadMe Launcher",
        "url": "https://leadme-tools.sgp1.vultrobjects.com/leadme-launcher/latest.yml"
    },
    {
        "name": "LeadMe Software",
        "url": "https://leadme-internal.sgp1.vultrobjects.com/Station/version"
    },
    {
        "name": "Sentry IO",
        "url": "https://sentry.io/"
    },
    {
        "name": "Firebase",
        "url": "https://leadme-labs-default-rtdb.asia-southeast1.firebasedatabase.app"
    }
]

export const PORTS = [
    {
        "name": "Tablet",
        "value": "55555"
    },
    {
        "name": "NUC",
        "value": "55556"
    },
    {
        "name": "Station",
        "value": "55557"
    },
    {
        "name": "Projector",
        "value": "3629"
    }
]

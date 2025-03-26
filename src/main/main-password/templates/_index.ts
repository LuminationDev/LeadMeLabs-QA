interface Uri {
    match: null;
    uri: string;
}

interface Login {
    fido2Credentials: {
        credentialId: string;
        keyType: string;
        keyAlgorithm: string;
        keyCurve: string;
        keyValue: string;
        rpId: string;
        userHandle: string;
        userName: string;
        counter: string;
        rpName: string;
        userDisplayName: string;
        discoverable: string;
        creationDate: string | null;
    }[];
    uris: Uri[];
    username: string;
    password: string;
    totp: string | null;
}

export const login: Login = {
    "fido2Credentials":[{
        "credentialId":"keyId",
        "keyType":"keyType",
        "keyAlgorithm":"keyAlgorithm",
        "keyCurve":"keyCurve",
        "keyValue":"keyValue",
        "rpId":"rpId",
        "userHandle":"userHandle",
        "userName":"userName",
        "counter":"counter",
        "rpName":"rpName",
        "userDisplayName":"userDisplayName",
        "discoverable":"false",
        "creationDate":null
    }],
    "uris":[],
    "username":"",
    "password":"",
    "totp":null
}

interface Item {
    passwordHistory: any[];
    revisionDate: string | null;
    creationDate: string | null;
    deletedDate: string | null;
    organizationId: string | null | undefined;
    collectionIds: string[] | null;
    folderId: string | null;
    type: number;
    name: string;
    notes: string;
    favorite: boolean;
    fields: any[];
    login: Login;
    secureNote: any | null;
    card: any | null;
    identity: any | null;
    reprompt: number;
}

export const item: Item = {
    "passwordHistory":[],
    "revisionDate":null,
    "creationDate":null,
    "deletedDate":null,
    "organizationId":null,
    "collectionIds":[],
    "folderId":null,
    "type":1,
    "name": "",
    "notes":"",
    "favorite":false,
    "fields":[],
    "login":login,
    "secureNote":null,
    "card":null,
    "identity":null,
    "reprompt":0
}

import ManualCheck from "*.vue";

export type CheckGuideItem = {
    imageSource: string|null;
    text: string;
}

type Check = {
    description: string;
    guide: Array<CheckGuideItem>
}

type CheckCategory = {
    checks: Record<string, Check>;
    description: string;
    devices: {
        station: boolean;
        tablet: boolean;
        nuc: boolean;
        cbus: boolean;
    }
};

export type CheckObject = {
    parent: string;
    page: string;
    description: string;
    category: Record<string, CheckCategory>[];
};

export type Route = {
    path: string;
    name: string;
    component: typeof ManualCheck;
    meta: {
        description: string;
        page: string;
        category: string;
        next: string;
        prev: string;
        progress: number;
    };
};
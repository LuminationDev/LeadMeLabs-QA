import ManualCheck from "*.vue";

type CheckCategory = {
    checks: Record<string, string>;
    description: string;
};

export type CheckObject = {
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
export default interface NavigationItem {
    route: string;
    title: string;
    description: string;
    component?: any; // Vue component type
    screens: {
        title: string;
        objectName: string;
        component?: any;
    }[];
    checks: {
        auto: string[];
        manual: string[];
    };
}
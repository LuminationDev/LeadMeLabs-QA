export interface NetworkInfo {
    NetworkInterface: string;
    SubnetMask: string;
    DefaultGateway: string;
    DnsServer: string | null;
    AltDnsServer: string | null;
    PortDetails: string | null;
}

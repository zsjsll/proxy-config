export interface HealthCheck {
  enable:   boolean;
  url:      string;
  interval: number;
  timeout:  number;
}

export interface Airport {
  url:            string;
  type:           AirportType;
  interval:       number;
  "health-check": HealthCheck;
  proxy:          string;
}

export interface ProxyProviders {
  airport: Airport;
}

export interface Profile {
  "store-selected": boolean;
  "store-fake-ip":  boolean;
}

export interface Tun {
  enable:                  boolean;
  stack:                   string;
  device:                  string;
  "dns-hijack":            string[];
  "auto-route":            boolean;
  "auto-redirect":         boolean;
  "auto-detect-interface": boolean;
  "strict-route":          boolean;
}

export interface HTTP {
  ports:                  number[];
  "override-destination": boolean;
}

export interface Quic {
  ports: number[];
}

export interface Sniff {
  HTTP: HTTP;
  TLS:  Quic;
  QUIC: Quic;
}

export interface Sniffer {
  enable:              boolean;
  "force-dns-mapping": boolean;
  "parse-pure-ip":     boolean;
  sniff:               Sniff;
  "force-domain":      string[];
  "skip-domain":       string[];
}

export interface NameserverPolicy {
  "rule-set:geosite-ads,custom-reject": string[];
}

export interface DNS {
  enable:                    boolean;
  listen:                    string;
  ipv6:                      boolean;
  "use-hosts":               boolean;
  "use-system-hosts":        boolean;
  "respect-rules":           boolean;
  "enhanced-mode":           string;
  "fake-ip-range":           string;
  "fake-ip-filter-mode":     string;
  "fake-ip-filter":          string[];
  "nameserver-policy":       NameserverPolicy;
  "default-nameserver":      string[];
  "proxy-server-nameserver": string[];
  "direct-nameserver":       string[];
  nameserver:                string[];
}

export interface AutoTest {
  type:          ProxyGroupType;
  tolerance:     number;
  interval:      number;
  timeout:       number;
  "include-all": boolean;
  url:           string;
}

export interface ProxyGroupsAnchor {
  auto_test: AutoTest;
}

export interface ProxyGroup {
  name:           string;
  type:           ProxyGroupType;
  proxies?:       string[];
  "include-all"?: boolean;
  url?:           string;
  timeout?:       number;
  interval?:      number;
  tolerance?:     number;
  hidden?:        boolean;
}

export interface RuleProvider {
  format:   Format;
  behavior: Behavior;
  interval: number;
  type:     AirportType;
  url?:     string;
}

export interface RuleProvidersAnchor {
  domain: RuleProvider;
  ip:     RuleProvider;
  class:  RuleProvider;
}

export interface DefaultConfig {
  "proxy-providers":       ProxyProviders;
  "mixed-port":            number;
  "socks-port":            number;
  port:                    number;
  "redir-port":            number;
  "tproxy-port":           number;
  "external-controller":   string;
  secret:                  string;
  "allow-lan":             boolean;
  "bind-address":          string;
  ipv6:                    boolean;
  "unified-delay":         boolean;
  "tcp-concurrent":        boolean;
  "log-level":             string;
  "find-process-mode":     string;
  "disable-keep-alive":    boolean;
  "keep-alive-idle":       number;
  "keep-alive-interval":   number;
  profile:                 Profile;
  tun:                     Tun;
  sniffer:                 Sniffer;
  dns:                     DNS;
  "proxy-groups-anchor":   ProxyGroupsAnchor;
  "proxy-groups":          ProxyGroup[];
  rules:                   string[];
  "rule-providers-anchor": RuleProvidersAnchor;
  "rule-providers":        { [key: string]: RuleProvider };
}



export enum ProxyGroupType {
  Select = "select",
  URLTest = "url-test",
}

export enum AirportType {
  HTTP = "http",
}

export enum Behavior {
  Classical = "classical",
  Domain = "domain",
  Ipcidr = "ipcidr",
}

export enum Format {
  Mrs = "mrs",
  YAML = "yaml",
}
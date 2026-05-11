export interface AutoTest {
  type:          AutoTestType;
  tolerance:     number;
  "include-all": boolean;
  interval:      number;
  timeout:       number;
  url:           string;
}

export interface ProxyGroups {
  "auto-test": AutoTest;
}

export interface Default {
  type:     RuleProviderType;
  interval: number;
}

export interface RuleProvider {
  interval: number;
  type:     RuleProviderType;
  behavior: Behavior;
  format:   Format;
  url?:     string;
}

export interface RuleProviders {
  default: Default;
  domain:  RuleProvider;
  ip:      RuleProvider;
  class:   RuleProvider;
}

export interface GlobalAnchor {
  "proxy-groups":   ProxyGroups;
  "rule-providers": RuleProviders;
}

export interface Airport {
  url:      string;
  type:     RuleProviderType;
  interval: number;
  proxy:    string;
}

export interface ProxyProviders {
  airport: Airport;
}

export interface Profile {
  "store-selected": boolean;
  "store-fake-ip":  boolean;
}

export interface Tun {
  enable:                      boolean;
  stack:                       string;
  device:                      string;
  "dns-hijack":                string[];
  "auto-route":                boolean;
  "auto-redirect":             boolean;
  "auto-detect-interface":     boolean;
  "strict-route":              boolean;
  "route-exclude-address-set": string[];
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

export interface ProxyGroup {
  name:           string;
  type:           AutoTestType;
  proxies?:       string[];
  "include-all"?: boolean;
  url?:           string;
  timeout?:       number;
  interval?:      number;
  tolerance?:     number;
  hidden?:        boolean;
}

export interface DefaultConfig {
  "global-anchor":       GlobalAnchor;
  "proxy-providers":     ProxyProviders;
  "mixed-port":          number;
  "socks-port":          number;
  port:                  number;
  "redir-port":          number;
  "tproxy-port":         number;
  "external-controller": string;
  secret:                string;
  "allow-lan":           boolean;
  "bind-address":        string;
  ipv6:                  boolean;
  "unified-delay":       boolean;
  "tcp-concurrent":      boolean;
  "log-level":           string;
  "find-process-mode":   string;
  "disable-keep-alive":  boolean;
  "keep-alive-idle":     number;
  "keep-alive-interval": number;
  profile:               Profile;
  tun:                   Tun;
  sniffer:               Sniffer;
  dns:                   DNS;
  "proxy-groups":        ProxyGroup[];
  rules:                 string[];
  "rule-providers":      { [key: string]: RuleProvider };
}



export enum AutoTestType {
  Select = "select",
  URLTest = "url-test",
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

export enum RuleProviderType {
  HTTP = "http",
}
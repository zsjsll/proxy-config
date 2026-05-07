// To parse this data:
//
//   import { Convert, ClashConfig } from "./file";
//
//   const clashConfig = Convert.toClashConfig(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ClashConfig {
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

export interface NameserverPolicy {
    "rule-set:geosite-ads,custom-reject": string[];
}

export interface Profile {
    "store-selected": boolean;
    "store-fake-ip":  boolean;
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

export enum ProxyGroupType {
    Select = "select",
    URLTest = "url-test",
}

export interface ProxyGroupsAnchor {
    auto_test: AutoTest;
}

export interface AutoTest {
    type:          ProxyGroupType;
    tolerance:     number;
    interval:      number;
    timeout:       number;
    "include-all": boolean;
    url:           string;
}

export interface ProxyProviders {
    airport: Airport;
}

export interface Airport {
    url:            string;
    type:           AirportType;
    interval:       number;
    "health-check": HealthCheck;
    proxy:          string;
}

export interface HealthCheck {
    enable:   boolean;
    url:      string;
    interval: number;
    timeout:  number;
}

export enum AirportType {
    HTTP = "http",
}

export interface RuleProvider {
    format:   Format;
    behavior: Behavior;
    interval: number;
    type:     AirportType;
    url?:     string;
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

export interface RuleProvidersAnchor {
    domain: RuleProvider;
    ip:     RuleProvider;
    class:  RuleProvider;
}

export interface Sniffer {
    enable:              boolean;
    "force-dns-mapping": boolean;
    "parse-pure-ip":     boolean;
    sniff:               Sniff;
    "force-domain":      string[];
    "skip-domain":       string[];
}

export interface Sniff {
    HTTP: HTTP;
    TLS:  Quic;
    QUIC: Quic;
}

export interface HTTP {
    ports:                  number[];
    "override-destination": boolean;
}

export interface Quic {
    ports: number[];
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

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toClashConfig(json: string): ClashConfig {
        return cast(JSON.parse(json), r("ClashConfig"));
    }

    public static clashConfigToJson(value: ClashConfig): string {
        return JSON.stringify(uncast(value, r("ClashConfig")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ClashConfig": o([
        { json: "proxy-providers", js: "proxy-providers", typ: r("ProxyProviders") },
        { json: "mixed-port", js: "mixed-port", typ: 0 },
        { json: "socks-port", js: "socks-port", typ: 0 },
        { json: "port", js: "port", typ: 0 },
        { json: "redir-port", js: "redir-port", typ: 0 },
        { json: "tproxy-port", js: "tproxy-port", typ: 0 },
        { json: "external-controller", js: "external-controller", typ: "" },
        { json: "secret", js: "secret", typ: "" },
        { json: "allow-lan", js: "allow-lan", typ: true },
        { json: "bind-address", js: "bind-address", typ: "" },
        { json: "ipv6", js: "ipv6", typ: true },
        { json: "unified-delay", js: "unified-delay", typ: true },
        { json: "tcp-concurrent", js: "tcp-concurrent", typ: true },
        { json: "log-level", js: "log-level", typ: "" },
        { json: "find-process-mode", js: "find-process-mode", typ: "" },
        { json: "disable-keep-alive", js: "disable-keep-alive", typ: true },
        { json: "keep-alive-idle", js: "keep-alive-idle", typ: 0 },
        { json: "keep-alive-interval", js: "keep-alive-interval", typ: 0 },
        { json: "profile", js: "profile", typ: r("Profile") },
        { json: "tun", js: "tun", typ: r("Tun") },
        { json: "sniffer", js: "sniffer", typ: r("Sniffer") },
        { json: "dns", js: "dns", typ: r("DNS") },
        { json: "proxy-groups-anchor", js: "proxy-groups-anchor", typ: r("ProxyGroupsAnchor") },
        { json: "proxy-groups", js: "proxy-groups", typ: a(r("ProxyGroup")) },
        { json: "rules", js: "rules", typ: a("") },
        { json: "rule-providers-anchor", js: "rule-providers-anchor", typ: r("RuleProvidersAnchor") },
        { json: "rule-providers", js: "rule-providers", typ: m(r("RuleProvider")) },
    ], false),
    "DNS": o([
        { json: "enable", js: "enable", typ: true },
        { json: "listen", js: "listen", typ: "" },
        { json: "ipv6", js: "ipv6", typ: true },
        { json: "use-hosts", js: "use-hosts", typ: true },
        { json: "use-system-hosts", js: "use-system-hosts", typ: true },
        { json: "respect-rules", js: "respect-rules", typ: true },
        { json: "enhanced-mode", js: "enhanced-mode", typ: "" },
        { json: "fake-ip-range", js: "fake-ip-range", typ: "" },
        { json: "fake-ip-filter-mode", js: "fake-ip-filter-mode", typ: "" },
        { json: "fake-ip-filter", js: "fake-ip-filter", typ: a("") },
        { json: "nameserver-policy", js: "nameserver-policy", typ: r("NameserverPolicy") },
        { json: "default-nameserver", js: "default-nameserver", typ: a("") },
        { json: "proxy-server-nameserver", js: "proxy-server-nameserver", typ: a("") },
        { json: "direct-nameserver", js: "direct-nameserver", typ: a("") },
        { json: "nameserver", js: "nameserver", typ: a("") },
    ], false),
    "NameserverPolicy": o([
        { json: "rule-set:geosite-ads,custom-reject", js: "rule-set:geosite-ads,custom-reject", typ: a("") },
    ], false),
    "Profile": o([
        { json: "store-selected", js: "store-selected", typ: true },
        { json: "store-fake-ip", js: "store-fake-ip", typ: true },
    ], false),
    "ProxyGroup": o([
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: r("ProxyGroupType") },
        { json: "proxies", js: "proxies", typ: u(undefined, a("")) },
        { json: "include-all", js: "include-all", typ: u(undefined, true) },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "timeout", js: "timeout", typ: u(undefined, 0) },
        { json: "interval", js: "interval", typ: u(undefined, 0) },
        { json: "tolerance", js: "tolerance", typ: u(undefined, 0) },
        { json: "hidden", js: "hidden", typ: u(undefined, true) },
    ], false),
    "ProxyGroupsAnchor": o([
        { json: "auto_test", js: "auto_test", typ: r("AutoTest") },
    ], false),
    "AutoTest": o([
        { json: "type", js: "type", typ: r("ProxyGroupType") },
        { json: "tolerance", js: "tolerance", typ: 0 },
        { json: "interval", js: "interval", typ: 0 },
        { json: "timeout", js: "timeout", typ: 0 },
        { json: "include-all", js: "include-all", typ: true },
        { json: "url", js: "url", typ: "" },
    ], false),
    "ProxyProviders": o([
        { json: "airport", js: "airport", typ: r("Airport") },
    ], false),
    "Airport": o([
        { json: "url", js: "url", typ: "" },
        { json: "type", js: "type", typ: r("AirportType") },
        { json: "interval", js: "interval", typ: 0 },
        { json: "health-check", js: "health-check", typ: r("HealthCheck") },
        { json: "proxy", js: "proxy", typ: "" },
    ], false),
    "HealthCheck": o([
        { json: "enable", js: "enable", typ: true },
        { json: "url", js: "url", typ: "" },
        { json: "interval", js: "interval", typ: 0 },
        { json: "timeout", js: "timeout", typ: 0 },
    ], false),
    "RuleProvider": o([
        { json: "format", js: "format", typ: r("Format") },
        { json: "behavior", js: "behavior", typ: r("Behavior") },
        { json: "interval", js: "interval", typ: 0 },
        { json: "type", js: "type", typ: r("AirportType") },
        { json: "url", js: "url", typ: u(undefined, "") },
    ], false),
    "RuleProvidersAnchor": o([
        { json: "domain", js: "domain", typ: r("RuleProvider") },
        { json: "ip", js: "ip", typ: r("RuleProvider") },
        { json: "class", js: "class", typ: r("RuleProvider") },
    ], false),
    "Sniffer": o([
        { json: "enable", js: "enable", typ: true },
        { json: "force-dns-mapping", js: "force-dns-mapping", typ: true },
        { json: "parse-pure-ip", js: "parse-pure-ip", typ: true },
        { json: "sniff", js: "sniff", typ: r("Sniff") },
        { json: "force-domain", js: "force-domain", typ: a("") },
        { json: "skip-domain", js: "skip-domain", typ: a("") },
    ], false),
    "Sniff": o([
        { json: "HTTP", js: "HTTP", typ: r("HTTP") },
        { json: "TLS", js: "TLS", typ: r("Quic") },
        { json: "QUIC", js: "QUIC", typ: r("Quic") },
    ], false),
    "HTTP": o([
        { json: "ports", js: "ports", typ: a(0) },
        { json: "override-destination", js: "override-destination", typ: true },
    ], false),
    "Quic": o([
        { json: "ports", js: "ports", typ: a(0) },
    ], false),
    "Tun": o([
        { json: "enable", js: "enable", typ: true },
        { json: "stack", js: "stack", typ: "" },
        { json: "device", js: "device", typ: "" },
        { json: "dns-hijack", js: "dns-hijack", typ: a("") },
        { json: "auto-route", js: "auto-route", typ: true },
        { json: "auto-redirect", js: "auto-redirect", typ: true },
        { json: "auto-detect-interface", js: "auto-detect-interface", typ: true },
        { json: "strict-route", js: "strict-route", typ: true },
    ], false),
    "ProxyGroupType": [
        "select",
        "url-test",
    ],
    "AirportType": [
        "http",
    ],
    "Behavior": [
        "classical",
        "domain",
        "ipcidr",
    ],
    "Format": [
        "mrs",
        "yaml",
    ],
};

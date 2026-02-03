import type { Project } from "./types";

export const DEFAULT: Project = {
    meta: { team: "8324", season: 2026, rev: "v0.2" },
    devices: [
        { id: "bat", type: "Battery", name: "Battery" },
        { id: "mb", type: "MainBreaker", name: "Main Breaker" },
        { id: "pdh", type: "PDH", name: "PDH", attrs: { canId: 1 } },
        { id: "rio", type: "roboRIO", name: "roboRIO" },
        { id: "radio", type: "Radio", name: "Radio" },
        { id: "mc1", type: "MotorController", name: "Shooter MC", attrs: { canId: 12 }, subsystem: "Shooter" },
    ],
    nets: [
        { id: "pwr12", kind: "POWER_12V", name: "12V Main" },
        { id: "can0", kind: "CAN", name: "CAN Bus" },
        { id: "eth0", kind: "ETH", name: "Ethernet" },
    ],
    connections: [
        {
            id: "c1",
            netId: "pwr12",
            from: { deviceId: "bat", port: "12V_OUT" },
            to: { deviceId: "mb", port: "IN" },
            attrs: { note: "Battery leads", breakerA: 120, wireAwg: 6 },
        },
        {
            id: "c2",
            netId: "pwr12",
            from: { deviceId: "mb", port: "OUT" },
            to: { deviceId: "pdh", port: "MAIN_IN" },
            attrs: { note: "Main feed", breakerA: 120, wireAwg: 6 },
        },
        {
            id: "c3",
            netId: "pwr12",
            from: { deviceId: "pdh", port: "CH0" },
            to: { deviceId: "mc1", port: "12V_IN" },
            attrs: { note: "Shooter", breakerA: 40, wireAwg: 12 },
        },
        { id: "c4", netId: "can0", from: { deviceId: "rio", port: "CAN" }, to: { deviceId: "pdh", port: "CAN" }, attrs: { note: "CAN backbone" } },
        { id: "c5", netId: "can0", from: { deviceId: "pdh", port: "CAN" }, to: { deviceId: "mc1", port: "CAN" }, attrs: { note: "CAN chain" } },
        { id: "c6", netId: "eth0", from: { deviceId: "rio", port: "ETH" }, to: { deviceId: "radio", port: "ETH" }, attrs: { note: "RIO ↔ Radio" } },
    ],
    placements: [
        { deviceId: "bat", x: 80, y: 120 },
        { deviceId: "mb", x: 280, y: 120 },
        { deviceId: "pdh", x: 520, y: 120 },
        { deviceId: "rio", x: 520, y: 320 },
        { deviceId: "radio", x: 760, y: 320 },
        { deviceId: "mc1", x: 760, y: 120 },
    ],
};

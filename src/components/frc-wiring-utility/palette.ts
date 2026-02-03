import type { DeviceType } from "./types";

export const PALETTE: { type: DeviceType; label: string; hint: string }[] = [
    { type: "Battery", label: "Battery", hint: "12V source" },
    { type: "MainBreaker", label: "Main Breaker", hint: "120A main" },
    { type: "PDH", label: "PDH", hint: "Power distribution + CAN" },
    { type: "roboRIO", label: "roboRIO", hint: "Controller" },
    { type: "Radio", label: "Radio", hint: "Wi-Fi bridge" },
    { type: "MotorController", label: "Motor Controller", hint: "Talon/Spark/etc" },
    { type: "Sensor", label: "Sensor", hint: "DIO/Analog/USB" },
    { type: "Other", label: "Other", hint: "Generic block" },
];

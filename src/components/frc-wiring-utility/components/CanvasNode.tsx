import React from "react";
import type { Project } from "../types";
import { getPlacement } from "../helpers";
import { SchematicNode } from "./SchematicNode";

export function CanvasNode(props: {
    project: Project;
    deviceId: string;
    NODE_W: number;
    NODE_H: number;
    selectedDeviceId: string | null;
    setSelectedDeviceId: (id: string | null) => void;

    onNodePointerDown: (e: React.PointerEvent, deviceId: string) => void;
    onNodePointerMove: (e: React.PointerEvent) => void;
    onNodePointerUp: () => void;
}) {
    const {
        project,
        deviceId,
        NODE_W,
        NODE_H,
        selectedDeviceId,
        setSelectedDeviceId,
        onNodePointerDown,
        onNodePointerMove,
        onNodePointerUp,
    } = props;

    const d = project.devices.find((x) => x.id === deviceId);
    if (!d) return null;

    const pl = getPlacement(project, deviceId);
    if (!pl) return null;

    const selected = selectedDeviceId === deviceId;

    return (
        <div
            className="absolute"
            style={{
                width: NODE_W,
                height: NODE_H,
                left: pl.x,
                top: pl.y,
                cursor: "grab",
            }}
            onPointerDown={(e) => {
                e.stopPropagation();
                onNodePointerDown(e, deviceId);
            }}
            onPointerMove={(e) => {
                e.stopPropagation();
                onNodePointerMove(e);
            }}
            onPointerUp={(e) => {
                e.stopPropagation();
                onNodePointerUp();
            }}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedDeviceId(deviceId);
            }}
        >
            <SchematicNode device={d} selected={selected} showDragBadge />
            {/* If you want coords, make it an optional overlay here, not inside SchematicNode */}
        </div>
    );
}

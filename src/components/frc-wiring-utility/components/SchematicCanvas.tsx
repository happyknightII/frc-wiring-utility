import React, { useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { MousePointer2 } from "lucide-react";
import type { DeviceType, Project } from "../types";
import { clamp, deviceHasCanId, getPlacement, snap } from "../helpers";

export function SchematicCanvas(props: {
    project: Project;
    selectedDeviceId: string | null;
    setSelectedDeviceId: (id: string | null) => void;
    GRID: number;
    NODE_W: number;
    NODE_H: number;
    onDropCreate: (type: DeviceType, x: number, y: number) => void;
    onMovePlacement: (deviceId: string, x: number, y: number) => void;
}) {
    const { project, selectedDeviceId, setSelectedDeviceId, GRID, NODE_W, NODE_H, onDropCreate, onMovePlacement } = props;

    const canvasRef = useRef<HTMLDivElement | null>(null);
    const dragStateRef = useRef<{
        deviceId: string;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
    } | null>(null);

    const deviceCount = project.devices.length;

    const canvasPointFromEvent = (clientX: number, clientY: number) => {
        const el = canvasRef.current;
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: clientX - r.left, y: clientY - r.top };
    };

    const onCanvasDragOver = (e: React.DragEvent) => {
        if (e.dataTransfer.types.includes("application/x-frc-device-type")) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        }
    };

    const onCanvasDrop = (e: React.DragEvent) => {
        const type = e.dataTransfer.getData("application/x-frc-device-type") as DeviceType;
        if (!type) return;

        e.preventDefault();
        const pt = canvasPointFromEvent(e.clientX, e.clientY);

        const el = canvasRef.current;
        const w = el?.clientWidth ?? 1200;
        const h = el?.clientHeight ?? 800;

        const x = clamp(snap(pt.x - NODE_W / 2, GRID), 0, Math.max(0, w - NODE_W));
        const y = clamp(snap(pt.y - NODE_H / 2, GRID), 0, Math.max(0, h - NODE_H));

        onDropCreate(type, x, y);
    };

    const onNodePointerDown = (e: React.PointerEvent, deviceId: string) => {
        const pl = getPlacement(project, deviceId);
        if (!pl) return;
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

        dragStateRef.current = {
            deviceId,
            startX: e.clientX,
            startY: e.clientY,
            originX: pl.x,
            originY: pl.y,
        };
        setSelectedDeviceId(deviceId);
    };

    const onNodePointerMove = (e: React.PointerEvent) => {
        const st = dragStateRef.current;
        if (!st) return;

        const el = canvasRef.current;
        const w = el?.clientWidth ?? 1200;
        const h = el?.clientHeight ?? 800;

        const dx = e.clientX - st.startX;
        const dy = e.clientY - st.startY;

        const x = clamp(snap(st.originX + dx, GRID), 0, Math.max(0, w - NODE_W));
        const y = clamp(snap(st.originY + dy, GRID), 0, Math.max(0, h - NODE_H));

        onMovePlacement(st.deviceId, x, y);
    };

    const onNodePointerUp = () => {
        dragStateRef.current = null;
    };

    return (
        <div>
            <div
                ref={canvasRef}
                onPointerDown={() => setSelectedDeviceId(null)}
                onClick={() => setSelectedDeviceId(null)}
                onDragOver={onCanvasDragOver}
                onDrop={onCanvasDrop}
                className="
          relative h-[72vh] min-h-[520px] w-full overflow-hidden rounded-2xl border bg-background
          [background-size:20px_20px]
          [background-image:linear-gradient(to_right,rgba(0,0,0,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.10)_1px,transparent_1px)]
          dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)]
        "
            >
                {deviceCount === 0 ? (
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="rounded-2xl border bg-background/80 p-4 text-center text-sm text-muted-foreground">
                            Drag a device from the right panel onto the grid.
                        </div>
                    </div>
                ) : null}

                {project.devices.map((d) => {
                    const pl = getPlacement(project, d.id);
                    if (!pl) return null;
                    const selected = selectedDeviceId === d.id;
                    return (
                        <div
                            key={d.id}
                            className={
                                "absolute select-none rounded-2xl border bg-background shadow-sm transition " +
                                (selected ? "ring-2 ring-foreground/40" : "hover:shadow")
                            }
                            style={{ width: NODE_W, height: NODE_H, left: pl.x, top: pl.y, cursor: "grab" }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                onNodePointerDown(e, d.id);
                            }}
                            onPointerMove={onNodePointerMove}
                            onPointerUp={onNodePointerUp}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDeviceId(d.id);
                            }}
                        >
                            <div className="flex h-full flex-col justify-between p-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold">{d.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {d.type}
                                            {d.subsystem ? ` • ${d.subsystem}` : ""}
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">
                                        <MousePointer2 className="mr-1 h-3 w-3" />
                                        drag
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-wrap gap-1">
                                        {deviceHasCanId(d.type) ? (
                                            <Badge variant="outline" className="text-[10px]">
                                                CAN {d.attrs?.canId ?? "—"}
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-[10px]">
                                                no CAN
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        ({pl.x}, {pl.y})
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div>Grid: {GRID}px • Drag from palette to create • Drag nodes to move • Snap enabled</div>
                <div>Next logical step: render connections as SVG paths using stored endpoints (ports) and node positions.</div>
            </div>
        </div>
    );
}

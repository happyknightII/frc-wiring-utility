import React from "react";
import { Badge } from "@/components/ui/badge";
import { MousePointer2 } from "lucide-react";
import type { DeviceType } from "../types";
import { deviceHasCanId } from "../helpers";

type DeviceLike = {
    id?: string;
    name: string;
    type: DeviceType;
    subsystem?: string;
    attrs?: { canId?: number };
};

export function SchematicNode(props: {
    device: DeviceLike;
    selected?: boolean;
    showDragBadge?: boolean; // show the "drag" badge (palette + canvas can decide)
    className?: string;
}) {
    const { device: d, selected, showDragBadge = true, className } = props;

    return (
        <div
            className={
                "h-full w-full select-none rounded-2xl border bg-background shadow-sm transition " +
                (selected ? "ring-2 ring-foreground/40" : "hover:shadow") +
                (className ? ` ${className}` : "")
            }
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

                    {showDragBadge ? (
                        <Badge variant="outline" className="text-[10px]">
                            <MousePointer2 className="mr-1 h-3 w-3" />
                            drag
                        </Badge>
                    ) : null}
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
                </div>
            </div>
        </div>
    );
}

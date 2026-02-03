import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DeviceType } from "../types";
import { PALETTE } from "../palette";

export function PalettePanel(props: {
    onPaletteDragStart: (e: React.DragEvent, type: DeviceType) => void;
    onQuickAdd: (type: DeviceType) => void;
}) {
    const { onPaletteDragStart, onQuickAdd } = props;

    return (
        <Card className="rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    {PALETTE.map((p) => (
                        <div
                            key={p.type}
                            draggable
                            onDragStart={(e) => onPaletteDragStart(e, p.type)}
                            className="rounded-xl border bg-background p-2 text-left hover:bg-muted/40"
                            title="Drag onto schematic"
                        >
                            <div className="text-sm font-semibold">{p.label}</div>
                            <div className="text-xs text-muted-foreground">{p.hint}</div>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground">Quick add (center)</div>
                    <Select onValueChange={(v) => onQuickAdd(v as DeviceType)}>
                        <SelectTrigger className="h-9 w-[180px]">
                            <SelectValue placeholder="Add device" />
                        </SelectTrigger>
                        <SelectContent>
                            {(PALETTE.map((x) => x.type) as DeviceType[]).map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}

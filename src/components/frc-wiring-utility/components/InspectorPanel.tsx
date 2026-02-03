import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { Device, DeviceType, Project } from "../types";
import { deviceHasCanId, portsFor, safeInt } from "../helpers";
import { PALETTE } from "../palette";

export function InspectorPanel(props: {
    project: Project;
    selectedDeviceId: string | null;
    onDeleteDevice: (id: string) => void;
    onPatchDevice: (id: string, patch: Partial<Device>) => void;
    onSetDeviceType: (id: string, newType: DeviceType) => void;
    onSetCanId: (id: string, canId: number | undefined) => void;
}) {
    const { project, selectedDeviceId, onDeleteDevice, onPatchDevice, onSetDeviceType, onSetCanId } = props;

    const selectedDevice = useMemo(
        () => (selectedDeviceId ? project.devices.find((d) => d.id === selectedDeviceId) : undefined),
        [project.devices, selectedDeviceId]
    );

    return (
        <Card className="rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Inspector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {!selectedDevice ? (
                    <div className="rounded-xl border p-3 text-sm text-muted-foreground">Select a device on the schematic to edit.</div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">{selectedDevice.name}</div>
                                <div className="text-xs text-muted-foreground">ID: {selectedDevice.id}</div>
                            </div>
                            <Button variant="destructive" className="h-8" onClick={() => onDeleteDevice(selectedDevice.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs">Name</Label>
                            <Input value={selectedDevice.name} onChange={(e) => onPatchDevice(selectedDevice.id, { name: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Type</Label>
                                <Select value={selectedDevice.type} onValueChange={(v) => onSetDeviceType(selectedDevice.id, v as DeviceType)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue />
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

                            <div className="space-y-1">
                                <Label className="text-xs">Subsystem</Label>
                                <Input
                                    className="h-9"
                                    value={selectedDevice.subsystem ?? ""}
                                    onChange={(e) => onPatchDevice(selectedDevice.id, { subsystem: e.target.value })}
                                    placeholder="drivetrain"
                                />
                            </div>
                        </div>

                        {deviceHasCanId(selectedDevice.type) ? (
                            <div className="grid gap-2">
                                <Label className="text-xs">CAN ID</Label>
                                <Input
                                    value={selectedDevice.attrs?.canId === undefined ? "" : String(selectedDevice.attrs?.canId)}
                                    onChange={(e) => onSetCanId(selectedDevice.id, safeInt(e.target.value))}
                                    placeholder="12"
                                />
                            </div>
                        ) : null}

                        <div className="space-y-1">
                            <Label className="text-xs">Ports</Label>
                            <div className="flex flex-wrap gap-2">
                                {portsFor(selectedDevice.type).map((p) => (
                                    <Badge key={p} variant="outline">
                                        {p}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="text-xs text-muted-foreground">
                            Position is stored in <code>project.placements</code>. If you later add a real connection renderer, you’ll compute endpoints from node
                            positions + port anchors.
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

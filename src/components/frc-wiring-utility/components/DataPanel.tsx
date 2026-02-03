import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataPanel() {
    return (
        <Card className="rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Data</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
                <div>
                    Export includes devices/nets/connections plus <code>placements</code>.
                </div>
                <div>
                    If you import older JSON without <code>placements</code>, devices will show as “not placed” warnings until you drop/move them.
                </div>
            </CardContent>
        </Card>
    );
}

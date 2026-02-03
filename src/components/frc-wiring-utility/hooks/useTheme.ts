import * as React from "react";

export function useTheme() {
    const [theme, setTheme] = React.useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "light";
        const saved = window.localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
    });

    React.useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
        window.localStorage.setItem("theme", theme);
    }, [theme]);

    return { theme, setTheme };
}

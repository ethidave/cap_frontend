"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function SupportWidget() {
    const [widgetConfig, setWidgetConfig] = useState<string | null>(null);

    useEffect(() => {
        async function loadConfig() {
            try {
                const settings = await api.get("/settings/public");
                if (settings && settings.TINYCHAT_WIDGET) {
                    setWidgetConfig(settings.TINYCHAT_WIDGET);
                }
            } catch (e) {
                console.error("Failed to load support widget config", e);
            }
        }
        loadConfig();
    }, []);

    useEffect(() => {
        if (!widgetConfig) return;

        // Pattern 1: Raw Script Tag
        if (widgetConfig.includes("<script")) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(widgetConfig, 'text/html');
            const scriptTag = doc.querySelector('script');
            
            if (scriptTag) {
                const script = document.createElement('script');
                // Copy all attributes (src, data-id, async, defer, etc.)
                Array.from(scriptTag.attributes).forEach(attr => {
                    script.setAttribute(attr.name, attr.value);
                });
                // Copy inner content if any
                if (scriptTag.innerHTML) {
                    script.innerHTML = scriptTag.innerHTML;
                }
                document.body.appendChild(script);
            }
        } 
        // Pattern 2: Just a URL
        else if (widgetConfig.startsWith("http")) {
            const script = document.createElement('script');
            script.src = widgetConfig;
            script.async = true;
            document.body.appendChild(script);
        }
    }, [widgetConfig]);

    return null; // This component doesn't render anything itself
}

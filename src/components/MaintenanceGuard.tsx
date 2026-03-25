"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            // 1. DYNAMIC ADMIN CHECK: Check fresh values on every poll
            const adminToken = localStorage.getItem("admin_token");
            const userToken = localStorage.getItem("user_token");
            const isAtAdminPath = pathname.startsWith("/admin");

            // Simple JWT decoder
            const decode = (t: string | null) => {
                if (!t) return null;
                try {
                    const base64Url = t.split(".")[1];
                    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                    return JSON.parse(atob(base64));
                } catch (e) { return null; }
            }

            const adminPayload = decode(adminToken);
            const userPayload = decode(userToken);
            
            const isAdmin = 
                isAtAdminPath || 
                adminPayload?.role === 'ADMIN' || 
                userPayload?.role === 'ADMIN';

            // 2. BYPASS: If admin, never apply maintenance logic
            if (isAdmin) {
                // If an admin is visiting the maintenance page, move them to home
                if (pathname === "/maintenance") {
                    router.replace("/");
                }
                return;
            }

            try {
                // 3. FETCH: Check maintenance status from server
                const res = await fetch("/api/maintenance-status");
                if (!res.ok) return;
                const data = await res.json();

                if (data.maintenance) {
                    // 4. SECURITY: Automatic session wipe for regular users
                    localStorage.removeItem("user_token");
                    localStorage.removeItem("user_data");
                    localStorage.removeItem("temp_user_id");
                    localStorage.removeItem("pending_email");
                    
                    if (pathname !== "/maintenance") {
                        router.replace("/maintenance");
                    }
                } else if (pathname === "/maintenance") {
                    // Online: Exit maintenance screen
                    router.replace("/");
                }
            } catch (error) {
                // Network errors shouldn't crash the app
                console.debug("Maintenance poll skipped:", error);
            }
        };

        // Initial check and fast polling for 'professional' responsiveness
        checkStatus();
        const interval = setInterval(checkStatus, 4000); 
        return () => clearInterval(interval);
    }, [pathname, router]);

    return <>{children}</>;
}

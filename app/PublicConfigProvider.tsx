"use client";

import { useEffect } from "react";
import { appConfigStore, defaultConfig } from "@/src/entities/app-config";
import { watchModelStore } from "@/src/entities/watch-model";
import { strapModelStore } from "@/src/entities/strap-model";
import { watchModels } from "@/src/shared/lib/watchModel";
import { strapModel } from "@/shared/lib/strapModel";
import type { AppConfig } from "@/src/shared/types/AppConfigTypes";
import { mergeAppConfig } from "@/src/shared/lib/mergeAppConfig";
import { fetchPublicConfig } from "@/src/shared/lib/fetchPublicConfig";
import { redirectToForbiddenIfNeeded } from "@/src/shared/lib/forbidden";

export function PublicConfigProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let isMounted = true;

    const applyFallbackConfig = () => {
      watchModelStore.setWatchModels(watchModels);
      strapModelStore.setStrapModels(strapModel);
    };

    const applyStoresFromPayload = (data: Partial<AppConfig>) => {
      const isProduction = process.env.NODE_ENV === "production";
      watchModelStore.setWatchModels(
        isProduction
          ? (Array.isArray(data.watchModels) ? data.watchModels : [])
          : Array.isArray(data.watchModels) && data.watchModels.length
            ? data.watchModels
            : watchModels
      );
      strapModelStore.setStrapModels(
        isProduction
          ? (Array.isArray(data.strapModels) ? data.strapModels : [])
          : Array.isArray(data.strapModels) && data.strapModels.length
            ? data.strapModels
            : strapModel
      );
    };

    const loadPublicConfig = async () => {
      const maxAttempts = 2;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const response = await fetchPublicConfig();
          if (redirectToForbiddenIfNeeded(response)) return;
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as Partial<AppConfig>;
          if (!isMounted) return;

          const mergedConfig = mergeAppConfig(defaultConfig, data ?? {});
          appConfigStore.setConfig(mergedConfig);
          applyStoresFromPayload(data);
          return;
        } catch (err) {
          if (attempt < maxAttempts - 1) {
            await new Promise((r) => setTimeout(r, 500));
            continue;
          }
          // eslint-disable-next-line no-console
          console.error("[PublicConfigProvider] Не удалось загрузить /api/public/app-config:", err);
          if (!isMounted) return;
          if (process.env.NODE_ENV !== "production") {
            applyFallbackConfig();
          } else {
            watchModelStore.setWatchModels([]);
            strapModelStore.setStrapModels([]);
          }
          appConfigStore.setConfig(mergeAppConfig(defaultConfig, {}));
        }
      }
    };

    loadPublicConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { appConfigStore, defaultConfig } from "@/src/entities/app-config";
import { watchModelStore } from "@/src/entities/watch-model";
import { strapModelStore } from "@/src/entities/strap-model";
import { watchModels } from "@/src/shared/lib/watchModel";
import { strapModel } from "@/shared/lib/strapModel";
import type { AppConfig } from "@/src/shared/types/AppConfigTypes";
import { redirectToForbiddenIfNeeded } from "@/src/shared/lib/forbidden";

export function PublicConfigProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let isMounted = true;

    const applyFallbackConfig = () => {
      watchModelStore.setWatchModels(watchModels);
      strapModelStore.setStrapModels(strapModel);
    };

    const loadPublicConfig = async () => {
      try {
        const response = await fetch("/api/public/config", { cache: "no-store" });
        if (redirectToForbiddenIfNeeded(response)) return;
        if (!response.ok) throw new Error("Failed to load public config");
        const data = (await response.json()) as AppConfig;
        if (!isMounted) return;

        const step4FromApi = data.step4;
        const defaultStep4 = defaultConfig.step4;
        const apiSections = step4FromApi?.sections;
        const useDefaultSections =
          !Array.isArray(apiSections) || apiSections.length < 3;
        const mergedConfig: AppConfig = {
          ...data,
          step4: {
            ...defaultStep4,
            ...step4FromApi,
            sections: useDefaultSections ? (defaultStep4?.sections ?? []) : apiSections
          }
        };
        appConfigStore.setConfig(mergedConfig);
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
      } catch {
        if (!isMounted) return;
        if (process.env.NODE_ENV !== "production") {
          applyFallbackConfig();
        } else {
          watchModelStore.setWatchModels([]);
          strapModelStore.setStrapModels([]);
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

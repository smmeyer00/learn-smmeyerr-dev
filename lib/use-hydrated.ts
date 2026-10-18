import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

/** Controlled text inputs stay disabled until their event handlers are ready. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, clientReady, serverReady);
}

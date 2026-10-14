import { invoke } from "@tauri-apps/api/core";

export const tokenStore = {
  save: (value: string) => invoke("save_token", { token: value }),
  get: () => invoke<string | null>("get_token"),
  clear: () => invoke("delete_token"),
};
// src/utils/asset.js
export function asset(path) {
    return import.meta.env.BASE_URL + path
  }
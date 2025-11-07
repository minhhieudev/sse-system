import clsx from "clsx";

export const HIGH_WRAPPER_Z = "!z-[2147483646]";
export const HIGH_BASE_Z = "!z-[2147483647]";
export const HIGH_BACKDROP_Z = "!z-[2147483645]";

export function withHighZIndex(overrides = {}) {
  return {
    wrapper: clsx(HIGH_WRAPPER_Z, overrides.wrapper),
    base: clsx(HIGH_BASE_Z, overrides.base),
    backdrop: clsx(HIGH_BACKDROP_Z, overrides.backdrop),
  };
}

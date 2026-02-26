type NavigateFn = (path: string) => void;

let _navigate: NavigateFn | null = null;

/** Called once by GameLayout to register React Router's navigate function. */
export function registerNavigate(fn: NavigateFn) {
  _navigate = fn;
}

/** Navigate to a route from anywhere (including R3F hooks outside the React tree). */
export function navigateTo(path: string) {
  _navigate?.(path);
}

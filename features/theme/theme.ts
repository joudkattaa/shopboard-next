export type Theme = "light" | "dark";
export const THEME_KEY = "roseveil-theme";
export function resolveTheme(saved: unknown, systemDark: boolean): Theme { return saved === "light" || saved === "dark" ? saved : systemDark ? "dark" : "light"; }
// Static code only: never interpolate user input into this pre-paint script.
export const themeBootstrap = `(function(){var saved;try{saved=localStorage.getItem('roseveil-theme')}catch(e){}var dark=typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=saved==='light'||saved==='dark'?saved:dark?'dark':'light'})();`;

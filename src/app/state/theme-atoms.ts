import { atom } from 'jotai';
import { normalizeThemePreference, type ThemePreference } from '../styles/theme.css';
import { settingsAtom } from './bmc-settings';

export const themePreferenceAtom = atom<ThemePreference, [ThemePreference], void>(
    (get) => {
        const settings = get(settingsAtom);
        return settings instanceof Promise ? 'dark_canopy' : settings.theme;
    },
    (get, set, nextTheme) => {
        const settings = get(settingsAtom);
        if (settings instanceof Promise) return;
        const theme = normalizeThemePreference(nextTheme);

        if (settings.theme === theme) return;

        set(settingsAtom, {
            ...settings,
            theme,
        });
    },
);

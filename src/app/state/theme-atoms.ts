import { atom } from 'jotai';
import { normalizeThemePreference, type ThemePreference } from '../styles/theme.css';
import { settingsAtom } from './bmc-settings';

export const themePreferenceAtom = atom<ThemePreference, [ThemePreference], void>(
    (get) => get(settingsAtom).theme,
    (get, set, nextTheme) => {
        const settings = get(settingsAtom);
        const theme = normalizeThemePreference(nextTheme);

        if (settings.theme === theme) return;

        set(settingsAtom, {
            ...settings,
            theme,
        });
    },
);

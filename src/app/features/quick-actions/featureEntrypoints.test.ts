import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    buildFeatureEntrypointRegistry,
    FEATURE_ROLLOUT_FLAGS_STORAGE_KEY,
    FEATURE_ROLLOUT_PRESET_STORAGE_KEY,
    getQuickActionEntriesForSurface,
    invokeQuickAction,
    QUICK_ACTION_FIRST_RUN_STORAGE_KEY,
    QUICK_ACTION_COLLAPSED_STORAGE_KEY,
    readQuickActionCollapsed,
    writeQuickActionCollapsed,
    getUnseenQuickActionIds,
    markQuickActionsSeen,
} from './featureEntrypoints';

const createStorage = () => {
    const map = new Map<string, string>();
    return {
        clear: () => map.clear(),
        getItem: (key: string) => map.get(key) ?? null,
        key: (index: number) => [...map.keys()][index] ?? null,
        removeItem: (key: string) => map.delete(key),
        setItem: (key: string, value: string) => map.set(key, value),
        get length() {
            return map.size;
        },
    } satisfies Storage;
};

describe('feature entrypoint registry adapter', () => {
    beforeEach(() => {
        Object.defineProperty(globalThis, 'localStorage', {
            value: createStorage(),
            configurable: true,
        });
        localStorage.clear();
    });

    it('respects preset + flag visibility', () => {
        const safer = buildFeatureEntrypointRegistry({ preset: 'safer' });
        expect(safer.entries.map((entry) => entry.id)).toEqual([]);

        const governanceWithSearch = buildFeatureEntrypointRegistry({
            preset: 'governance',
            flags: { 'features.nav.search': true },
        });
        expect(governanceWithSearch.entries.map((entry) => entry.id)).toEqual([
            'open-settings',
            'open-devices',
            'open-inbox',
            'open-search',
        ]);
    });

    it('supports progressive rollout presets and kill switches', () => {
        localStorage.setItem(FEATURE_ROLLOUT_PRESET_STORAGE_KEY, 'forum');
        localStorage.setItem(
            FEATURE_ROLLOUT_FLAGS_STORAGE_KEY,
            JSON.stringify({ 'features.nav.search': true }),
        );
        localStorage.setItem('blackout.killSwitch.features.bmc.forum', 'true');

        const registry = buildFeatureEntrypointRegistry();
        expect(registry.preset).toBe('forum');
        expect(registry.flags['features.nav.search']).toBe(true);
        expect(registry.flags['features.bmc.forum']).toBe(false);
    });

    it('invokes quick actions via the action adapter', () => {
        const calls: string[] = [];
        const queueCommand = vi.fn((command: '/join' | '/invite') => calls.push(command));

        invokeQuickAction('open-settings', {
            openSettings: () => calls.push('settings'),
            openDevices: () => calls.push('devices'),
            toggleInbox: () => calls.push('inbox'),
            openThreads: () => calls.push('threads'),
            openSearch: () => calls.push('search'),
            queueCommand,
        });

        invokeQuickAction('compose-join', {
            openSettings: () => calls.push('settings'),
            openDevices: () => calls.push('devices'),
            toggleInbox: () => calls.push('inbox'),
            openThreads: () => calls.push('threads'),
            openSearch: () => calls.push('search'),
            queueCommand,
        });

        expect(calls).toEqual(['settings', '/join']);
        expect(queueCommand).toHaveBeenCalledWith('/join');
    });

    it('maintains mobile/desktop render parity and first-run guidance behavior', () => {
        const registry = buildFeatureEntrypointRegistry({ preset: 'sovereignty' });
        const desktopIds = getQuickActionEntriesForSurface(registry, 'desktop').map(
            (entry) => entry.id,
        );
        const mobileIds = getQuickActionEntriesForSurface(registry, 'mobile').map(
            (entry) => entry.id,
        );

        expect(desktopIds).toEqual(mobileIds);

        expect(getUnseenQuickActionIds(registry.entries).length).toBe(desktopIds.length);
        markQuickActionsSeen(desktopIds);
        expect(getUnseenQuickActionIds(registry.entries)).toEqual([]);

        writeQuickActionCollapsed(true);
        expect(localStorage.getItem(QUICK_ACTION_COLLAPSED_STORAGE_KEY)).toBe('true');
        expect(readQuickActionCollapsed()).toBe(true);
        expect(localStorage.getItem(QUICK_ACTION_FIRST_RUN_STORAGE_KEY)).toContain('open-settings');
    });
});

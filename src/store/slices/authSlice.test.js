import { beforeEach, describe, expect, it, vi } from 'vitest';

let values;
beforeEach(() => {
  vi.resetModules();
  values = new Map();
  vi.stubGlobal('localStorage', {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  });
});

describe('authentication persistence', () => {
  it('starts safely when stored user JSON is corrupted', async () => {
    values.set('user', '{invalid');
    const { default: reducer } = await import('./authSlice');
    expect(reducer(undefined, { type: 'init' }).user).toBeNull();
    expect(values.has('user')).toBe(false);
  });

  it('logout clears only authentication keys', async () => {
    values.set('user', JSON.stringify({ id: 7 }));
    values.set('role', '1');
    values.set('theme', 'dark');
    const { default: reducer, logoutUser } = await import('./authSlice');
    const state = reducer(undefined, { type: logoutUser.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(values.has('user')).toBe(false);
    expect(values.has('role')).toBe(false);
    expect(values.get('theme')).toBe('dark');
  });

  it('persists the logged in user and normalizes the role', async () => {
    const { default: reducer, loginUser } = await import('./authSlice');
    const user = { id: 7, name: 'Client', role_id: 1 };
    const state = reducer(undefined, { type: loginUser.fulfilled.type, payload: { user } });
    expect(state.role).toBe('1');
    expect(JSON.parse(values.get('user'))).toEqual(user);
  });
});

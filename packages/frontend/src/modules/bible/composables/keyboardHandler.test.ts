import { useKeyboardHandler } from './keyboardHandler';
import { vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

test('register and unregister key', () => {
  const handler = useKeyboardHandler();
  expect(
    handler.registerKey('ArrowLeft', () => {
      return;
    }),
  ).toBe(true);
  expect(handler.unregisterKey('ArrowLeft')).toBe(true);
});

test('register key twice', () => {
  const handler = useKeyboardHandler();
  expect(
    handler.registerKey('ArrowLeft', () => {
      return;
    }),
  ).toBe(true);

  expect(
    handler.registerKey('ArrowLeft', () => {
      return;
    }),
  ).toBe(false);

  expect(handler.unregisterKey('ArrowLeft')).toBe(true);
});

test('unregister key twice', () => {
  const handler = useKeyboardHandler();
  expect(
    handler.registerKey('ArrowLeft', () => {
      return;
    }),
  ).toBe(true);

  expect(handler.unregisterKey('ArrowLeft')).toBe(true);
  expect(handler.unregisterKey('ArrowLeft')).toBe(false);
});

test('register after unregstering', () => {
  const handler = useKeyboardHandler();
  expect(
    handler.registerKey('ArrowLeft', () => {
      return;
    }),
  ).toBe(true);

  expect(handler.unregisterKey('ArrowLeft')).toBe(true);
  expect(
    handler.registerKey('ArrowLeft', () => {
      return;
    }),
  ).toBe(true);
  expect(handler.unregisterKey('ArrowLeft')).toBe(true);
});

test('call registered handler', () => {
  const handler = useKeyboardHandler();
  const fun = vi.fn();
  expect(handler.registerKey('ArrowLeft', fun)).toBe(true);

  window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
  expect(fun).toHaveBeenCalled();
  expect(handler.unregisterKey('ArrowLeft')).toBe(true);
});

test('call non-registered handler', () => {
  const handler = useKeyboardHandler();
  const fun = vi.fn();
  expect(handler.registerKey('ArrowLeft', fun)).toBe(true);

  window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
  expect(fun).not.toHaveBeenCalled();
  expect(handler.unregisterKey('ArrowLeft')).toBe(true);
});

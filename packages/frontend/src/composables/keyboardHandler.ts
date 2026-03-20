/**
 * Simple interface for registering and removing callbacks for key presses.
 *
 * This implementation checks that each key has only one callback.
 * Callbacks are registered with registerKey and unregisterKey functions
 * returned from useKeyboardHandler.
 */

export interface RegisterKey {
  registerKey: (code: string, callback: () => void | Promise<void>) => boolean;
  unregisterKey: (code: string) => boolean;
  setActive: () => void;
  setInactive: () => void;
}

const keyBindings: Map<string, () => void | Promise<void>> = new Map();

let active: boolean = true;

function registered(code: string) {
  return keyBindings.has(code);
}

async function execute(code: string) {
  if (registered(code) && active) {
    const callback = keyBindings.get(code);
    if (typeof callback === 'function') {
      await callback();
    }
  }
}

window.addEventListener('keyup', (e: KeyboardEvent) => {
  void execute(e.key);
});

/**
 * Composable with keyboard press handling functionality.
 *
 * Function provides interface for registering keyboard callbacks.
 * It checks, that each key has only one callback. Next can be mounted only if
 * the previous one was removed.
 *
 * @returns registerKey and unregisterKey functions
 */
export function useKeyboardHandler(): RegisterKey {
  const allowedCodes = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Backspace',
    'Enter',
    'Escape',
  ];

  const registerKey = (
    code: string,
    callback: () => void | Promise<void>,
  ): boolean => {
    if (allowedCodes.includes(code) && !registered(code)) {
      keyBindings.set(code, callback);
      return true;
    }
    return false;
  };

  const unregisterKey = (code: string): boolean => {
    if (registered(code)) {
      keyBindings.delete(code);
      return true;
    }
    return false;
  };

  const setActive = (): void => {
    active = true;
  };

  const setInactive = (): void => {
    active = false;
    console.log(active);
  };

  return {
    registerKey: registerKey,
    unregisterKey: unregisterKey,
    setActive: setActive,
    setInactive: setInactive,
  };
}

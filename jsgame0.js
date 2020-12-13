/*
 * An enumeration of buttons that can be received by the on_mouse_* handlers.
 *
 * These DO NOT have the same values as the IntEnum in Pygame Zero.
 * Instead, they match the buttons bitmask in MouseEvent.
 *
 * Mouse wheel support is non-standard so WHEEL_UP and WHEEL_DOWN
 * map to the side buttons (back and forward) on a 5 button mouse.
 * Predictably, the browser navigates away when you click them so
 * you may not see them.
 */
const mouse = Object.freeze({
  LEFT: 1,
  MIDDLE: 4,
  RIGHT: 2,
  WHEEL_UP: 8,
  WHEEL_DOWN: 16
});

/*
 * An enumeration of keys that can be received by the on_key_* handlers.
 *
 * These DO NOT have the same values as the IntEnum in Pygame Zero.
 * Instead, they match the KeyboardEvent.code values.
 *
 * The shift version of keys are added as single character values.
 */
const keys = Object.freeze({
  BACKSPACE: "Backspace",
  TAB: "Tab",
  CLEAR: "Clear",
  RETURN: "Enter",
  PAUSE: "Pause",
  ESCAPE: "Escape",
  SPACE: "Space",
  EXCLAIM: "!",
  QUOTEDBL: '"',
  HASH: "#",
  DOLLAR: "$",
  AMPERSAND: "&",
  QUOTE: "Quote",
  LEFTPAREN: "(",
  RIGHTPAREN: ")",
  ASTERISK: "*",
  PLUS: "+",
  COMMA: "Comma",
  MINUS: "Minus",
  PERIOD: "Period",
  SLASH: "Slash",
  K_0: "Digit0",
  K_1: "Digit1",
  K_2: "Digit2",
  K_3: "Digit3",
  K_4: "Digit4",
  K_5: "Digit5",
  K_6: "Digit6",
  K_7: "Digit7",
  K_8: "Digit8",
  K_9: "Digit9",
  COLON: ":",
  SEMICOLON: "Semicolon",
  LESS: "<",
  EQUALS: "Equal",
  GREATER: ">",
  QUESTION: "?",
  AT: "@",
  LEFTBRACKET: "BracketLeft",
  BACKSLASH: "Backslash",
  RIGHTBRACKET: "BracketRight",
  CARET: "^",
  UNDERSCORE: "_",
  BACKQUOTE: "Backquote",
  A: "KeyA",
  B: "KeyB",
  C: "KeyC",
  D: "KeyD",
  E: "KeyE",
  F: "KeyF",
  G: "KeyG",
  H: "KeyH",
  I: "KeyI",
  J: "KeyJ",
  K: "KeyK",
  L: "KeyL",
  M: "KeyM",
  N: "KeyN",
  O: "KeyO",
  P: "KeyP",
  Q: "KeyQ",
  R: "KeyR",
  S: "KeyS",
  T: "KeyT",
  U: "KeyU",
  V: "KeyV",
  W: "KeyW",
  X: "KeyX",
  Y: "KeyY",
  Z: "KeyZ",
  DELETE: "Delete",
  KP0: "Numdpad0",
  KP1: "Numdpad1",
  KP2: "Numdpad2",
  KP3: "Numdpad3",
  KP4: "Numdpad4",
  KP5: "Numdpad5",
  KP6: "Numdpad6",
  KP7: "Numdpad7",
  KP8: "Numdpad8",
  KP9: "Numdpad9",
  KP_PERIOD: "NumdpadDecimal",
  KP_DIVIDE: "NumdpadDivide",
  KP_MULTIPLY: "NumdpadMultiply",
  KP_MINUS: "NumdpadSubtract",
  KP_PLUS: "NumdpadAdd",
  KP_ENTER: "NumdpadEnter",
  KP_EQUALS: "NumdpadEqual",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  RIGHT: "ArrowRight",
  LEFT: "ArrowLeft",
  INSERT: "Insert",
  HOME: "Home",
  END: "End",
  PAGEUP: "PageUp",
  PAGEDOWN: "PageDown",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F13: "F13",
  F14: "F14",
  F15: "F15",
  NUMLOCK: "NumLock",
  CAPSLOCK: "Capslock",
  SCROLLOCK: "ScrollLock",
  RSHIFT: "ShiftRight",
  LSHIFT: "ShiftLeft",
  RCTRL: "ControlRight",
  LCTRL: "ControlLeft",
  RALT: "AltRight",
  LALT: "AltLeft",
  RMETA: "MetaRight",
  LMETA: "MetaLeft",
  LSUPER: "OSLeft",
  RSUPER: "OSRight",
  MODE: "KanaMode",
  HELP: "Help",
  PRINT: "PrintScreen",
  SYSREQ: "SysReq",
  BREAK: "Break",
  MENU: "ContextMenu",
  POWER: "Power",
  EURO: "Euro",
  LAST: "Last"
});

/*
 * Bitmask constants representing modifier keys that may have been
 * depressed during an on_key_up / on_key_down event.
 *
 * These DO NOT have the same values as the IntEnum in Pygame Zero.
 */
const keymods = Object.freeze({
  LSHIFT: 1,
  RSHIFT: 2,
  SHIFT: 4,
  LCTRL: 8,
  RCTRL: 16,
  CTRL: 32,
  LALT: 64,
  RALT: 128,
  ALT: 256,
  LMETA: 512,
  RMETA: 1024,
  META: 2048,
  NUM: 4096,
  CAPS: 8192,
  MODE: 16384
});

/*
 * You can only query the keyboard builtin using the keys enumeration.
 */
const keyboard = (function () {
  /*
   * Set of keys that map to multiple characters.
   *
   * For example, 1 and !, 2 and @, / and ?.
   */
  const DUAL_SET = new Set();
  for (const k of Object.getOwnPropertyNames(keys)) {
    let v = keys[k];
    if ((typeof v === 'string') && (v.length === 1)) {
      DUAL_SET.add(v);
    }
  }

  /*
   * Set of keys currently being pressed.
   */
  const KEY_SET = new Set();

  return {
    /*
     * Return the value of the key that was pressed in event.
     */
    _lookup(event) {
      if (DUAL_SET.has(event.key)) {
        // If the key maps to multiple characters depending on SHIFT
        return event.key;
      }
      return event.code;
    },

    /*
     * Record the key that was pressed in event.
     */
    _press(event) {
      if (DUAL_SET.has(event.key)) {
        // If the key maps to multiple characters depending on SHIFT
        KEY_SET.add(event.key);
      }
      KEY_SET.add(event.code);
    },

    /*
     * Erase the key that was released in event.
     */
    _release(event) {
      KEY_SET.delete(event.key);
      KEY_SET.delete(event.code);
    },

    /*
     * Return a bitmask of modifier keys that were depressed.
     *
     * There is no way to tell if Num Lock or Caps Lock are on or off.
     * So they are omitted.
     */
    get bitmask() {
      let bitmask = 0;
      if (KEY_SET.has(keys.LSHIFT)) {
        bitmask |= keymods.LSHIFT;
        bitmask |= keymods.SHIFT;
      }
      if (KEY_SET.has(keys.RSHIFT)) {
        bitmask |= keymods.RSHIFT;
        bitmask |= keymods.SHIFT;
      }
      if (KEY_SET.has(keys.LCTRL)) {
        bitmask |= keymods.LCTRL;
        bitmask |= keymods.CTRL;
      }
      if (KEY_SET.has(keys.RCTRL)) {
        bitmask |= keymods.RCTRL;
        bitmask |= keymods.CTRL;
      }
      if (KEY_SET.has(keys.LALT)) {
        bitmask |= keymods.LALT;
        bitmask |= keymods.ALT;
      }
      if (KEY_SET.has(keys.RALT)) {
        bitmask |= keymods.RALT;
        bitmask |= keymods.ALT;
      }
      if (KEY_SET.has(keys.LMETA)) {
        bitmask |= keymods.LMETA;
        bitmask |= keymods.META;
      }
      if (KEY_SET.has(keys.RMETA)) {
        bitmask |= keymods.RMETA;
        bitmask |= keymods.META;
      }
      if (KEY_SET.has(keys.MODE)) {
        bitmask |= keymods.MODE;
      }

      return bitmask;
    },

    /*
     * Alias the enum values as getters.
     */
    get [keys.BACKSPACE]() {
      return KEY_SET.has(keys.BACKSPACE);
    },
    get [keys.TAB]() {
      return KEY_SET.has(keys.TAB);
    },
    get [keys.CLEAR]() {
      return KEY_SET.has(keys.CLEAR);
    },
    get [keys.RETURN]() {
      return KEY_SET.has(keys.RETURN);
    },
    get [keys.PAUSE]() {
      return KEY_SET.has(keys.PAUSE);
    },
    get [keys.ESCAPE]() {
      return KEY_SET.has(keys.ESCAPE);
    },
    get [keys.SPACE]() {
      return KEY_SET.has(keys.SPACE);
    },
    get [keys.EXCLAIM]() {
      return KEY_SET.has(keys.EXCLAIM);
    },
    get [keys.QUOTEDBL]() {
      return KEY_SET.has(keys.QUOTEDBL);
    },
    get [keys.HASH]() {
      return KEY_SET.has(keys.HASH);
    },
    get [keys.DOLLAR]() {
      return KEY_SET.has(keys.DOLLAR);
    },
    get [keys.AMPERSAND]() {
      return KEY_SET.has(keys.AMPERSAND);
    },
    get [keys.QUOTE]() {
      return KEY_SET.has(keys.QUOTE);
    },
    get [keys.LEFTPAREN]() {
      return KEY_SET.has(keys.LEFTPAREN);
    },
    get [keys.RIGHTPAREN]() {
      return KEY_SET.has(keys.RIGHTPAREN);
    },
    get [keys.ASTERISK]() {
      return KEY_SET.has(keys.ASTERISK);
    },
    get [keys.PLUS]() {
      return KEY_SET.has(keys.PLUS);
    },
    get [keys.COMMA]() {
      return KEY_SET.has(keys.COMMA);
    },
    get [keys.MINUS]() {
      return KEY_SET.has(keys.MINUS);
    },
    get [keys.PERIOD]() {
      return KEY_SET.has(keys.PERIOD);
    },
    get [keys.SLASH]() {
      return KEY_SET.has(keys.SLASH);
    },
    get [keys.K_0]() {
      return KEY_SET.has(keys.K_0);
    },
    get [keys.K_1]() {
      return KEY_SET.has(keys.K_1);
    },
    get [keys.K_2]() {
      return KEY_SET.has(keys.K_2);
    },
    get [keys.K_3]() {
      return KEY_SET.has(keys.K_3);
    },
    get [keys.K_4]() {
      return KEY_SET.has(keys.K_4);
    },
    get [keys.K_5]() {
      return KEY_SET.has(keys.K_5);
    },
    get [keys.K_6]() {
      return KEY_SET.has(keys.K_6);
    },
    get [keys.K_7]() {
      return KEY_SET.has(keys.K_7);
    },
    get [keys.K_8]() {
      return KEY_SET.has(keys.K_8);
    },
    get [keys.K_9]() {
      return KEY_SET.has(keys.K_9);
    },
    get [keys.COLON]() {
      return KEY_SET.has(keys.COLON);
    },
    get [keys.SEMICOLON]() {
      return KEY_SET.has(keys.SEMICOLON);
    },
    get [keys.LESS]() {
      return KEY_SET.has(keys.LESS);
    },
    get [keys.EQUALS]() {
      return KEY_SET.has(keys.EQUALS);
    },
    get [keys.GREATER]() {
      return KEY_SET.has(keys.GREATER);
    },
    get [keys.QUESTION]() {
      return KEY_SET.has(keys.QUESTION);
    },
    get [keys.AT]() {
      return KEY_SET.has(keys.AT);
    },
    get [keys.LEFTBRACKET]() {
      return KEY_SET.has(keys.LEFTBRACKET);
    },
    get [keys.BACKSLASH]() {
      return KEY_SET.has(keys.BACKSLASH);
    },
    get [keys.RIGHTBRACKET]() {
      return KEY_SET.has(keys.RIGHTBRACKET);
    },
    get [keys.CARET]() {
      return KEY_SET.has(keys.CARET);
    },
    get [keys.UNDERSCORE]() {
      return KEY_SET.has(keys.UNDERSCORE);
    },
    get [keys.BACKQUOTE]() {
      return KEY_SET.has(keys.BACKQUOTE);
    },
    get [keys.A]() {
      return KEY_SET.has(keys.A);
    },
    get [keys.B]() {
      return KEY_SET.has(keys.B);
    },
    get [keys.C]() {
      return KEY_SET.has(keys.C);
    },
    get [keys.D]() {
      return KEY_SET.has(keys.D);
    },
    get [keys.E]() {
      return KEY_SET.has(keys.E);
    },
    get [keys.F]() {
      return KEY_SET.has(keys.F);
    },
    get [keys.G]() {
      return KEY_SET.has(keys.G);
    },
    get [keys.H]() {
      return KEY_SET.has(keys.H);
    },
    get [keys.I]() {
      return KEY_SET.has(keys.I);
    },
    get [keys.J]() {
      return KEY_SET.has(keys.J);
    },
    get [keys.K]() {
      return KEY_SET.has(keys.K);
    },
    get [keys.L]() {
      return KEY_SET.has(keys.L);
    },
    get [keys.M]() {
      return KEY_SET.has(keys.M);
    },
    get [keys.N]() {
      return KEY_SET.has(keys.N);
    },
    get [keys.O]() {
      return KEY_SET.has(keys.O);
    },
    get [keys.P]() {
      return KEY_SET.has(keys.P);
    },
    get [keys.Q]() {
      return KEY_SET.has(keys.Q);
    },
    get [keys.R]() {
      return KEY_SET.has(keys.R);
    },
    get [keys.S]() {
      return KEY_SET.has(keys.S);
    },
    get [keys.T]() {
      return KEY_SET.has(keys.T);
    },
    get [keys.U]() {
      return KEY_SET.has(keys.U);
    },
    get [keys.V]() {
      return KEY_SET.has(keys.V);
    },
    get [keys.W]() {
      return KEY_SET.has(keys.W);
    },
    get [keys.X]() {
      return KEY_SET.has(keys.X);
    },
    get [keys.Y]() {
      return KEY_SET.has(keys.Y);
    },
    get [keys.Z]() {
      return KEY_SET.has(keys.Z);
    },
    get [keys.DELETE]() {
      return KEY_SET.has(keys.DELETE);
    },
    get [keys.KP0]() {
      return KEY_SET.has(keys.KP0);
    },
    get [keys.KP1]() {
      return KEY_SET.has(keys.KP1);
    },
    get [keys.KP2]() {
      return KEY_SET.has(keys.KP2);
    },
    get [keys.KP3]() {
      return KEY_SET.has(keys.KP3);
    },
    get [keys.KP4]() {
      return KEY_SET.has(keys.KP4);
    },
    get [keys.KP5]() {
      return KEY_SET.has(keys.KP5);
    },
    get [keys.KP6]() {
      return KEY_SET.has(keys.KP6);
    },
    get [keys.KP7]() {
      return KEY_SET.has(keys.KP7);
    },
    get [keys.KP8]() {
      return KEY_SET.has(keys.KP8);
    },
    get [keys.KP9]() {
      return KEY_SET.has(keys.KP9);
    },
    get [keys.KP_PERIOD]() {
      return KEY_SET.has(keys.KP_PERIOD);
    },
    get [keys.KP_DIVIDE]() {
      return KEY_SET.has(keys.KP_DIVIDE);
    },
    get [keys.KP_MULTIPLY]() {
      return KEY_SET.has(keys.KP_MULTIPLY);
    },
    get [keys.KP_MINUS]() {
      return KEY_SET.has(keys.KP_MINUS);
    },
    get [keys.KP_PLUS]() {
      return KEY_SET.has(keys.KP_PLUS);
    },
    get [keys.KP_ENTER]() {
      return KEY_SET.has(keys.KP_ENTER);
    },
    get [keys.KP_EQUALS]() {
      return KEY_SET.has(keys.KP_EQUALS);
    },
    get [keys.UP]() {
      return KEY_SET.has(keys.UP);
    },
    get [keys.DOWN]() {
      return KEY_SET.has(keys.DOWN);
    },
    get [keys.RIGHT]() {
      return KEY_SET.has(keys.RIGHT);
    },
    get [keys.LEFT]() {
      return KEY_SET.has(keys.LEFT);
    },
    get [keys.INSERT]() {
      return KEY_SET.has(keys.INSERT);
    },
    get [keys.HOME]() {
      return KEY_SET.has(keys.HOME);
    },
    get [keys.END]() {
      return KEY_SET.has(keys.END);
    },
    get [keys.PAGEUP]() {
      return KEY_SET.has(keys.PAGEUP);
    },
    get [keys.PAGEDOWN]() {
      return KEY_SET.has(keys.PAGEDOWN);
    },
    get [keys.F1]() {
      return KEY_SET.has(keys.F1);
    },
    get [keys.F2]() {
      return KEY_SET.has(keys.F2);
    },
    get [keys.F3]() {
      return KEY_SET.has(keys.F3);
    },
    get [keys.F4]() {
      return KEY_SET.has(keys.F4);
    },
    get [keys.F5]() {
      return KEY_SET.has(keys.F5);
    },
    get [keys.F6]() {
      return KEY_SET.has(keys.F6);
    },
    get [keys.F7]() {
      return KEY_SET.has(keys.F7);
    },
    get [keys.F8]() {
      return KEY_SET.has(keys.F8);
    },
    get [keys.F9]() {
      return KEY_SET.has(keys.F9);
    },
    get [keys.F10]() {
      return KEY_SET.has(keys.F10);
    },
    get [keys.F11]() {
      return KEY_SET.has(keys.F11);
    },
    get [keys.F12]() {
      return KEY_SET.has(keys.F12);
    },
    get [keys.F13]() {
      return KEY_SET.has(keys.F13);
    },
    get [keys.F14]() {
      return KEY_SET.has(keys.F14);
    },
    get [keys.F15]() {
      return KEY_SET.has(keys.F15);
    },
    get [keys.NUMLOCK]() {
      return KEY_SET.has(keys.NUMLOCK);
    },
    get [keys.CAPSLOCK]() {
      return KEY_SET.has(keys.CAPSLOCK);
    },
    get [keys.SCROLLOCK]() {
      return KEY_SET.has(keys.SCROLLOCK);
    },
    get [keys.RSHIFT]() {
      return KEY_SET.has(keys.RSHIFT);
    },
    get [keys.LSHIFT]() {
      return KEY_SET.has(keys.LSHIFT);
    },
    get [keys.RCTRL]() {
      return KEY_SET.has(keys.RCTRL);
    },
    get [keys.LCTRL]() {
      return KEY_SET.has(keys.LCTRL);
    },
    get [keys.RALT]() {
      return KEY_SET.has(keys.RALT);
    },
    get [keys.LALT]() {
      return KEY_SET.has(keys.LALT);
    },
    get [keys.RMETA]() {
      return KEY_SET.has(keys.RMETA);
    },
    get [keys.LMETA]() {
      return KEY_SET.has(keys.LMETA);
    },
    get [keys.LSUPER]() {
      return KEY_SET.has(keys.LSUPER);
    },
    get [keys.RSUPER]() {
      return KEY_SET.has(keys.RSUPER);
    },
    get [keys.MODE]() {
      return KEY_SET.has(keys.MODE);
    },
    get [keys.HELP]() {
      return KEY_SET.has(keys.HELP);
    },
    get [keys.PRINT]() {
      return KEY_SET.has(keys.PRINT);
    },
    get [keys.SYSREQ]() {
      return KEY_SET.has(keys.SYSREQ);
    },
    get [keys.BREAK]() {
      return KEY_SET.has(keys.BREAK);
    },
    get [keys.MENU]() {
      return KEY_SET.has(keys.MENU);
    },
    get [keys.POWER]() {
      return KEY_SET.has(keys.POWER);
    },
    get [keys.EURO]() {
      return KEY_SET.has(keys.EURO);
    },
    get [keys.LAST]() {
      return KEY_SET.has(keys.LAST);
    }
  }
})();

/*
 * Global object to schedule a function to happen in the future.
 *
 * We manually track the callbacks instead of using setTimeout() and
 * setInterval() so they can be synchronized with the core game loop.
 */
const clock = (function () {
  // Array of Arrays containing the scheduled callbacks
  let queue = [];

  return {
    /*
     * Schedule callback to be called, at delay seconds from now.
     */
    schedule(callback, delay) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function.');
      }
      if (typeof delay !== 'number') {
        throw new TypeError('delay must be a positive number.');
      }
      if (delay <= 0) {
        throw new RangeError('delay must be a positive number.');
      }
      queue.push([callback, delay, 0]);
    },

    /*
     * Schedule callback to be called once, at delay seconds from now.
     */
    schedule_unique(callback, delay) {
      this.unschedule(callback);
      this.schedule(callback, delay);
    },

    /*
     * Schedule callback to be called repeatedly with interval seconds between calls.
     */
    schedule_interval(callback, interval) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function.');
      }
      if (typeof interval !== 'number') {
        throw new TypeError('interval must be a positive number.');
      }
      if (interval <= 0) {
        throw new RangeError('interval must be a positive number.');
      }
      queue.push([callback, interval, interval]);
    },

    /*
     * Unschedule the given callback.
     */
    unschedule(callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function.');
      }
      queue = queue.filter(q => (q[0] !== callback));
    },

    _clear_queue() {
      queue = [];
    },

    /*
     * Return a copy of queue for testing.
     */
    _get_queue() {
      return queue.slice();
    },

    /*
     * Loop through all the callbacks in queue and call any that are due.
     */
    _update_queue(dt) {
      let result = [], newETA;
      for (let [callback, eta, next] of queue) {
        newETA = eta - dt;
        if (newETA <= 0) {
          callback();
          if (next > 0) {
            result.push([callback, next, next]);
          }
        }
        else {
          result.push([callback, newETA, next]);
        }
      }
      queue = result;
    }
  }
})();

const images = (function () {
  return {
    // Uppercase method names to avoid clashing with lowercase names of resources
    LOAD(selector) {
      for (let e of Array.from(document.querySelectorAll(selector))) {
        let name = e.getAttribute('alt');
        this[name] = e;
      }
    }
  }
})();

const sounds = (function () {
  return {
    // Uppercase method names to avoid clashing with lowercase names of resources
    LOAD(selector) {
      for (let e of Array.from(document.querySelectorAll(selector))) {
        let name = e.id;
        this[name] = e;
      }
    }
  }
})();

/*
 * The humble Rect class, the heart of the implementation.
 */
class Rect {
  constructor() {
    let x, y, width, height;
    if (arguments.length < 1) {
      // If there are not enough arguments
      throw new Error('Not enough arguments.');
    }
    if (arguments.length < 2) {
      if (typeof arguments[0] !== 'object') {
        throw new Error('Not enough arguments.');
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0, width=0, height=0] = arguments[0];
      }
      else {
        ({x=0, y=0, width=0, height=0} = arguments[0]);
      }
    }
    else if (arguments.length < 4) {
      if ((typeof arguments[0] !== 'object') || (typeof arguments[1] !== 'object')) {
        throw new Error('Not enough arguments.');
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0] = arguments[0];
      }
      else {
        ({x=0, y=0} = arguments[0]);
      }
      if (Array.isArray(arguments[1])) {
        [width=0, height=0] = arguments[1];
      }
      else {
        ({width=0, height=0} = arguments[1]);
      }
    }
    else {
      [x=0, y=0, width=0, height=0] = arguments;
    }

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get top() {
    return this.y;
  }
  set top(top) {
    this.y = top;
  }
  get left() {
    return this.x;
  }
  set left(left) {
    this.x = left;
  }
  get right() {
    return this.x + this.width;
  }
  set right(right) {
    this.x = right - this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(bottom) {
    this.y = bottom - this.height;
  }
  get centerx() {
    return this.x + Math.floor(this.width / 2);
  }
  set centerx(centerx) {
    this.x = centerx - Math.floor(this.width / 2);
  }
  get centery() {
    return this.y + Math.floor(this.height / 2);
  }
  set centery(centery) {
    this.y = centery - Math.floor(this.height / 2);
  }
  get topleft() {
    let tuple = [this.x, this.y];
    return tuple;
  }
  set topleft(topleft) {
    let [x=0, y=0] = topleft;
    this.x = x;
    this.y = y;
  }
  get topright() {
    let tuple = [this.x + this.width, this.y];
    return tuple;
  }
  set topright(topright) {
    let [x=0, y=0] = topright;
    this.x = x - this.width;
    this.y = y;
  }
  get bottomleft() {
    let tuple = [this.x, this.y + this.height];
    return tuple;
  }
  set bottomleft(bottomleft) {
    let [x=0, y=0] = bottomleft;
    this.x = x;
    this.y = y - this.height;
  }
  get bottomright() {
    let tuple = [this.x + this.width, this.y + this.height];
    return tuple;
  }
  set bottomright(bottomright) {
    let [x=0, y=0] = bottomright;
    this.x = x - this.width;
    this.y = y - this.height;
  }
  get midtop() {
    let tuple = [this.x + Math.floor(this.width / 2), this.y];
    return tuple;
  }
  set midtop(midtop) {
    let [x=0, y=0] = midtop;
    this.x = x - Math.floor(this.width / 2);
    this.y = y;
  }
  get midleft() {
    let tuple = [this.x, this.y + Math.floor(this.height / 2)];
    return tuple;
  }
  set midleft(midleft) {
    let [x=0, y=0] = midleft;
    this.x = x;
    this.y = y - Math.floor(this.height / 2);
  }
  get midbottom() {
    let tuple = [this.x + Math.floor(this.width / 2), this.y + this.height];
    return tuple;
  }
  set midbottom(midbottom) {
    let [x=0, y=0] = midbottom;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - this.height;
  }
  get midright() {
    let tuple = [this.x + this.width, this.y + Math.floor(this.height / 2)];
    return tuple;
  }
  set midright(midright) {
    let [x=0, y=0] = midright;
    this.x = x - this.width;
    this.y = y - Math.floor(this.height / 2);
  }
  get center() {
    let tuple = [this.x + Math.floor(this.width / 2), this.y + Math.floor(this.height / 2)];
    return tuple;
  }
  set center(center) {
    let [x=0, y=0] = center;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - Math.floor(this.height / 2);
  }
  get size() {
    let tuple = [this.width, this.height];
    return tuple;
  }
  set size(size) {
    let [w=0, h=0] = size;
    this.width = w;
    this.height = h;
  }
  move(dx, dy) {
    return new Rect(this.x + dx, this.y + dy, this.width, this.height);
  }
  move_ip(dx, dy) {
    this.x = this.x + dx;
    this.y = this.y + dy;
  }
  inflate(dx, dy) {
    return new Rect(this.x - Math.floor(dx / 2), this.y - Math.floor(dy / 2), this.width + dx, this.height + dy);
  }
  inflate_ip(dx, dy) {
    this.x = this.x - Math.floor(dx / 2);
    this.y = this.y - Math.floor(dy / 2);
    this.width = this.width + dx;
    this.height = this.height + dy;
  }
  clamp() {
    let rect = new Rect(...arguments), x, y;

    if (this.width >= rect.width) {
      x = rect.x + Math.floor(rect.width / 2) - Math.floor(this.width / 2);
    }
    else if (this.x < rect.x) {
      x = rect.x;
    }
    else if ((this.x + this.width) > (rect.x + rect.width)) {
      x = rect.x + rect.width - this.width;
    }
    else {
      x = this.x;
    }

    if (this.height >= rect.height) {
      y = rect.y + Math.floor(rect.height / 2) - Math.floor(this.height / 2);
    }
    else if (this.y < rect.y) {
      y = rect.y;
    }
    else if ((this.y + this.height) > (rect.y + rect.height)) {
      y = rect.y + rect.height - this.height;
    }
    else {
      y = this.y;
    }

    return new Rect(x, y, this.width, this.height);
  }
  clamp_ip() {
    let rect = this.clamp(...arguments);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  clip() {
    let rect = new Rect(...arguments), x, y, width, height;

    if ((this.x >= rect.x) && (this.x < (rect.x + rect.width))) {
      x = this.x;
    }
    else if ((rect.x >= this.x) && (rect.x < (this.x + this.width))) {
      x = rect.x;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    if (((this.x + this.width) > rect.x) && ((this.x + this.width) <= (rect.x + rect.width))) {
      width = this.x + this.width - x;
    }
    else if (((rect.x + rect.width) > this.x) && ((rect.x + rect.width) <= (this.x + this.width))) {
      width = rect.x + rect.width - x;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    if ((this.y >= rect.y) && (this.y < (rect.y + rect.height))) {
      y = this.y;
    }
    else if ((rect.y >= this.y) && (rect.y < (this.y + this.height))) {
      y = rect.y;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    if (((this.y + this.height) > rect.y) && ((this.y + this.height) <= (rect.y + rect.height))) {
      height = this.y + this.height - y;
    }
    else if (((rect.y + rect.height) > this.y) && ((rect.y + rect.height) <= (this.y + this.height))) {
      height = rect.y + rect.height - y;
    }
    else {
      // The two Rect objects do not intersect
      return new Rect(this.x, this.y, 0, 0);
    }

    return new Rect(x, y, width, height);
  }
  clip_ip() {
    let rect = this.clip(...arguments);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  union() {
    let rect = new Rect(...arguments),
        x = Math.min(this.x, rect.x),
        y = Math.min(this.y, rect.y),
        width = Math.max(this.x + this.width, rect.x + rect.width) - x,
        height = Math.max(this.y + this.height, rect.y + rect.height) - y;
    return new Rect(x, y, width, height);
  }
  union_ip() {
    let rect = this.union(...arguments);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  unionall(others) {
    let xs = [this.x],
        ys = [this.y],
        widths = [this.x + this.width],
        heights = [this.y + this.height];
    for (let other of others) {
      let rect = new Rect(other);
      xs.push(rect.x);
      ys.push(rect.y);
      widths.push(rect.x + rect.width);
      heights.push(rect.y + rect.height);
    }
    let x = Math.min(...xs),
        y = Math.min(...ys),
        width = Math.max(...widths) - x,
        height = Math.max(...heights) - y;
    return new Rect(x, y, width, height);
  }
  unionall_ip(others) {
    let rect = this.unionall(others);
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
  fit() {
    let rect = new Rect(...arguments),
        ratio = Math.max(this.width / rect.width, this.height / rect.height),
        width = Math.floor(this.width / ratio),
        height = Math.floor(this.height / ratio),
        x = rect.x + Math.floor((rect.width - width) / 2),
        y = rect.y + Math.floor((rect.height - height) / 2);
    return new Rect(x, y, width, height);
  }
  normalize() {
    if (this.width < 0) {
      this.x = this.x + this.width;
      this.width = Math.abs(this.width);
    }
    if (this.height < 0) {
      this.y = this.y + this.height;
      this.height = Math.abs(this.height);
    }
  }
  contains() {
    let rect = new Rect(...arguments);
    return ((this.x <= rect.x) &&
            (this.y <= rect.y) &&
            ((this.x + this.width) >= (rect.x + rect.width)) &&
            ((this.y + this.height) >= (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }
  collidepoint() {
    let x, y;
    if (arguments.length < 1) {
      return false;
    }
    if (arguments.length < 2) {
      if (typeof arguments[0] !== 'object') {
        return false;
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0] = arguments[0];
      }
      else {
        ({x=0, y=0} = arguments[0]);
      }
    }
    else {
      [x=0, y=0] = arguments;
    }
    return ((this.x <= x) &&
            (x < (this.x + this.width)) &&
            (this.y <= y) &&
            (y < (this.y + this.height)));
  }
  colliderect() {
    let rect = new Rect(...arguments);
    return ((this.x < (rect.x + rect.width)) &&
            (this.y < (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }
  _collidelist(others) {
    let result = [],
        i = 0;
    for (let other of others) {
      let rect = new Rect(other);
      if (this.colliderect(rect)) {
        result.push(i);
      }
      i++;
    }
    return result;
  }
  collidelist(others) {
    let result = this._collidelist(others);
    if (result.length <= 0) {
      return -1;
    }
    else {
      return result[0];
    }
  }
  collidelistall(others) {
    return this._collidelist(others);
  }
  collidedict(dict, use_values = true) {
    let result = [];
    for (let [k, v] of dict) {
      if (use_values) {
        if (this.colliderect(v)) {
          result.push(k, v);
          return result;
        }
      }
      else {
        if (this.colliderect(k)) {
          result.push(k, v);
          return result;
        }
      }
    }
    return undefined;
  }
  collidedictall(dict, use_values = true) {
    let result = [];
    for (let [k, v] of dict) {
      if (use_values) {
        if (this.colliderect(v)) {
          result.push([k, v]);
        }
      }
      else {
        if (this.colliderect(k)) {
          result.push([k, v]);
        }
      }
    }
    return result;
  }
  copy() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
}
Rect.prototype.toString = function () {
  return `{x: ${ this.x }, y: ${ this.y }, width: ${ this.width }, height: ${ this.height }}`;
}

/*
 * The Actor class differs from that in Pygame Zero because x and y are not aliases for pos.
 * I found the Pygame Zero implementation confusing and complicating everything.
 * Here x and y always refer to the topleft corner of the Actor.
 * If you want to change the location of the anchor, then use pos.
 *
 * In addition, the name of the image is stored in the "name" attribute and not the "image" attribute.
 * "image" is too confusing when there are actual image Surfaces, too.
 *
 * There is no opacity attribute.
 */
class Actor {
  constructor(name) {
    if (!(name in images)) {
      throw new RangeError(`Unknown image "${ name }".`);
    }

    this.name = name;
    let image = images[this.name];
    this._rect = new Rect(0, 0, image.width, image.height);

    // Initialize the anchor at center
    // x offset in pixels from the topleft corner to the anchor
    this.anchor_dx = Math.floor(image.width / 2);

    // y offset in pixels from the topleft corner to the anchor
    this.anchor_dy = Math.floor(image.height / 2);

    this.angle = 0;
  }

  get x() {
    return this._rect.x;
  }
  set x(x) {
    this._rect.x = x;
  }
  get y() {
    return this._rect.y;
  }
  set y(y) {
    this._rect.y = y;
  }
  get width() {
    return this._rect.width;
  }
  get height() {
    return this._rect.height;
  }

  get anchor() {
    let tuple = [this.anchor_dx, this.anchor_dy];
    return tuple;
  }

  /*
   * anchor is overloaded to accept String or Number in Array or not.
   *
   * I personally think it is not Pythonic and violates
   * "There should be one-- and preferably only one --obvious way to do it."
   * but I did not write the Pygame Zero spec.
   */
  set anchor(anchor) {
    if (typeof anchor === 'string') {
      let cleaned = anchor.trim().toLowerCase();
      if (cleaned === 'topleft') {
        this.anchor_dx = 0;
        this.anchor_dy = 0;
      }
      else if (cleaned === 'midtop') {
        this.anchor_dx = Math.floor(this.width / 2);
        this.anchor_dy = 0;
      }
      else if (cleaned === 'topright') {
        this.anchor_dx = this.width;
        this.anchor_dy = 0;
      }
      else if (cleaned === 'midleft') {
        this.anchor_dx = 0;
        this.anchor_dy = Math.floor(this.height / 2);
      }
      else if (cleaned === 'center') {
        this.anchor_dx = Math.floor(this.width / 2);
        this.anchor_dy = Math.floor(this.height / 2);
      }
      else if (cleaned === 'midright') {
        this.anchor_dx = this.width;
        this.anchor_dy = Math.floor(this.height / 2);
      }
      else if (cleaned === 'bottomleft') {
        this.anchor_dx = 0;
        this.anchor_dy = this.height;
      }
      else if (cleaned === 'midbottom') {
        this.anchor_dx = Math.floor(this.width / 2);
        this.anchor_dy = this.height;
      }
      else if (cleaned === 'bottomright') {
        this.anchor_dx = this.width;
        this.anchor_dy = this.height;
      }
      else {
        throw new RangeError(`Unknown anchor "${ anchor }". Must be "topleft", "midtop", "topright", "midleft", "center", "midright", "bottomleft", "midbottom", or "bottomright".`);
      }

      return;
    }

    if (typeof anchor === 'object') {
      let x, y, cleaned;
      if (Array.isArray(anchor)) {
        [x=0, y=0] = anchor;
      }
      else {
        ({x=0, y=0} = anchor);
      }

      if (typeof x === 'number') {
        this.anchor_dx = x;
      }
      else if (typeof x === 'string') {
        cleaned = x.trim().toLowerCase();
        if (cleaned === 'left') {
          this.anchor_dx = 0;
        }
        else if ((cleaned === 'center') || (cleaned === 'middle')) {
          this.anchor_dx = Math.floor(this.width / 2);
        }
        else if (cleaned === 'right') {
          this.anchor_dx = this.width;
        }
        else {
          throw new RangeError(`Unknown anchor "${ x }". Must be "left", "center", "middle", or "right".`);
        }
      }
      else {
        throw new TypeError('Unrecognized anchor type. Must be a Number or a String.');
      }

      if (typeof y === 'number') {
        this.anchor_dy = y;
      }
      else if (typeof y === 'string') {
        cleaned = y.trim().toLowerCase();
        if (cleaned === 'top') {
          this.anchor_dy = 0;
        }
        else if ((cleaned === 'center') || (cleaned === 'middle')) {
          this.anchor_dy = Math.floor(this.height / 2);
        }
        else if (cleaned === 'bottom') {
          this.anchor_dy = this.height;
        }
        else {
          throw new RangeError(`Unknown anchor "${ y }". Must be "top", "center", "middle", or "bottom".`);
        }
      }
      else {
        throw new TypeError('Unrecognized anchor type. Must be a Number or a String.');
      }

      return;
    }

    throw new TypeError('Unrecognized anchor type.');
  }
  get pos() {
    let tuple = [this.x + this.anchor_dx, this.y + this.anchor_dy];
    return tuple;
  }
  set pos(pos) {
    let [x=0, y=0] = pos;
    this.x = x - this.anchor_dx;
    this.y = y - this.anchor_dy;
  }

  /*
   * Attributes delegated to the underlying Rect object.
   */
  get top() {
    return this.y;
  }
  set top(top) {
    this.y = top;
  }
  get left() {
    return this.x;
  }
  set left(left) {
    this.x = left;
  }
  get right() {
    return this.x + this.width;
  }
  set right(right) {
    this.x = right - this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(bottom) {
    this.y = bottom - this.height;
  }
  get centerx() {
    return this.x + Math.floor(this.width / 2);
  }
  set centerx(centerx) {
    this.x = centerx - Math.floor(this.width / 2);
  }
  get centery() {
    return this.y + Math.floor(this.height / 2);
  }
  set centery(centery) {
    this.y = centery - Math.floor(this.height / 2);
  }
  get topleft() {
    let tuple = [this.x, this.y];
    return tuple;
  }
  set topleft(topleft) {
    let [x=0, y=0] = topleft;
    this.x = x;
    this.y = y;
  }
  get topright() {
    let tuple = [this.x + this.width, this.y];
    return tuple;
  }
  set topright(topright) {
    let [x=0, y=0] = topright;
    this.x = x - this.width;
    this.y = y;
  }
  get bottomleft() {
    let tuple = [this.x, this.y + this.height];
    return tuple;
  }
  set bottomleft(bottomleft) {
    let [x=0, y=0] = bottomleft;
    this.x = x;
    this.y = y - this.height;
  }
  get bottomright() {
    let tuple = [this.x + this.width, this.y + this.height];
    return tuple;
  }
  set bottomright(bottomright) {
    let [x=0, y=0] = bottomright;
    this.x = x - this.width;
    this.y = y - this.height;
  }
  get midtop() {
    let tuple = [this.x + Math.floor(this.width / 2), this.y];
    return tuple;
  }
  set midtop(midtop) {
    let [x=0, y=0] = midtop;
    this.x = x - Math.floor(this.width / 2);
    this.y = y;
  }
  get midleft() {
    let tuple = [this.x, this.y + Math.floor(this.height / 2)];
    return tuple;
  }
  set midleft(midleft) {
    let [x=0, y=0] = midleft;
    this.x = x;
    this.y = y - Math.floor(this.height / 2);
  }
  get midbottom() {
    let tuple = [this.x + Math.floor(this.width / 2), this.y + this.height];
    return tuple;
  }
  set midbottom(midbottom) {
    let [x=0, y=0] = midbottom;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - this.height;
  }
  get midright() {
    let tuple = [this.x + this.width, this.y + Math.floor(this.height / 2)];
    return tuple;
  }
  set midright(midright) {
    let [x=0, y=0] = midright;
    this.x = x - this.width;
    this.y = y - Math.floor(this.height / 2);
  }
  get center() {
    let tuple = [this.x + Math.floor(this.width / 2), this.y + Math.floor(this.height / 2)];
    return tuple;
  }
  set center(center) {
    let [x=0, y=0] = center;
    this.x = x - Math.floor(this.width / 2);
    this.y = y - Math.floor(this.height / 2);
  }
  get size() {
    let tuple = [this.width, this.height];
    return tuple;
  }
  contains() {
    let rect = new Rect(...arguments);
    return ((this.x <= rect.x) &&
            (this.y <= rect.y) &&
            ((this.x + this.width) >= (rect.x + rect.width)) &&
            ((this.y + this.height) >= (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }
  collidepoint() {
    let x, y;
    if (arguments.length < 1) {
      return false;
    }
    if (arguments.length < 2) {
      if (typeof arguments[0] !== 'object') {
        return false;
      }
      if (Array.isArray(arguments[0])) {
        [x=0, y=0] = arguments[0];
      }
      else {
        ({x=0, y=0} = arguments[0]);
      }
    }
    else {
      [x=0, y=0] = arguments;
    }
    return ((this.x <= x) &&
            (x < (this.x + this.width)) &&
            (this.y <= y) &&
            (y < (this.y + this.height)));
  }
  colliderect() {
    let rect = new Rect(...arguments);
    return ((this.x < (rect.x + rect.width)) &&
            (this.y < (rect.y + rect.height)) &&
            ((this.x + this.width) > rect.x) &&
            ((this.y + this.height) > rect.y));
  }

  draw() {
    screen.blit(this, this.topleft);
  }

  _vector_to(target) {
    let [ax=0, ay=0] = this.pos,
        tuple = [],
        x, y, dx, dy;
    if (typeof target !== 'object') {
      tuple.push(0, 0);
      return tuple;
    }
    else if (target instanceof Actor) {
      [x=0, y=0] = target.pos;
    }
    else if (Array.isArray(target)) {
      [x=0, y=0] = target;
    }
    else {
      ({x=0, y=0} = target);
    }

    dx = x - ax;
    // The y-axis is inverted in graphics (positive goes down)
    dy = ay - y;
    tuple.push(Math.sqrt((dx * dx) + (dy * dy)), Math.atan2(dy, dx) * 180 / Math.PI);
    return tuple;
  }

  /*
   * Return the angle from this actor's position to target, in degrees.
   */
  angle_to(target) {
    let vector = this._vector_to(target);
    return vector[1];
  }

  /*
   * Return the distance from this actor's position to target, in pixels.
   */
  distance_to(target) {
    let vector = this._vector_to(target);
    return vector[0];
  }
}

/*
 * Class to handle the animation.
 *
 * It cannot be named "Animation" because the Web Animation API already uses that name.
 * So we use a more appropriate and exact name.
 *
 * In traditional animation, an inbetweener is the assistant responsible for drawing the images between the keyframes.
 * Shortening "inbetween" is where we got the term "tween".
 */
class Inbetweener {
  /*
   * Tween functions
   */
  static linear(n) {
    return n;
  }

  static accelerate(n) {
    return (n * n);
  }

  static decelerate(n) {
    return (-1.0 * n * (n - 2.0));
  }

  static accel_decel(n) {
    let p = n * 2;
    if (p < 1) {
      return (0.5 * p * p);
    }
    p -= 1.0;
    return (-0.5 * ((p * (p - 2.0)) - 1.0));
  }

  static in_elastic(n) {
    let p = 0.3,
        s = p / 4.0;
    if (n == 1) {
      return 1.0;
    }
    n -= 1;
    return -(Math.pow(2, 10 * n) * Math.sin((n - s) * 2 * Math.PI / p));
  }

  static out_elastic(n) {
    let p = 0.3,
        s = p / 4.0;
    if (n == 1) {
      return 1.0;
    }
    return ((Math.pow(2, -10 * n) * Math.sin((n - s) * 2 * Math.PI / p)) + 1.0);
  }

  static in_out_elastic(n) {
    let p = 0.3 * 1.5,
        s = p / 4.0,
        q = n * 2;
    if (q == 2) {
      return 1.0;
    }
    if (q < 1) {
      q -= 1;
      return (-0.5 * Math.pow(2, 10 * q) * Math.sin((q - s) * 2 * Math.PI / p));
    }
    q -= 1;
    return ((0.5 * Math.pow(2, -10 * q) * Math.sin((q - s) * 2 * Math.PI / p)) + 1.0);
  }

  static _out_bounce_internal(t, d) {
    let p = t / d;
    if (p < (1.0 / 2.75)) {
      return (7.5625 * p * p);
    }
    if (p < (2.0 / 2.75)) {
      p -= 1.5 / 2.75;
      return ((7.5625 * p * p) + 0.75);
    }
    if (p < (2.5 / 2.75)) {
      p -= 2.25 / 2.75;
      return ((7.5625 * p * p) + 0.9375);
    }
    p -= 2.625 / 2.75;
    return ((7.5625 * p * p) + 0.984375);
  }

  static _in_bounce_internal(t, d) {
    return (1.0 - Inbetweener._out_bounce_internal(d - t, d));
  }

  static bounce_end(n) {
    return Inbetweener._out_bounce_internal(n, 1);
  }

  static bounce_start(n) {
    return Inbetweener._in_bounce_internal(n, 1);
  }

  static bounce_start_end(n) {
    let p = n * 2;
    if (p < 1) {
      return (Inbetweener._in_bounce_internal(p, 1) * 0.5);
    }
    return ((Inbetweener._out_bounce_internal(p - 1, 1) * 0.5) + 0.5);
  }

  // Animation queue: Array of Inbetweener objects
  static queue = [];

  /*
   * Clear the animation queue.
   */
  static _clear_queue() {
    this.queue = [];
  }

  /*
   * Loop through all the animations in the animation queue and tween.
   */
  static _update_queue(dt) {
    let result = [];
    for (let a of this.queue) {
      a.update(dt);
      if (!a.done) {
        result.push(a);
      }
    }
    this.queue = result;
  }

  constructor(puppet, duration, attributes, tween, callback) {
    if (typeof puppet !== 'object') {
      throw new TypeError('puppet must be an object.');
    }
    if (typeof duration !== 'number') {
      throw new TypeError('duration must be a positive number.');
    }
    if (duration <= 0) {
      throw new RangeError('duration must be a positive number.');
    }
    if (typeof attributes !== 'object') {
      throw new TypeError('attributes must be an object.');
    }
    if (typeof tween !== 'string') {
      this.tween = 'linear';
    }
    else {
      this.tween = tween.trim().toLowerCase();
      if (this.tween.startsWith('_') || (!(this.tween in Inbetweener))) {
        throw new RangeError(`Unrecognized tween function "${ tween }".`);
      }
    }

    this.puppet = puppet;
    this.elapsed = 0;
    this.duration = duration;
    this.callback = callback;

    // Populate this.attributes with the start and the end values of the properties to tween
    // They must either both be Numbers or Arrays of Numbers the same length
    this.attributes = new Map();
    for (let a of Object.getOwnPropertyNames(attributes)) {
      if (!(a in this.puppet)) {
        continue;
      }
      let start = this.puppet[a],
          end = attributes[a];
      if ((typeof start === 'number') && (typeof end === 'number')) {
        this.attributes.set(a, {start: start, end: end});
      }
      else if (Array.isArray(start) && Array.isArray(end)) {
        if (start.length != end.length) {
          continue;
        }
        if (start.filter(e => (typeof e !== 'number')).length > 0) {
          continue;
        }
        if (end.filter(e => (typeof e !== 'number')).length > 0) {
          continue;
        }
        this.attributes.set(a, {start: start, end: end});
      }
    }
  }

  /*
   * Update the animation after dt seconds have passed.
   */
  update(dt) {
    this.elapsed += dt;
    if (this.elapsed > this.duration) {
      // If the animation has reached its end
      for (let [k, v] of this.attributes) {
        this.puppet[k] = v.end;
      }
      if (typeof this.callback === 'function') {
        this.callback();
      }
    }
    else {
      // Interpolate between start and end based on the tween function
      let n = Inbetweener[this.tween](this.elapsed / this.duration);
      for (let [k, v] of this.attributes) {
        if (typeof v.start === 'number') {
          this.puppet[k] = v.start + ((v.end - v.start) * n);
        }
        else if (Array.isArray(v.start)) {
          let result = [];
          for (let i = 0; i < v.start.length; i++) {
            result.push(v.start[i] + ((v.end[i] - v.start[i]) * n));
          }
          this.puppet[k] = result;
        }
      }
    }
  }

  /*
   * Boolean flag that is true if the animation is complete.
   */
  get done() {
    if (this.attributes.size <= 0) {
      // If there is no property to update
      return true;
    }
    return (this.elapsed > this.duration);
  }
}

/*
 * Animate the attributes on puppet from their current value to that
 * specified in the attributes object over duration.
 */
function animate() {
  if (arguments.length < 1) {
    // If there are not enough arguments
    throw new Error('Not enough arguments.');
  }

  let animation;
  if (arguments.length < 3) {
    animation = arguments[0];
  }
  else {
    animation = new Inbetweener(...arguments);
  }
  if (animation instanceof Inbetweener) {
    if (!animation.done) {
      Inbetweener.queue.push(animation);
    }
    return animation;
  }
  else {
    throw new Error('Not enough arguments.');
  }
}

/*
 * The global screen object representing your game screen.
 *
 * It mimicks the Python object using Immediately Invoked Function Expression/Self-Executing Anonymous Function.
 */
const screen = (function () {
  const DEFAULT_COLOR = 'white';
  const DEFAULT_FONT = 'sans-serif';
  const DEFAULT_FONT_SIZE = 24;
  const DEFAULT_WIDTH = 800;
  const DEFAULT_HEIGHT = 600;
  const MAX_COLOR = 255;
  const TWO_PI = Math.PI * 2;

  /*
   * Parse a color given as a String or an Array of 3 Numbers.
   */
  function parseColor(color) {
    if (typeof color === 'string') {
      if (color.length < 3) {
        return 'black';
      }
      else {
        return color;
      }
    }
    else {
      let [r=0, g=0, b=0] = color;
      r = Math.max(Math.min(r, MAX_COLOR), 0);
      g = Math.max(Math.min(g, MAX_COLOR), 0);
      b = Math.max(Math.min(b, MAX_COLOR), 0);
      return `rgb(${ r }, ${ g }, ${ b })`;
    }
  }

  /*
   * Private state variables
   */
  let canvas = null,
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      context = null,
      hasKeyDown = false,
      hasKeyUp = false,
      hasDraw = false,
      hasUpdate = false,
      running = 0,
      start;

  /*
   * Event Handlers
   */
  function clickStart(event) {
    screen.go();
    event.target.removeEventListener('click', clickStart);
  }

  function keydown(event) {
    keyboard._press(event);
    if (hasKeyDown) {
      window.on_key_down(keyboard._lookup(event), keyboard.bitmask, event.key)
    }
    event.preventDefault();
  }

  function keyup(event) {
    if (hasKeyUp) {
      window.on_key_up(keyboard._lookup(event), keyboard.bitmask)
    }
    keyboard._release(event);
    event.preventDefault();
  }

  function mousedown(event) {
    // Use getBoundingClientRect() to get the distance relative to viewport
    let box = event.target.getBoundingClientRect(),
        x = Math.floor(event.clientX - box.left),
        y = Math.floor(event.clientY - box.top);
    window.on_mouse_down([x, y], event.buttons);
  }

  function mouseup(event) {
    // Use getBoundingClientRect() to get the distance relative to viewport
    let box = event.target.getBoundingClientRect(),
        x = Math.floor(event.clientX - box.left),
        y = Math.floor(event.clientY - box.top);
    window.on_mouse_up([x, y], event.buttons);
  }

  function mousemove(event) {
    // Use getBoundingClientRect() to get the distance relative to viewport
    let box = event.target.getBoundingClientRect(),
        x = Math.floor(event.clientX - box.left),
        y = Math.floor(event.clientY - box.top);
    window.on_mouse_move([x, y], [event.movementX, event.movementY], event.buttons);
  }

  /*
   * The core game loop
   */
  function loop(timestamp) {
    /*
     * Best practice
     * ---
     * Calling the next requestAnimationFrame early ensures the browser
     * receives it on time to plan accordingly even if your current frame
     * misses its VSync window.
     */
    running = window.requestAnimationFrame(loop);

    if (start == null) {
      // For the first run of the game loop
      start = timestamp;
    }

    // JavaScript time is in milliseconds not seconds like Pygame Zero!
    const elapsed = (timestamp - start) / 1000;
    start = timestamp;

    clock._update_queue(elapsed);
    Inbetweener._update_queue(elapsed);

    if (hasUpdate) {
      window.update(elapsed);
    }
    if (hasDraw) {
      window.draw();
    }
  }

  return {
    draw: {
      line(start, end, color, width = 1) {
        if (context == null) {
          return;
        }
        context.save();
        context.lineWidth = width;
        context.strokeStyle = parseColor(color);

        let x1, y1, x2, y2;
        [x1=0, y1=0] = start;
        [x2=0, y2=0] = end;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.restore();
      },
      circle(pos, radius, color, width = 1) {
        if (context == null) {
          return;
        }
        context.save();
        context.lineWidth = width;
        context.strokeStyle = parseColor(color);

        let [x=0, y=0] = pos;
        context.beginPath();
        context.arc(x, y, radius, 0, TWO_PI, false);
        context.stroke();
        context.restore();
      },
      filled_circle(pos, radius, color) {
        if (context == null) {
          return;
        }
        context.save();
        context.fillStyle = parseColor(color);

        let [x=0, y=0] = pos;
        context.beginPath();
        context.arc(x, y, radius, 0, TWO_PI, false);
        context.fill();
        context.restore();
      },
      polygon(points, color) {
        if (context == null) {
          return;
        }
        context.save();
        context.strokeStyle = parseColor(color);

        context.beginPath();
        let isFirst = true;
        for (let point of points) {
          let [x=0, y=0] = point;
          if (isFirst) {
            context.moveTo(x, y);
          }
          else {
            context.lineTo(x, y);
          }
          isFirst = false;
        }
        // Explicitly close the polygon
        context.closePath();
        context.stroke();
        context.restore();
      },
      filled_polygon(points, color) {
        if (context == null) {
          return;
        }
        context.save();
        context.fillStyle = parseColor(color);

        context.beginPath();
        let isFirst = true;
        for (let point of points) {
          let [x=0, y=0] = point;
          if (isFirst) {
            context.moveTo(x, y);
          }
          else {
            context.lineTo(x, y);
          }
          isFirst = false;
        }
        context.fill();
        context.restore();
      },
      rect(rect, color, width = 1) {
        if (!(rect instanceof Rect)) {
          throw new TypeError('rect must be a Rect.');
        }
        if (context == null) {
          return;
        }
        context.save();
        context.lineWidth = width;
        context.strokeStyle = parseColor(color);
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.restore();
      },
      filled_rect(rect, color) {
        if (!(rect instanceof Rect)) {
          throw new TypeError('rect must be a Rect.');
        }
        if (context == null) {
          return;
        }
        context.save();
        context.fillStyle = parseColor(color);
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
        context.restore();
      },
      text(text, config) {
        screen.draw.textbox(text, null, config);
      },
      textbox(text, rect, config) {
        if (typeof text !== 'string') {
          return;
        }
        context.save();

        let fontsize = DEFAULT_FONT_SIZE,
            fontname = DEFAULT_FONT,
            color = DEFAULT_COLOR,
            drawOutline = false,
            gcolor, x, y;

        if ('fontsize' in config) {
          fontsize = config['fontsize'];
        }
        if ('fontname' in config) {
          fontname = config['fontname'];
        }
        context.font = fontsize + 'px ' + fontname;

        context.textAlign = 'left';
        context.textBaseline = 'top';
        if ('topleft' in config) {
          [x=0, y=0] = config['topleft'];
        }
        else if ('midtop' in config) {
          [x=0, y=0] = config['midtop'];
          context.textAlign = 'center';
          context.textBaseline = 'top';
        }
        else if ('topright' in config) {
          [x=0, y=0] = config['topright'];
          context.textAlign = 'right';
          context.textBaseline = 'top';
        }
        else if ('midleft' in config) {
          [x=0, y=0] = config['midleft'];
          context.textAlign = 'left';
          context.textBaseline = 'middle';
        }
        else if ('center' in config) {
          [x=0, y=0] = config['center'];
          context.textAlign = 'center';
          context.textBaseline = 'middle';
        }
        else if ('midright' in config) {
          [x=0, y=0] = config['midright'];
          context.textAlign = 'right';
          context.textBaseline = 'middle';
        }
        else if ('bottomleft' in config) {
          [x=0, y=0] = config['bottomleft'];
          context.textAlign = 'left';
          context.textBaseline = 'bottom';
        }
        else if ('midbottom' in config) {
          [x=0, y=0] = config['midbottom'];
          context.textAlign = 'center';
          context.textBaseline = 'bottom';
        }
        else if ('bottomright' in config) {
          [x=0, y=0] = config['bottomright'];
          context.textAlign = 'right';
          context.textBaseline = 'bottom';
        }
        else if ('pos' in config) {
          [x=0, y=0] = config['pos'];
        }

        if ('color' in config) {
          color = parseColor(config['color']);
        }
        if ('gcolor' in config) {
          gcolor = parseColor(config['gcolor']);
        }
        if ('owidth' in config) {
          drawOutline = true;
          context.lineWidth = config['owidth'];
          if ('ocolor' in config) {
            context.strokeStyle = parseColor(config['ocolor']);
          }
        }
        if ('shadow' in config) {
          let [sdx=0, sdy=0] = config['shadow'];
          context.shadowOffsetX = sdx;
          context.shadowOffsetY = sdy;
          if ('scolor' in config) {
            context.shadowColor = parseColor(config['scolor']);
          }
        }

        context.fillStyle = color;
        let gradient;
        if (rect instanceof Rect) {
          while (fontsize > 0) {
            let m = context.measureText(text);
            if (m.width < rect.width) {
              if (gcolor != null) {
                // The linear gradient is dependent on the fontsize to determine the line height
                if (context.textBaseline === 'bottom') {
                  gradient = context.createLinearGradient(0, y - fontsize, 0, y);
                }
                else if (context.textBaseline === 'middle') {
                  gradient = context.createLinearGradient(0, y - Math.floor(fontsize / 2), 0, y + Math.floor(fontsize / 2));
                }
                else {
                  gradient = context.createLinearGradient(0, y, 0, y + fontsize);
                }
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, gcolor);
                context.fillStyle = gradient;
              }

              context.fillText(text, x, y);
              if (drawOutline) {
                context.strokeText(text, x, y);
              }

              break;
            }
            fontsize--;
            context.font = fontsize + 'px ' + fontname;
          }
        }
        else {
          let i = 0;
          for (let line of text.split('\n')) {
            let line_y = y + (i * fontsize);

            if (gcolor != null) {
              // The linear gradient repeats for each line
              if (context.textBaseline === 'bottom') {
                gradient = context.createLinearGradient(0, line_y - fontsize, 0, line_y);
              }
              else if (context.textBaseline === 'middle') {
                gradient = context.createLinearGradient(0, line_y - Math.floor(fontsize / 2), 0, line_y + Math.floor(fontsize / 2));
              }
              else {
                gradient = context.createLinearGradient(0, line_y, 0, line_y + fontsize);
              }
              gradient.addColorStop(0, color);
              gradient.addColorStop(1, gcolor);
              context.fillStyle = gradient;
            }

            context.fillText(line, x, line_y);
            if (drawOutline) {
              context.strokeText(line, x, line_y);
            }

            i++;
          }
        }
        context.restore();
      }
    },

    /*
     * Return a Rect representing the bounds of the screen.
     */
    bounds() {
      return new Rect(0, 0, width, height);
    },

    /*
     * Clear the screen to black.
     */
    clear() {
      if (context == null) {
        return;
      }
      context.clearRect(0, 0, width, height);
      this.fill('black');
    },

    /*
     * Fill the screen with a colour.
     */
    fill(color, gcolor) {
      if (context == null) {
        return;
      }
      if (gcolor != null) {
        let gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, parseColor(color));
        gradient.addColorStop(1, parseColor(gcolor));
        context.fillStyle = gradient;
      }
      else {
        context.fillStyle = parseColor(color);
      }
      context.fillRect(0, 0, width, height);
    },

    /*
     * Draw object to the screen at the given position.
     */
    blit(object, pos) {
      if (context == null) {
        return;
      }

      if (object instanceof Actor) {
        let image = images[object.name],
            [x=0, y=0] = object.anchor;
        context.save();
        // Move the origin to the anchor so we can rotate
        context.translate(...object.pos);
        // Canvas rotates clockwise but Pygame Zero rotates counterclockwise (anticlockwise)
        context.rotate(-(object.angle % 360) * Math.PI / 180);
        // Move the origin to the topleft to draw the image
        context.translate(-x, -y);
        context.drawImage(image, 0, 0);
        context.restore();
      }
      else if (typeof object === 'string') {
        if (!(object in images)) {
          throw new RangeError(`Unknown image "${ object }".`);
        }
        let image = images[object],
            [x=0, y=0] = pos;
        context.save();
        context.drawImage(image, x, y);
        context.restore();
      }
      else {
        // Otherwise, object is not recognized
        throw new TypeError('Unrecognized object to blit.');
      }
    },

    /*
     * Setup the screen object to draw to the canvas element with ID canvasID.
     *
     * Also look around to see what is available.
     */
    set_mode(canvasID, resetID, pauseID) {
      canvas = document.querySelector(canvasID);
      if (canvas == null) {
        // If the element does not exist
        return;
      }
      if (!canvas.getContext) {
        // If not the canvas element or Canvas API not supported
        return;
      }
      if (window.TITLE) {
        document.querySelector('title').textContent = window.TITLE;
        document.querySelector('h1').textContent = window.TITLE;
      }
      if (window.WIDTH) {
        width = canvas.width = window.WIDTH;
      }
      else {
        width = canvas.width = DEFAULT_WIDTH;
      }
      if (window.HEIGHT) {
        height = canvas.height = window.HEIGHT;
      }
      else {
        height = canvas.height = DEFAULT_HEIGHT;
      }

      context = canvas.getContext('2d');
      hasKeyDown = (typeof window.on_key_down === 'function');
      hasKeyUp = (typeof window.on_key_up === 'function');
      hasDraw = (typeof window.draw === 'function');
      hasUpdate = (typeof window.update === 'function');

      let x = Math.floor(width / 2),
          y = Math.floor(height / 2);
      screen.clear();
      screen.draw.filled_circle([x, y], 25, 'white');
      screen.draw.filled_polygon([[x + 11, y], [x - 6, y - 10], [x - 6, y + 10]], 'black');
      canvas.addEventListener('click', clickStart);

      const reset = document.querySelector(resetID),
            pause = document.querySelector(pauseID);
      if (reset != null) {
        reset.addEventListener('click', (event) => {
          clock._clear_queue();
          Inbetweener._clear_queue();
          if (typeof window.reset === 'function') {
            window.reset();
          }
          if (pause != null) {
            pause.textContent = 'Pause';
          }
          screen.go();
        });
      }
      if (pause != null) {
        pause.addEventListener('click', (event) => {
          if (event.target.textContent == 'Pause') {
            screen.stop();
            event.target.textContent = 'Unpause';
          }
          else {
            event.target.textContent = 'Pause';
            screen.go();
          }
        });
      }
    },

    go() {
      if (running !== 0) {
        // If the core game loop is already running, then do nothing
        return;
      }

      // Add event listeners
      window.addEventListener('keydown', keydown, true);
      window.addEventListener('keyup', keyup, true);
      if (canvas != null) {
        if (typeof window.on_mouse_down === 'function') {
          canvas.addEventListener('mousedown', mousedown);
        }
        if (typeof window.on_mouse_up === 'function') {
          canvas.addEventListener('mouseup', mouseup);
        }
        if (typeof window.on_mouse_move === 'function') {
          canvas.addEventListener('mousemove', mousemove);
        }
      }

      screen.clear();

      // Start the core game loop
      start = undefined;
      running = window.requestAnimationFrame(loop);
    },
    stop() {
      if (running === 0) {
        // If the core game loop is not running, then do nothing
        return;
      }

      // Stop the core game loop
      window.cancelAnimationFrame(running);
      running = 0;

      // Remove event listeners
      window.removeEventListener('keydown', keydown, true);
      window.removeEventListener('keyup', keyup, true);
      if (canvas != null) {
        canvas.removeEventListener('mousedown', mousedown);
        canvas.removeEventListener('mouseup', mouseup);
        canvas.removeEventListener('mousemove', mousemove);
      }
    }
  }
})();
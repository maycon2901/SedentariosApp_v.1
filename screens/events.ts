// events.ts
type Callback = () => void;

let listeners: Callback[] = [];

export const addListener = (cb: Callback) => {
  listeners.push(cb);
};

export const removeListener = (cb: Callback) => {
  listeners = listeners.filter(l => l !== cb);
};

export const emitEvent = () => {
  listeners.forEach(cb => cb());
};

export type CustomEventListener<T> = (event: CustomEvent<T>)=>void

const on = <T>(eventType: string, listener: CustomEventListener<T>) => {
  document.addEventListener(eventType, listener);
}

const off = <T>(eventType: string, listener: CustomEventListener<T>) => {
  document.removeEventListener(eventType, listener);
}

const once = <T>(eventType: string, listener: CustomEventListener<T>) => {
  const handleEventOnce = (event) => {
    listener(event);
    off(eventType, handleEventOnce);
  }

  on(eventType, handleEventOnce);
}
const trigger = <T>(eventType: string, data: T) => {
  const event = new CustomEvent(eventType, { detail: data });

  document.dispatchEvent(event);
}

export { on, once, off, trigger };

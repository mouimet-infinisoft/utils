---
  path: /events
---

# Events
Small helper package to attach and trigger event on the dom.

## Import

> import { AppEvents } from '@infini-soft/utils';

## How to use

```tsx
import React from 'react';
import { AppEvents } from '@infini-soft/utils';

const { on, once, off, trigger } = AppEvents;

export default () => {
  React.useEffect(() => {
    const onHandler = event => {
      alert(`Received event ` + JSON.stringify(event));
    };
    on('Dog', onHandler);

    once('DogOnce', onHandler);

    return () => off('Dog', onHandler);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          trigger('Dog', { details: 'data' });
        }}
      >
        send event
      </button>
    </>
  );
};
```

### Listen
Attach a custom event to an handler. Needs to be removed before  unmounting component to avoid memory leaks

> on(eventType, listener)  => void

| Arguments | Types | Description |
|--- |--- |--- |
| eventType | string | Custom event |
| listener | (event)=>{} | Callback with optional payload as object like {details: < PAYLOAD >} |

### Listen Once
Attach a custom event to an handler ONCE
> once(eventType, listener) => void


| Arguments | Types | Description |
|--- |--- |--- |
| eventType | string | Custom event |
| listener | (event)=>{} | Callback with optional payload as object like {details: < PAYLOAD >} |


### Cancel
Removes a custom event handler. Needs to be removed before unmounting component to avoid memory leaks

> off(eventType, listener) => void


| Arguments | Types | Description |
|--- |--- |--- |
| eventType | string | Custom event |
| listener | (event)=>{} | Callback with optional payload as object like {details: < PAYLOAD >} |


### Emit
Fires a custom event

> trigger(eventType, payload) => void


| Arguments | Types | Description |
|--- |--- |--- |
| eventType | string | Custom event |
| payload | {details: PAYLOAD} | Optional payload |
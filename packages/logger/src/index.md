---
path: /logging
---

# Logging
Logging

## How to use

1. Create React Context
2. Create Hook
3. Create Wrapper

```tsx
/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */
import React from 'react';
 import { LogProvider, Plugins } from '@infini-soft/logger';
 
 const providerName = 'Infinicloud'
 const  defaultSource = 'Loggerdemo'
 
 const initialContext = {
     logger: new LogProvider({ console: Plugins.consoleLogger, hide: Plugins.antdMessagePlugin }, { debug: false, providerName, defaultSource })
 }
 
 const Context = React.createContext(initialContext)
 
 const useAppContext = () => {
     return React.useContext(Context)
 }
 
 const AppContext = ({ children }) => {
     const [context] = React.useState(initialContext);
 
     return <Context.Provider value={context}>{children}</Context.Provider>
 }

const LoggingExampleConsumer = () => {
    const { logger } = useAppContext()

    const onClickLogError = () => {
        logger.error({ message: `Error` })
        alert(`Open console to see log`)
    }

    return <div>
        <h1>Consumer</h1>
        <button onClick={onClickLogError}>Log Error</button>
    </div>
}

const LoggingExampleApp = () => {

    return <AppContext>
        <LoggingExampleConsumer />
    </AppContext>
}

export default LoggingExampleApp
```

## Todo

1. Document package
2. Create everyting in package
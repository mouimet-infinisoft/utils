# Infinisoft logger

Oversimplified, ultra lighweight and extendable logging package. Can log anything, anywhere very easy. Small is beautiful! :)

> This documentation is deprecated.

## How to use
```
import  {LogProvider, ConsoleLogWriter} from '@infini-soft/logger';

const log = new LogProvider('ProviderName', [new ConsoleLogWriter()], LOGLEVEL.DEBUG, 'Source')

log.error('Error example')
log.debug('Error example with stacktrace')
```

## Writers
- `ConsoleLogWriter` Default writer on console. 


## Custom Log Writers

- `Visual Studio Code Extension`: Workspace log file
    - https://www.npmjs.com/package/@infini-soft/vscodelogwriter
- `Sentry.io`: Logs to sentry.io
    - https://www.npmjs.com/package/@infini-soft/sentrylogwriter

## Log example:

>
> [1/31/2022 12:46:22 PM] : [ProviderName] : [Source] : [INFO] : Trying to handleResetNumber()...
>

## Class
```
class LogProvider {
/**
   * @param _providerName {string} Name appearing in to logs
   * @param _writers {ILogWriter[]} Log writers
   * @param _level {LOGLEVEL} Log level
   * @param _source {string} Source appearing in the logs
   */
 constructor(
    private _providerName: string = 'Infinisoft',
    private _writers: ILogWriter[],
    private _level: LOGLEVEL = LOGLEVEL.ERROR,
    private _source: string,
  )
```

## Methods
```
  /**
   * Log message to all writers with level error.
   * @param  {string|unknown} message
   * @param  {any} args
   */
  error(message: string | unknown, ...args: any[]) 

  /**
   * Log message to all writers with level warning.
   * @param  {string} message
   * @param  {any} object
   */
  warn(message: string, ...args: any[])

  /**
   * Log message to all writers with level info.
   * @param  {string} message
   * @param  {any[]} args
   */
  info(message: string, ...args: any[])

  /**
   * Log message to all writers with level debug and add stacktrace.
   * @param  {string} message
   * @param  {any[]} args
   */
  debug(message: string, ...args: any[]) 
  ```

## Levels
1. `Error`    Lower logging level
2. `Warning`
3. `Info`
4. `Debug`    Higher logging level - includes stacktrace

```
export enum LOGLEVEL {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}
```

## Log Writers
    Custom writers can be implemented using `ILogWriter`

## Abstraction
```
export interface ILogWriter {
  name: string;
  writers: LevelWriter
}

export type Writer = <T extends any[]>(message: string, ...args: T) => void

export type LevelWriter =
  { [LOGLEVEL.ERROR]: { name: 'ERROR', write: Writer } }
  & { [LOGLEVEL.WARN]: { name: 'WARN', write: Writer } }
  & { [LOGLEVEL.INFO]: { name: 'INFO', write: Writer } }
  & { [LOGLEVEL.DEBUG]: { name: 'DEBUG', write: Writer } }
```

## Console LogWriter implementation
Nothing fancy, stick to simplicity.
```
import { ILogWriter, LevelWriter } from "../provider";

/**
 * Log to console
 */
export class ConsoleLogWriter implements ILogWriter {
    name = "Console"
    writers: LevelWriter = [
        { name: 'ERROR', write: console.error },
        { name: 'WARN', write: console.warn },
        { name: 'INFO', write: console.info },
        { name: 'DEBUG', write: console.debug }
      ]   
};

```
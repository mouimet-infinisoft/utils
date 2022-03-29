/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */

export enum LOGLEVEL {
  ERROR,
  WARN,
  INFO,
  SUCCESS,
  CUSTOM
}

export type Options = {
  debug: boolean
  providerName: string
  defaultSource: string
}

export type Plugin = <M = unknown, C = unknown, >({ message, context, level, options }: { message: M, context: C, level: LOGLEVEL, options: Options }) => unknown | Function

/**
 * Provide standard logging features
 * Log levels are from less detailed (LOGLEVEL.ERROR) to the most verbose with stacktrace (LOGLEVEL.DEBUG)
 */
export class LogProvider<W extends Record<string, Plugin> = any, K extends keyof W = any>{

  /**
   * @param _providerName Name appearing in to logs
   * @param _writers Log writers
   * @param _source Source appearing in the logs
   */
  constructor(
    private _writers: W,
    private _options: Options = {
      debug: false,
      providerName: 'Infinisoft',
      defaultSource: 'Infinisource'
    }
  ) { }

  private log<M = unknown, C = unknown>(message: M, level: LOGLEVEL, context?: C ) {

    return Object.keys(this._writers).reduce((acc, key) => {
      try {
        acc[key] = this._writers[key]({ message, context, level, options: this._options })
        return acc
      } catch (error) {
        console.error(` [${this._options.providerName}] : [${this._options.defaultSource}] : LogWriter Error : Unable to write on logwriter source name: ${key}`);
        acc[key] = null
        return acc
      }

    }, {} as { [P in K]: any })
  }

  error = <M, C>({ message, context }:{message: M, context?: C}) => {
    return this.log(message, LOGLEVEL.ERROR, context);
  }

  warn = <M, C>({ message, context }:{message: M, context?: C}) => {
    return this.log(message, LOGLEVEL.WARN, context);
  }

  info = <M, C>({ message, context }:{message: M, context?: C}) => {
    return this.log(message, LOGLEVEL.INFO, context);
  }

  success = <M, C>({ message, context }:{message: M, context?: C}) => {
    return this.log(message,LOGLEVEL.SUCCESS,  context);
  }

  custom = <M, C>({ message, context }:{message: M, context?: C}) => {
    return this.log(message, LOGLEVEL.CUSTOM, context);
  }
}

/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */

import { consoleLogger } from "./plugins";
import { LOGLEVEL, Options, Plugin } from "./provider";

/**
 * Provide standard logging features
 * Log levels are from less detailed (LOGLEVEL.ERROR) to the most verbose with stacktrace (LOGLEVEL.DEBUG)
 */
export class Logger {
  /**
   * @param _providerName Name appearing in to logs
   * @param _writers Log writers
   * @param _source Source appearing in the logs
   */
  constructor(
    private _writers: Record<string, Plugin> ={
      console: consoleLogger
    },
    private _options: Options = {
      debug: false,
      providerName: 'Infinisoft',
      defaultSource: 'Infinisource'
    }
  ) {}

  private log<M = unknown, C = unknown>(message: M, level: LOGLEVEL, context?: C ) {
    let retValues: Record<keyof typeof this._writers, unknown> = {};

    Object.entries(this._writers).forEach(([k, callplugin]) => {
      try {
        retValues[k] = callplugin({ message, context, level, options: this._options })
      } catch (error) {
        console.error(` [${this._options.providerName}] : [${this._options.defaultSource}] : LogWriter Error : Unable to write on logwriter source name: ${k}`);
        retValues[k] = null
      }
    })

    return retValues;
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

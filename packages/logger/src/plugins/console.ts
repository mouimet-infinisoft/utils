/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */
import { LOGLEVEL, Plugin } from "../provider";

export const consoleLogger: Plugin = ({ message, context='', level, options }) => {
  const currentDate = new Date();
  const localDate = currentDate.toLocaleDateString();
  const localTime = currentDate.toLocaleTimeString();

  const _formattedMessage = `[${localDate} ${localTime}] : [${options.providerName}] : [${options.defaultSource}] : [ConsoleLogger] : ${message}`

  if (options.debug) {
    console.debug(message, context)
  } else {
    switch (level) {
      case LOGLEVEL.ERROR:
        console.error(_formattedMessage, context);
        break;
      case LOGLEVEL.WARN:
        console.warn(_formattedMessage, context);
        break;
      case LOGLEVEL.INFO:
        console.info(_formattedMessage, context);
        break;
      default:
        console.log(_formattedMessage, context);
        break;
    }
  }
}
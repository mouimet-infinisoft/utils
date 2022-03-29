/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */

import { Logger } from '@infini-soft/logger/lib/types/logger'
import * as Internals from '../internals'

export type TCommands = (_context: Internals.Context) => void

export type InternalCommands = {
    context: () => Internals.Context
    welcome: () => void
    parser: (argv: string[], logger: Logger) => Internals.ParserReturn
}
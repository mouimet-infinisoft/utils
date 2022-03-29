/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */
import * as Commands from './commands';
import * as Internals from './internals';
import { InternalCommands } from './types/commands';
const commandsMap: Record<string, Function> = Commands
const internalsMap: InternalCommands = Internals

process.on('SIGTERM', () => {
    process.exit()
})

export const cli = async (argv: string[]) => {
    internalsMap['welcome']?.()
    const context = internalsMap['context']?.()
    const parsed = internalsMap['parser']?.(argv, context.logger)
    await commandsMap[parsed.command]?.({ args: parsed, context })

    process.exit()
}

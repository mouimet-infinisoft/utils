/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */

const readline = require('node:readline');
var rl = readline.createInterface(
    process.stdin, process.stdout);

export const prompt = (statement: string) => new Promise<string>((res, rej) => {
    rl.question(statement, res)
})

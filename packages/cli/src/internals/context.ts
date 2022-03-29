/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */
import { Logger } from '@infini-soft/logger/lib';
import type { Logger as TLogger } from '@infini-soft/logger/lib/types/logger';
import { join, resolve } from 'path';
const pkg = require('../../package.json')

type Paths = {
    // Path where package is installed
    packageBasePath:string
    // Path where package templates are installed
    packageTemplatePath:string
    // Path where command where started
    executionBasePath: string
}

export type Context = {
    logger: TLogger
    paths: Paths
    package: {
        manager: string
        version: string
    }
}

export const context = (): Context => {
    const packageBasePath = resolve(__dirname, '..', '..')
    const packageTemplatePath = join(packageBasePath, 'templates')
    const executionBasePath = process.cwd()

    return {
        logger: new Logger(),
        paths: {
            packageBasePath,
            packageTemplatePath,
            executionBasePath
        },
        package: {
            manager: 'lerna',
            version: pkg.version
        }       
    }
}

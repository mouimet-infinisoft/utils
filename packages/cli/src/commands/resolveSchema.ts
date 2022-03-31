/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 * 
 * JSOM Schema Reference Resolver
 * 
 */

import axios from 'axios';
import { writeFileSync } from 'fs';
import { Context, ParserReturn } from '../internals';

const baseUrl = "https://www.kitchen.infini-soft.com/share/schemas"
const URI = /(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n|"]+)/gi

/**
 * Resolves JSON Schema $ref from `baseURL`
 * @param unresolved Unserialized JSON Schema
 * @param resource   REST API Resource
 * @returns          Unserialized Resolved JSON Schema
 */
const resolve = async (unresolved: string, resource: string) => {
    // all URL exclusive map
    const allReferenceUrl = [...new Set(JSON.stringify(unresolved).match(URI))].filter(url => url.includes(baseUrl))

    let draftSchema = JSON.parse(JSON.stringify(unresolved).replace(/{{{REPLACE}}}/g, resource))
    const allFetchPromises = await Promise.allSettled(allReferenceUrl.map((e) => axios.get(e)))
    const allSchemas = allFetchPromises.map((r: any) => r.value.data)

    // Should be replaced with reduce
    const unused = allSchemas.forEach((fetchedSchema) => {
        const { $id, $schema, type, description, title, properties, definitions, ...strippedSchema } = fetchedSchema

        draftSchema['components'] = {
            schemas: {
                ...(draftSchema?.['components']?.['schemas'] ?? {}),
                ...JSON.parse(JSON.stringify(strippedSchema))
            }
        }

        // Update local references
        const schemaKey = Object.keys(strippedSchema)[0]
        draftSchema = JSON.parse(JSON.stringify(draftSchema).replace(new RegExp($id, "g"), `#/components/schemas/${schemaKey}`))
    })

    // recursively resolve references
    return JSON.stringify(draftSchema).match(URI)?.length > 0 ? resolve(draftSchema, resource) : draftSchema
}

type ResolveSchemaProps = {
    args: ParserReturn
    context: Context
}

/**
 * Command entry point
 */
export const resolveSchema = async ({ args, context }: ResolveSchemaProps) => {
    const { logger } = context
    const { command } = args

    logger.info({ message: `Resolve JSON Schema Reference` })

    const schemaURL = process.argv[3]
    const resource = process.argv[4]
    const outputFile = process.argv[5]

    if (!schemaURL || !resource || !outputFile) {
        logger.info({ message: `Usage: ${command} [schema URL] [REST resource name] [output file]` })
        logger.info({ message: `Usage: ${command} https://www.kitchen.infini-soft.com/share/schemas/api/rest.json contact resolved.json` })
        process.exit()
    }

    const schema = await axios.get(schemaURL)
    const result = await resolve(schema.data, resource)
    writeFileSync(outputFile, JSON.stringify(result))

    logger.info({
        message: `
    Completed`, context: {
            schemaURL,
            outputFile,
        }
    })
}

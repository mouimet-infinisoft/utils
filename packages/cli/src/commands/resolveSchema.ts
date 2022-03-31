/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 * 
 * JSOM Schema Reference Resolver
 * 
 */

import axios from 'axios';

// const removeHeader = (schema: object) => {
//     let result = {}
//     try {
//         const { id, type, title, description, ...rest } = schema as any
//         result = rest;
//     } catch (error) {
//         console.error('Failed!')
//     }

//     return result
// }

/**
 * 
 * @param unresolved Unserialized JSON Schema
 * @param resource   REST API Resource
 * @returns          Unserialized Resolved JSON Schema
 */
const resolve = async (unresolved: string, resource: string) => {
    // let draftSchema = unresolved;
    // draftSchema['components'] = {}

    // all URL exclusive map
    const allReferenceUrl = [...new Set(JSON.stringify(unresolved).match(/(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n|"]+)/gi))]
    // Replace all FQ pattern buy relative Truncate 
    // https://www.kitchen.infini-soft.com/share/schema/common/list.json
    // #/components/schema/common/list.json


    let draftSchema = JSON.stringify(unresolved).replaceAll("https://www.kitchen.infini-soft.com/share/schema", '#').replaceAll('{{{REPLACE}}}', resource)
    console.log(`draftSchema`, draftSchema)
    // console.log(`draftSchema =`, draftSchema)
    console.log(`allReferenceUrl =`, allReferenceUrl)

    // Fetch all schema
    // const allFetch = await Promise.allSettled([...new Set(JSON.stringify(unresolved).match(/(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n|"]+)/gi))].map(axios.get))
    const allFetch = await Promise.allSettled(allReferenceUrl.map((e) => axios.get(e)))
    const allSchemaFetch = allFetch.map((r: any) => {
        console.log(r.value)
        return r.value
    })

    // Stack definitions
    allSchemaFetch.forEach(console.log)

    // Concatente at the end
    // console.log(`fetched schema `, allSchemaFetch)

    // const unused = (await Promise.allSettled(allSchemaFetch)).forEach(({ value: fetchedSchema }: any) => {
    //     const { $id, $schema, type, description, title, properties, definitions, ...strippedSchema } = fetchedSchema
    //     delete fetchedSchema['default']
    //     // getFilename(fetchedSchema['$id'])
    //     // console.log(`relative`, relativePath)
    //     // console.log(`fe6tchshcemae`, fetchedSchema)

    //     console.log(`strippeschema ` + strippedSchema)

    //     draftSchema['components'] = {
    //         schemas: {
    //         ...JSON.parse(JSON.stringify(draftSchema['schemas'])),
    //         ...JSON.parse(JSON.stringify(strippedSchema))
    //         }
    //     }
    //     // console.log(`HJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJBHJB` + JSON.stringify(resolved['components']['schema']))
    //     // resolved = JSON.parse(JSON.stringify(resolved).replaceAll(JSON.stringify({ "$ref": fetchedSchema['$id'] }), JSON.stringify(fetchedSchema)).replaceAll('{{{REPLACE}}}', resource))
    // })


    // resolved['components'] = {
    //     ...resolved['components'],
    //     schema: draftSchema.schema,
    // }

    // console.log(JSON.stringify(resolved['components']))

    return {
        ...JSON.parse(draftSchema),
        ...allSchemaFetch
    }
}

// const getFilename = (id: string) => {
//     const parsed = id.split('/')
//     const file = parsed[parsed.length - 1]
//     const fileName = file.split('.')[0]
//     const extension = file.split('.')[1]

//     console.log(`parsed`, parsed)
//     console.log(`file`, file)
//     console.log(`fileName`, fileName)
//     console.log(`extensoiopn`, extension)
// }

/**
 * 
 * @param unresolved Unserialized JSON Schema
 * @returns          Unserialized Resolved JSON Schema
 */
// const getRefUrlList = (unresolved: unknown) => [...new Set(JSON.stringify(unresolved).match(/(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n|"]+)/gi))]

/**
 * Command entry point
 */
export const resolveSchema = async () => {

    console.log(`
    Resolve JSON Schema Reference
    `)

    const schemaURL = process.argv[3]
    const resource = process.argv[4]
    const outputFile = process.argv[5]

    if (!schemaURL || !resource || !outputFile) {
        console.log(`Usage: ${process.argv[1]} [schema URL] [REST resource name] [output file]`)
        console.log(`Usage: ${process.argv[1]} https://www.kitchen.infini-soft.com/share/schema/api/rest.json contact resolved.json`)
        process.exit()
    }

    const schema = await axios.get(schemaURL)
    // const result = await resolve(schema.data, resource)
    //@ts-ignore
    // writeFileSync(outputFile, result)

    console.log(`
    Completed
    Fetched: ${schemaURL}
    Schema written to ${outputFile}
    `)
}

resolveSchema()
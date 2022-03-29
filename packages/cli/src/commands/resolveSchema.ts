import { writeFileSync } from 'fs';
const axios = require('axios').default;

const resolve = async (unresolved: unknown, resource: string) => {
    let resolved = unresolved;

    const allFetch = await Promise.allSettled([...new Set(JSON.stringify(unresolved).match(/(?:(?:(?:ftp|http)[s]*:\/\/|www\.)[^\.]+\.[^ \n|"]+)/gi))].map(axios.get))
    const allSchemaFetch = allFetch.map((r: any) => r.value.data)
    const unused = (await Promise.allSettled(allSchemaFetch)).forEach(({ value: fetchedSchema }: any) => {
        resolved = JSON.parse(JSON.stringify(resolved).replaceAll(JSON.stringify({ "$ref": fetchedSchema['$id'] }), JSON.stringify(fetchedSchema)).replaceAll('{{{REPLACE}}}', resource))
    })

    return resolved
}

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

    const schema = await (await axios.get(schemaURL)).data
    const result = await resolve(schema, resource)
    writeFileSync(outputFile, JSON.stringify(result))

    console.log(`
    Completed
    Fetched: ${schemaURL}
    Schema written to ${outputFile}
    `)
}


import { Logger as TLogger } from "@infini-soft/logger/lib/types/logger";

export const parser = (argv: string[], logger: TLogger) => {
    try {
        logger.info({ message: `Try parsing argv `, context: argv });
        const global = process.argv[0];
        const cliFileAndPath = process.argv[1];
        const command = process.argv[2];

        const result = {
            global,
            cliFileAndPath,
            command
        };
        logger.success({ message: `Parser success result `, context: result });
        return result;
    } catch (error) {
        console.error({ message: `parse error`, context: error });
    }

    return null;
};

export type ParserReturn = ReturnType<typeof parser>

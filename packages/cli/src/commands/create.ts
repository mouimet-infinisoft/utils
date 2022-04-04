import { Logger } from '@infini-soft/logger/lib/types/logger';
import { execSync } from 'child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Context, ParserReturn, prompt } from "../internals";
import { generateSchema } from './generateSchema';

/**
 * Template Method for automatic Micro App scafolding
 * with our standards
 * 
 * Process has 2 main steps
 * i. Micro App Generator
 * ii. Container App Config
 * 
 * 1. Micro App Process
 * 
 * create sub folder
 * yarn create @umijs/umi-app
 * update package.json
 * lerna bootstrap 
 *  @umijs/preset-ui @umijs/plugin-qiankun 
 *  antd
 *
 * antd pro
* @ant-design/pro-form
* @ant-design/pro-layout
* @ant-design/pro-table
* @ant-design/pro-list
* @ant-design/pro-descriptions
* @ant-design/pro-card
* @ant-design/pro-skeleton
* @ant-design/pro-table 
 * @infini-soft/kitchensink
 * 
 * copy template/* to target
 * .env Environement var
 * .umirc.ts configuration
 * 
 * 2. Container App Config
 * 
 */

type Config = {
    appName: string
    targetDir: string
    targetJson: string
    templateJson: string
    templateArchive: string
    pkgName: string
    portNumber: string
    targetSchema: string
    configJson: string
}

const createMicroAppTemplate = (config: Config, context: Context) => {
    const { targetDir, templateArchive, pkgName, portNumber, appName } = config
    const { executionBasePath } = context.paths
    const { manager } = context.package
    const { logger } = context

    const templateMethod = [
        () => mkdir(targetDir, logger),
        () => process.chdir(targetDir),
        () => exec(`yarn create @umijs/umi-app`, logger),
        () => exec(`rm ${targetDir}/.umirc.ts`, logger),
        () => exec(`curl ${templateArchive} | tar zxvf -`, logger),
        () => updateConfig(logger, config),
        () => exec(`echo PORT=${portNumber} > .env`, logger),
        () => exec(`echo UMI_UI=none >> .env`, logger),
        () => generateApiJsonSchema(logger, config),
        () => process.chdir(executionBasePath),
        () => exec(`${manager} bootstrap --scope=${pkgName}`, logger),
        () => exec(`${manager} add @umijs/preset-ui --scope=${pkgName}`, logger),
        () => exec(`${manager} add @umijs/plugin-qiankun --scope=${pkgName}`, logger),
        () => exec(`${manager} add @umijs/plugin-openapi --scope=${pkgName}`, logger),
        () => exec(`${manager} add @infini-soft/kitchensink --scope=${pkgName}`, logger),
        () => exec(`${manager} add @infini-soft/logger --scope=${pkgName}`, logger),
        () => exec(`${manager} add @infini-soft/utils --scope=${pkgName}`, logger),
        () => exec(`${manager} add antd --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-field --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-form --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-layout --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-table --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-list --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-descriptions --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-card --scope=${pkgName}`, logger),
        () => exec(`${manager} add @ant-design/pro-skeleton --scope=${pkgName}`, logger),
        () => exec(`${manager} add rc-field-form --scope=${pkgName}`, logger),
        () => exec(`${manager} add @faker-js/faker -D --scope=${pkgName}`, logger),
        () => exec(`${manager} add @types/express -D --scope=${pkgName}`, logger),
        () => process.chdir(targetDir),
        () => exec(`umi generate tmp`, logger),
        () => exec(`umi openapi`, logger)
    ]


    for (let cmd of templateMethod) {
        cmd()
    }
}

const updateConfig =  (logger: Logger, { pkgName, targetJson, configJson, appName, templateJson }: Config) => {
    logger.info({ message: `Upadating config` })
    try {

        const _templateJson =    {
            "name": "@infini-soft/testv1234",
            "version": "1.0.0",
            "description": "Infinicloud Micro Front End App",
            "author": "Infinisoft Inc. <info@infini-soft.com>",
            "homepage": "http://www.infini-soft.com/",
            "license": "UNLICENSED",
            "private": false,
            "scripts": {
                "start:mock": "set ENV=mock&& umi dev",
                "start:test": "set ENV=test&& umi dev",
                "openapi": "umi openapi",
                "test": "jest",
                "types": "tsc --declaration --emitDeclarationOnly",
                "build": "tsc",
                "clean": "rm -rf ./dist ./out ./lib ./src/.umi"
            }
        }
        console.log(`tempalte json `, _templateJson)
        const targetAppJson = JSON.parse(readFileSync(targetJson).toString('utf8'))

        logger.info({ message: `initial config = `, context: targetAppJson })

        const mergedJson = {
            ..._templateJson,
            ...targetAppJson,
            scripts: {
                ..._templateJson.scripts,
                ...targetAppJson.scripts
            }
        }
        mergedJson['private'] = false
        mergedJson['name'] = pkgName
        delete mergedJson['scripts']['postinstall']

        logger.info({ message: `merged json = `, context: mergedJson })

        writeFileSync(targetJson, JSON.stringify(mergedJson, null, 2), 'utf8');
        writeFileSync(configJson, JSON.stringify({ appName }, null, 2), 'utf8');
        logger.success({ message: `Update config complete` })
    } catch (error) {
        logger.error({ message: `Failed, updating config`, context: error })
        process.exit(-1)
    } finally {
        logger.success({ message: `Configuration update complete` })
    }
}

const mkdir = (dir: string, logger: Logger) => {
    logger.info({ message: `Creating directory`, context: dir })
    var fs = require('fs');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        logger.success({ message: `Directory created` })
    } else {
        logger.error({ message: `Failed, directory existing`, context: dir })
        process.exit(-1)
    }
}

const exec = (command: string, logger: Logger) => {
    logger.info({
        message: `Running command ${command}`
    });

    try {
        execSync(command)
    }
    catch (error) {
        logger.error({ message: error })
        process.exit(-1)
    } finally {
        logger.success({
            message: `Complete successfully!`
        });
    }
}

const copy = (source: string, destination: string, logger: Logger) => {
    logger.info({
        message: `Copying template ${source} to ${destination}`
    });

    try {
        copyFileSync(source, destination)
    }
    catch (error) {
        logger.error({ message: error })
        process.exit(-1)
    } finally {
        logger.success({
            message: `Complete successfully!`
        });
    }
}

const generateApiJsonSchema = (logger: Logger, { appName, targetSchema }: Config) => {
    logger.info({ message: `Generate Template OpenAPI 3.0.1 JSON Schema` })
    try {
        const schema = generateSchema({ resourceName: appName, logger })
        console.log(schema)
        writeFileSync(targetSchema, JSON.stringify(schema, null, 2), 'utf8');
        logger.success({ message: `Generate schema template complete` })
    } catch (error) {
        logger.error({ message: `Failed, generate schema template`, context: error })
        process.exit(-1)
    }
}


type CreateProps = {
    args: ParserReturn
    context: Context
}

const promptConfig = async (context: Context): Promise<Config> => {
    const appName = await prompt(`What is the app name: `)
    const portNumber = await prompt(`Port number: `)

    const defaultTemplateFile = `micro${context.package.version}.tar.gz`
    const _templateFile = await prompt(`Change template archive? (default is ${defaultTemplateFile}) `)
    const templateFile = _templateFile ? _templateFile : defaultTemplateFile
    const templateArchive = `${context.paths.packageTemplatePath}/${templateFile}`
    const templateJson = `https://www.kitchen.infini-soft.com/share/templates/package.json`

    const targetDir = resolve(`${context.paths.executionBasePath}/packages/${appName}`)
    const targetSchema = resolve(`${targetDir}/models/schemas/schemas.json`)
    const targetJson = resolve(`${targetDir}/package.json`)
    const configJson = resolve(`${targetDir}/config/config.json`)
    const pkgName = `@infini-soft/${appName}`
    const confirmation = await prompt(`

Micro app is going to be scafolded with that config:
App name: ${appName}
Port number: ${portNumber}
Template: ${templateFile}
Target dir: ${targetDir}

Are you sure? [y/N]
    `)

    if (confirmation !== 'y') {
        process.exit();
    }

    return {
        appName,
        portNumber,
        targetDir,
        templateArchive,
        templateJson,
        pkgName,
        targetJson,
        targetSchema,
        configJson
    }
}

export const create = async ({ args, context }: CreateProps) => {
    const { info } = context.logger
    info({ message: `Create Micro Front End App` })

    const conf = await promptConfig(context)
    createMicroAppTemplate(conf, context)

    // for (let tplFile of templateFilesForCopy) {
    //     copy(`${templateDir}/${tplFile}`, `${generateTargetDir(appName)}/${tplFile}`, context.logger)
    // }

    context.logger.success({ message: `${conf.appName} install complete!` })
    process.exit()
}

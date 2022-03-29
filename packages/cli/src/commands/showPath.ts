/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 * 
 * Display paths
 */

export const showPath = ({context}) => {
    const { packageBasePath, packageTemplatePath, executionBasePath } = context.paths

    console.log(`packageBasePath (Where package is installed)`, packageBasePath)
    console.log(`packageTemplatePath (basePath/templates)`, packageTemplatePath)
    console.log(`executionBasePath (Where cli is executed) `, executionBasePath)    
}

/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */
const pkg = require('../../package.json')

export const welcome = () => {
    console.log(
`
****************************************************
Infinicloud Command Line Interface v${pkg.version}
by Infinisoft Inc.
****************************************************
`
    )
}
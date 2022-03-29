/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

/**
 * Date Field Sorter Factory for Antd ProTable using Bubble sort algorithm
 * @param field Field to sort within the datasource
 * @returns Comparison of 2 dates
 */
export const bubbleDate = (field: string) => (a: any, b: any) => dayjs.duration(dayjs(b[field]).diff(dayjs(a[field])))

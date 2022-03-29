/**
 * Copyright © All rights reserved 2022
 * Infinisoft Inc.
 * www.infini-soft.com
 */

/**
 * Field Sorter Factory for Antd ProTable using Bubble sort algorithm
 * @param field Field to sort within the datasource
 * @returns Comparison of 2 fields 
 */
export const bubble = <T, K extends keyof T>(field: K) => (a: T, b: T) => {
  const field1 = a[field] || '';
  const field2 = b[field] || '';

  if (field1 < field2) return -1;
  if (field2 < field1) return 1;
  return 0;
}

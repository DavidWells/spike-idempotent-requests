import React from 'react'
import { Card, Text, Badge } from '@mantine/core'

/**
 * @typedef {Object} CacheStatusProps
 * @property {boolean} isCached
 * @property {number} cacheCount
 */

/**
 * Cache status display component
 * @param {CacheStatusProps} props
 */
export default function CacheStatus({ isCached = false, cacheCount = 0 }) {
  console.log('CacheStatus isCached:', isCached, 'cacheCount:', cacheCount)
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Text component="div">Cache Status: {isCached ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>}</Text>
      <Text component="div" size="sm" mt="xs">Cached Responses: {cacheCount}</Text>
    </Card>
  )
} 
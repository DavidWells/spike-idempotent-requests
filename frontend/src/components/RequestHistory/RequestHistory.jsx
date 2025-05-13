import React from 'react'
import { Card, List, Title } from '@mantine/core'

/**
 * @typedef {Object} RequestHistoryProps
 * @property {Array<{id: string, data: string, status: string}>} history
 */

/**
 * Request history display component
 * @param {RequestHistoryProps} props
 */
export default function RequestHistory({ history = [] }) {
  console.log('RequestHistory history:', history)
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4}>Request History</Title>
      <List spacing="xs" size="sm" mt="md">
        {history.length === 0 && <List.Item>No requests yet</List.Item>}
        {history.map(item => (
          <List.Item key={item.id}>
            <b>{item.data}</b> - <span>{item.status}</span>
          </List.Item>
        ))}
      </List>
    </Card>
  )
} 
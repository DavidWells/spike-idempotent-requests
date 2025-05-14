import React from 'react'
import { Card, List, Title, Text } from '@mantine/core'

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
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        maxHeight: '700px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Title order={4}>Request History</Title>
      <List 
        spacing="xs" 
        size="sm" 
        mt="md"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1
        }}
      >
        {history.length === 0 && <List.Item>No requests yet</List.Item>}
        {history.map(item => (
          <List.Item key={item.id} style={{ textAlign: 'left' }}>
            <Text 
              span 
              style={{ 
                display: 'inline-block', 
                width: '60px',
                color: item.status === 'cached' ? 'green' : 'blue'
              }}
            >
              {item.status}
            </Text>
            &nbsp;&nbsp;-&nbsp; <b>{item.data}</b>
          </List.Item>
        ))}
      </List>
    </Card>
  )
} 
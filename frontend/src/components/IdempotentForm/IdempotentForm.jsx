import React from 'react'
import { useState } from 'react'
import { TextInput, Button, Group, Box } from '@mantine/core'

/**
 * @typedef {Object} IdempotentFormProps
 * @property {function(string):void} onSubmit
 */

/**
 * Idempotent request form component
 * @param {IdempotentFormProps} props
 */
export default function IdempotentForm({ onSubmit }) {
  const [value, setValue] = useState('')

  // Debug log for value changes
  console.log('IdempotentForm value:', value)

  return (
    <Box maw={400} mx="auto">
      <form
        onSubmit={e => {
          e.preventDefault()
          console.log('IdempotentForm submit:', value)
          onSubmit && onSubmit(value)
        }}
      >
        <TextInput
          label="Request Data"
          placeholder="Enter data"
          value={value}
          onChange={e => setValue(e.target.value)}
          required
        />
        <Group position="right" mt="md">
          <Button type="submit">Send</Button>
        </Group>
      </form>
    </Box>
  )
} 
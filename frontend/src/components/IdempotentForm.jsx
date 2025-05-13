import { useState } from 'react'
import { TextInput, Button, Stack, Text, Paper, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { makeIdempotentRequest } from '../utils/idempotency'

function IdempotentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: ''
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  })

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await makeIdempotentRequest('/api/submit', values)
      console.log('Form submitted successfully:', response)
      setSuccess(true)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Paper shadow="sm" p="xl" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Text size="xl" fw={700}>Idempotent Form</Text>
          
          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="green" title="Success">
              Form submitted successfully!
            </Alert>
          )}

          <TextInput
            label="Name"
            placeholder="Enter your name"
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps('email')}
          />

          <Button 
            type="submit" 
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}

export default IdempotentForm 
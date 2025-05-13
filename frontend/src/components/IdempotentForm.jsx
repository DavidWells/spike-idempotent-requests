import { useState, useEffect } from 'react'
import { TextInput, Button, Stack, Text, Paper, Alert, Group, Badge } from '@mantine/core'
import { useForm } from '@mantine/form'
import { makeIdempotentRequest } from '../utils/idempotency'
import { getCacheSize, clearCache } from '../utils/cache'

const API_ENDPOINT = 'https://i53k6s6fk6.execute-api.us-west-1.amazonaws.com/prod/api/idempotent'

/**
 * IdempotentForm Component
 * 
 * A form component that handles idempotent requests to prevent duplicate submissions.
 * It includes form validation, error handling, and client-side caching of successful responses.
 * 
 * Features:
 * - Form validation for name and email fields
 * - Idempotent request handling with unique keys
 * - Client-side caching of successful responses
 * - Visual feedback for form states (loading, success, error)
 * - Cache management with size display and clear functionality
 * 
 * @example
 * ```jsx
 * <IdempotentForm />
 * ```
 * 
 * @returns {JSX.Element} The rendered form component
 */
function IdempotentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)

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

  useEffect(() => {
    setCacheSize(getCacheSize())
  }, [success])

  /**
   * Handles form submission with idempotent request
   * @param {Object} values - Form values containing name and email
   */
  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await makeIdempotentRequest(API_ENDPOINT, values)
      console.log('Form submitted successfully:', response)
      setSuccess(true)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(error.message || 'An error occurred while submitting the form')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Clears the form's response cache
   */
  const handleClearCache = () => {
    clearCache()
    setCacheSize(0)
  }

  return (
    <Paper shadow="sm" p="xl" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Group justify="space-between" align="center">
            <Text size="xl" fw={700}>Idempotent Form</Text>
            <Group>
              <Badge color="blue" size="lg">
                Cache Size: {cacheSize}
              </Badge>
              <Button 
                variant="light" 
                color="red" 
                onClick={handleClearCache}
                disabled={cacheSize === 0}
              >
                Clear Cache
              </Button>
            </Group>
          </Group>
          
          {error && (
            <Alert color="red" title="Error" withCloseButton onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="green" title="Success" withCloseButton onClose={() => setSuccess(false)}>
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
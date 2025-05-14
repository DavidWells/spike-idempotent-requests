import React from 'react'
import { useState, useEffect } from 'react'
import { TextInput, Button, Stack, Text, Paper, Group, Badge, Switch, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { makeIdempotentRequest, makeNormalRequest, getCacheCount, clearCache } from '../utils/idempotency'
import { notifications } from '@mantine/notifications'
import { useViewportSize } from '@mantine/hooks'

const API_ENDPOINT = 'https://esmozxw7u4.execute-api.us-west-1.amazonaws.com/prod/api/idempotent'

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
 * <IdempotentForm onRequestComplete={(response) => console.log(response)} />
 * ```
 * 
 * @param {Object} props
 * @param {Function} props.onRequestComplete - Callback function called when a request completes
 * @returns {JSX.Element} The rendered form component
 */
function IdempotentForm({ onRequestComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)
  const [isIdempotent, setIsIdempotent] = useState(true)
  const [lastResponse, setLastResponse] = useState(null)
  const { width } = useViewportSize()

  const form = useForm({
    initialValues: {
      name: 'test',
      email: 'test@test.com'
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  })

  useEffect(() => {
    setCacheSize(getCacheCount())
  }, [success])

  /**
   * Handles form submission with idempotent request
   * @param {Object} values - Form values containing name and email
   */
  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    setSuccess(false)

    try {
      const makeRequest = isIdempotent ? makeIdempotentRequest : makeNormalRequest
      const response = await makeRequest(API_ENDPOINT, values)
      console.log('Form submitted successfully:', response)
      setLastResponse(response)
      setSuccess(true)
      form.reset()

      // Call onRequestComplete with the response and form values
      onRequestComplete?.(response, values)

      let msg = response.isCached ? 'Form was "fake" submitted <br/>because its payload was cached with idempotency key.' : 'Form submitted successfully'
      
      notifications.show({
        title: 'Success',
        message: <div dangerouslySetInnerHTML={{ __html: msg }} />,
        color: 'green',
        autoClose: 5000
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      notifications.show({
        title: 'Error',
        message: error.message || 'An error occurred while submitting the form',
        color: 'red',
        autoClose: 5000
      })
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
    notifications.show({
      title: 'Cache Cleared',
      message: 'All cached responses have been cleared',
      color: 'blue',
      autoClose: 5000
    })
  }

  return (
    <>
      <Paper 
        style={{ 
          minHeight: '500px', 
          display: 'flex', 
          flexDirection: 'column'
        }} 
        shadow="sm" 
        p="xl" 
        withBorder
      >
        <Title 
          order={1} 
          style={{ marginBottom: '20px' }}
          size={width < 768 ? 'h3' : 'h1'}
        >
          Idempotent Request Demo
        </Title>
        <Text style={{ marginBottom: '28px' }}>
          This form is designed to handle idempotent requests. It will prevent duplicate submissions by using a unique idempotency key.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group justify="space-around" align="center">
              <Switch
                label="Idempotent Mode"
                checked={isIdempotent}
                onChange={(event) => setIsIdempotent(event.currentTarget.checked)}
                color="blue"
              />
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

            <TextInput
              label="Name"
              placeholder="Enter your name"
              styles={{
                label: {
                  textAlign: 'left',
                  width: '100%'
                }
              }}
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Email"
              placeholder="Enter your email"
              styles={{
                label: {
                  textAlign: 'left',
                  width: '100%'
                }
              }}
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
        {lastResponse && (
          <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '12px' }}>
            <Text>Last Response:</Text>
            <pre>{JSON.stringify(lastResponse, null, 2)}</pre>
          </div>
        )}
      </Paper>
    </>
  )
}

export default IdempotentForm 
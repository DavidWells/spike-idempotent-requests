import { useState } from 'react'
import { TextInput, Button, Stack, Text, Paper } from '@mantine/core'
import { useForm } from '@mantine/form'

function IdempotentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    try {
      // TODO: Implement idempotent request handling in next commit
      console.log('Form values:', values)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Paper shadow="sm" p="xl" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Text size="xl" fw={700}>Idempotent Form</Text>
          
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
import { MantineProvider, Container } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import IdempotentForm from './components/IdempotentForm'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './App.css'

function App() {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      <Container size="sm" py="xl">
        <IdempotentForm />
      </Container>
    </MantineProvider>
  )
}

export default App

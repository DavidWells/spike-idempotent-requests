import { MantineProvider, Container, Grid } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import IdempotentForm from './components/IdempotentForm'
import RequestHistory from './components/RequestHistory/RequestHistory'
import { useState } from 'react'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './App.css'

function App() {
  const [requestHistory, setRequestHistory] = useState([])

  const handleRequestComplete = (response, formData) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')
    
    setRequestHistory(prev => [...prev, {
      id: response.idempotencyKey || Date.now().toString(),
      data: `${timeString} ${dateString} - ${formData.name} (${formData.email})`,
      status: response.isCached ? 'cached' : 'fetched'
    }])
  }

  return (
    <MantineProvider>
      <Notifications 
        position="bottom-right" 
        limit={2}
        autoClose={5000}
      />
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 12, md: 7 }}>
            <IdempotentForm onRequestComplete={handleRequestComplete} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 5 }}>
            <RequestHistory history={[...requestHistory].reverse()} />
          </Grid.Col>
        </Grid>
      </Container>
    </MantineProvider>
  )
}

export default App

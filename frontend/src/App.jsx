import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CacheStatus from './components/CacheStatus/CacheStatus'
import { MantineProvider, Container, Title, Button, Text, Group } from '@mantine/core'
import Home from './pages/Home'
import IdempotentForm from './components/IdempotentForm'
import '@mantine/core/styles.css'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MantineProvider>
      <Container size="sm" py="xl">
        <IdempotentForm />
      </Container>
    </MantineProvider>
  )
}

export default App

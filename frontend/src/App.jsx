import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CacheStatus from './components/CacheStatus/CacheStatus'
import { MantineProvider, Container, Title, Button, Text, Group } from '@mantine/core'
import '@mantine/core/styles.css'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MantineProvider>
      <Container size="md" py="xl">
        <Group justify="center" mb="xl">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </Group>
        <Title order={1} ta="center" mb="lg">Vite + React</Title>
        <CacheStatus isCached={true} cacheCount={10} />
        <Group justify="center" mt="xl">
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <Text>
            Edit <code>src/App.jsx</code> and save to test HMR
          </Text>
        </Group>
        <Text c="dimmed" ta="center" mt="xl">
          Click on the Vite and React logos to learn more
        </Text>
      </Container>
    </MantineProvider>
  )
}

export default App

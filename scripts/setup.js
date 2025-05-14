const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// Function to run commands and handle errors
function runCommand(command, cwd) {
  try {
    console.log(`Running: ${command} in ${cwd}`)
    execSync(command, { stdio: 'inherit', cwd })
  } catch (error) {
    console.error(`Failed to execute: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

// Function to determine package manager
function getPackageManager(dir) {
  return fs.existsSync(path.join(dir, 'pnpm-lock.yaml')) ? 'pnpm' : 'npm'
}

// Function to find all package.json directories
function findPackageJsonDirs(rootDir) {
  const packageDirs = []
  
  function traverse(dir) {
    const files = fs.readdirSync(dir)
    
    if (files.includes('package.json')) {
      packageDirs.push(dir)
    }
    
    files.forEach(file => {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory() && file !== 'node_modules') {
        traverse(fullPath)
      }
    })
  }
  
  traverse(rootDir)
  return packageDirs
}

// Main setup function
function setup() {
  console.log('🚀 Starting project setup...')

  // Find all package.json directories
  const rootDir = path.resolve(__dirname, '..')
  const packageDirs = findPackageJsonDirs(rootDir)
  
  console.log('\n📦 Installing dependencies for all workspaces...')
  packageDirs.forEach(dir => {
    const packageManager = getPackageManager(dir)
    console.log(`\nInstalling dependencies in: ${path.relative(rootDir, dir)} using ${packageManager}`)
    runCommand(`${packageManager} install`, dir)
  })

  console.log('\n✅ Setup completed successfully!')
}

// Run the setup
setup() 
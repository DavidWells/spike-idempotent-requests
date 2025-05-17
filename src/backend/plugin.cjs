const fs = require('fs')
const path = require('path')

class ManifestToEnvPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.hooks = {
      'after:deploy:deploy': this.afterDeploy.bind(this),
      'envsync:sync': this.syncEnv.bind(this)
    }

    // Register the custom command
    this.commands = {
      envsync: {
        usage: 'Sync environment variables from manifest to frontend',
        lifecycleEvents: ['sync']
      }
    }
  }

  async syncEnv() {
    await this.afterDeploy()
  }

  async afterDeploy() {
    try {
      // Read the manifest file
      const manifestPath = path.join(
        process.cwd(),
        '.serverless',
        'manifest.json'
      )
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      
      // Get the API URL from the manifest
      const apiUrl = manifest.prod.urls.apiGateway
      
      if (!apiUrl) {
        this.serverless.cli.log('Warning: No API URL found in manifest')
        return
      }

      // Create .env.prod content
      const envContent = `VITE_API_ENDPOINT=${apiUrl}\n`
      
      // Create _redirects content
      const redirectsContent = `/api/*  ${apiUrl}/api/:splat  200\n`
      
      // Write to frontend .env.prod file
      const frontendEnvPath = path.join(
        process.cwd(),
        '..',
        'frontend',
        '.env.production'
      )
      
      // Write to frontend _redirects file
      const frontendRedirectsPath = path.join(
        process.cwd(),
        '..',
        'frontend',
        '_redirects'
      )
      
      fs.writeFileSync(frontendEnvPath, envContent)
      fs.writeFileSync(frontendRedirectsPath, redirectsContent)
      
      this.serverless.cli.log(`Successfully wrote VITE_API_ENDPOINT to ${frontendEnvPath}`)
      this.serverless.cli.log(`Successfully wrote redirects to ${frontendRedirectsPath}`)
    } catch (error) {
      this.serverless.cli.log(`Error in ManifestToEnvPlugin: ${error.message}`)
      throw error
    }
  }
}

module.exports = ManifestToEnvPlugin 
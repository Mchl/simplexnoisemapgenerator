module.exports = {
  apps: [
    {
      name: 'simplexnoisemapgenerator',
      script: 'index.js',
      max_memory_restart: '1024M',
      instances: 0,
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
      watch: true
    }
  ]
}

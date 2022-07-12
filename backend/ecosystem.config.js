module.exports = {
  apps : [{
    name: 'attend-work',
    script: 'index.js',
    watch: false,
    instance_var: 'INSTANCE_ID',
    exec_mode: 'cluster',
    instances: 2,
    listen_timeout: 50000,
    kill_timeout: 5000,
    ignore_watch: ['node_modules', 'logs', 'package.json', 'package-lock.json', '.idea', '.git'],
    TZ: 'Asia/Seoul',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/logs/backend/err.log',
    out_file: '/logs/backend/out.log',
    merge_logs: true,
    max_memory_restart: '500M',
    node_args: [
      "--max_old_space_size=200"
    ],
    env_local: {
      NODE_ENV: 'local',
      NODE_CONFIG_DIR: './config',
    },
    env_dev: {
      NODE_ENV: 'dev',
      NODE_CONFIG_DIR: './config',
    },
    env_qa: {
      NODE_ENV: 'qa',
      NODE_CONFIG_DIR: './config',
    },
    env_prod: {
      NODE_ENV: 'prod',
      NODE_CONFIG_DIR: './config',
    },
    env_test: {
      NODE_ENV: 'test',
    },
  }]
};

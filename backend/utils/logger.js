/**
 * Structured logger for production use.
 * Outputs JSON in production for log aggregation (Render, Datadog, etc.)
 * Outputs human-readable format in development.
 */
const isProd = process.env.NODE_ENV === 'production';

function formatMsg(level, message, ...args) {
  const timestamp = new Date().toISOString();
  if (isProd) {
    return JSON.stringify({
      timestamp,
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      data: args.length > 0 ? args : undefined,
    });
  }
  const icons = { info: 'ℹ️', warn: '⚠️', error: '❌', debug: '🐛' };
  return `${icons[level] || '•'} [${timestamp.split('T')[1].split('.')[0]}] ${message}`;
}

const logger = {
  info: (msg, ...args) => console.log(formatMsg('info', msg, ...args)),
  warn: (msg, ...args) => console.warn(formatMsg('warn', msg, ...args)),
  error: (msg, ...args) => console.error(formatMsg('error', msg, ...args)),
  debug: (msg, ...args) => {
    if (!isProd) console.log(formatMsg('debug', msg, ...args));
  },
};

module.exports = logger;

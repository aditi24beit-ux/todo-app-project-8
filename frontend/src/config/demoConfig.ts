// Demo Mode Configuration
// Enables complete frontend testing independently while FastAPI backend is in development.
export const DEMO_CONFIG = {
  isDemoMode: true,
  storagePrefix: 'taskflow_demo_',
  accounts: {
    admin: {
      name: 'Priya Shah',
      email: 'admin@taskflow.demo',
      password: 'admin123',
      role: 'admin' as const,
    },
    user: {
      name: 'Aarav Mehta',
      email: 'user@taskflow.demo',
      password: 'user123',
      role: 'user' as const,
    },
  },
};

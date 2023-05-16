import { createEvent } from '../../utils/creator';

createEvent({
  name: 'Ready Event',
  id: 'ready',
  invoke: async () => {
    console.log('Client is ready');
    await import('./../../utils/deployer');
  },
});

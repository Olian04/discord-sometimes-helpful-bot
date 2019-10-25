import 'module-alias/register';

import { start } from './core/app';
import { args } from './core/preStartConfig';

(async () => {
  while (true) {
    try {
      await start();
    } catch (err) {
      console.error(err);
      if (args.env === 'development') {
        // Don't restart while in development mode.
        return;
      }

      // TODO: Figure out if this restarting logic actually works
      console.error(`An unexpected error occurred. Restarting client...`);
    }
  }
})();

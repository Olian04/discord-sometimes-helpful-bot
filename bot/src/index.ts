// tslint:disable:ordered-imports
import 'module-alias/register'; // see compilerOptions.paths in "tsconfig.json"
import './lib/config'; // loads environment variables & command line arguments
import './lib/app'; // bootstraps the rest of the app

import {writeFileSync} from 'node:fs';
import {engineApiCatalog} from '../src/components/engineIntellisense.js';
writeFileSync(new URL('../../web-learning-lab/shared/lab-game-v2/editor/api-catalog.json',import.meta.url),JSON.stringify(engineApiCatalog,null,2)+'\n');
console.log('Generated common API completion catalog from the Java runtime. Run Web scripts/sync-lab-game-v2.mjs afterwards.');

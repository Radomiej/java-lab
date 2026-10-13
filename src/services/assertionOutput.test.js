import {expect,test} from 'vitest';
import {parseAssertionOutput} from '../../public/vendor/teavm/assertion-output.js';
test('exports individual assertions without polluting the student console',()=>{
  expect(parseAssertionOutput(['Mage','__JAVA_LAB_CHECK__base-type\tPASS\tDziedziczenie','__JAVA_LAB_CHECK__state\tFAIL\tNiepoprawny stan'])).toEqual({output:'Mage',assertionResults:[{id:'base-type',passed:true,detail:'Asercja Java zaliczona.'},{id:'state',passed:false,detail:'Niepoprawny stan'}]});
});

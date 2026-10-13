import {expect,test} from 'vitest';
import {readFileSync} from 'node:fs';
const styles=readFileSync('src/styles/app.css','utf8');

test('fallback line-number styling does not stretch Monaco line numbers',()=>{
  const style=document.createElement('style');style.textContent=styles;document.head.append(style);
  const host=document.createElement('div');host.innerHTML='<div class="monaco-editor"><div class="line-numbers">1</div></div>';document.body.append(host);
  try {expect(getComputedStyle(host.querySelector('.line-numbers')).display).not.toBe('grid');}
  finally {host.remove();style.remove();}
});

import { afterEach,it,expect } from 'vitest';
import { renderHook,act,cleanup } from '@testing-library/react';
import { useGamePlayground } from './useGamePlayground.js';
afterEach(()=>{cleanup();localStorage.clear();});
it('persists game files independently and rejects invalid imports without modifying them',()=>{
  const first=renderHook(()=>useGamePlayground());
  act(()=>first.result.current.setFiles({'Extra.java':'class Extra {}'}));
  expect(()=>act(()=>first.result.current.replaceProject({version:2}))).toThrow();
  expect(first.result.current.project.files['Extra.java']).toBe('class Extra {}');first.unmount();
  const next=renderHook(()=>useGamePlayground());expect(next.result.current.project.files['Extra.java']).toBe('class Extra {}');
  expect(localStorage.getItem('java-lab-progress-v1')).toBeNull();
  act(()=>next.result.current.deleteFile('Extra.java'));expect(next.result.current.project.files['Extra.java']).toBeUndefined();
});

import {test,expect} from 'vitest';import {gameDevLessons} from './lessons/gameDevCourse.js';
test('scene tasks specify student-facing dimensions and positions rather than computed edges',()=>{
 const scene=gameDevLessons.find(lesson=>lesson.id==='g2d.scene');const third=scene.tasks[2];
 expect(third.criteria).toContain('Player ma pozycję (100, 100), szerokość 32 px i wysokość 32 px.');
 expect(third.criteria).toContain('Coin ma pozycję (180, 180), szerokość 16 px i wysokość 16 px.');
 expect(scene.tasks.flatMap(task=>task.criteria).join(' ')).not.toMatch(/84\.\.116|x=60\.\.100/);
 expect(third.javaTestFiles['JavaTest.java']).toContain('class JavaTest');
});

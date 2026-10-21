import {test,expect} from 'vitest';import {gameDevLessons} from './lessons/gameDevCourse.js';
test('scene tasks specify student-facing dimensions and positions rather than computed edges',()=>{
 const scene=gameDevLessons.find(lesson=>lesson.id==='g2d.scene');const third=scene.tasks[2];
 expect(third.criteria).toContain('Player ma pozycję (100, 100), szerokość 32 px i wysokość 32 px.');
 expect(third.criteria).toContain('Coin ma pozycję (180, 180), szerokość 16 px i wysokość 16 px.');
 expect(scene.tasks.flatMap(task=>task.criteria).join(' ')).not.toMatch(/84\.\.116|x=60\.\.100/);
 expect(third.javaTestFiles['JavaTest.java']).toContain('class JavaTest');
});
test('explains rectangle edges on the map separately from its center',()=>{
 const guided=gameDevLessons.find(lesson=>lesson.id==='g2d.scene').tasks[0];
 const copy=guided.criteria.join(' ');
 expect(copy).toContain('od x = 60 do x = 100');
 expect(copy).toContain('od y = 75 do y = 105');
 expect(copy).toContain('krawędzie');
 expect(copy).toContain('środek obiektu nadal jest w (80, 90)');
});
test('uses explicit from-to ranges throughout student-facing game criteria',()=>{
 expect(gameDevLessons.flatMap(lesson=>lesson.tasks.flatMap(task=>task.criteria)).join(' ')).not.toMatch(/-?\d+\.\.-?\d+/);
});

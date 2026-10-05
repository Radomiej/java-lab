# Game Dev — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Wdrożyć sześć lekcji Game Dev i biblioteczne mechanizmy ruchu, kolizji, pocisków i animacji.
**Architecture:** Java utrzymuje stan i generuje klatkę, JS renderuje. Nowe klasy w osobnych modułach źródeł Java; zachować publiczne API core.
**Tech Stack:** React JSX, TeaVM, Canvas 2D, Vitest; istniejący JDK tylko do testów deweloperskich.
**Spec:** ../specs/2026-10-02-game-dev-expansion-design.md

## Global Constraints

- Całość ucznia all-in-browser; bez nowych zależności i bez Playwright.
- Numeracja 101–199, 201–299, 301–399, 401–499; stabilne ID konsolowe.
- Asercje gry w Javie, nie regex i nie piksele.
- Własne reguły gry ucznia; ukryta biblioteka engine.

## Review Focus

- Szybki pocisk i kontakt z narożnikiem: brak tunnelingu i fałszywego trafienia.
- Zniszczenie obiektu w callbacku: nie kontynuować jego ruchu/kontaktów.
- Nieaktywny/usunięty cel AI: zatrzymać ruch.
- Zastąpienie/anulowanie shake: przywrócić bazę bez dryfu.
- Stare zapisane lekcje: zachować kod, nie zaliczać nowego wymagania.

## Task 1: API i fizyka

Files: src/data/gameCoreRuntime.js, gamePhysicsRuntime.js, gameExtrasRuntime.js; tests: gameEngineJava.test.js.
Interfaces: CircleCollider2D(radius), Collider2D.isTrigger; Follow/Flee/FlankTarget2D(target), ObstacleAvoidance2D; Projectile2D(directionX,directionY,speed,lifetime,owner); Tweens.position/scale/rotation/shake; Camera2D.shake; TileMap(texture,tileSize).
- [ ] Dodać testy Java rzeczywistej geometrii, filtrów, ruchu AI i animacji; uruchomić RED.
- [ ] Wdrożyć źródła Java i podłączyć fazy Game.step.
- [ ] Uruchomić testy GREEN i regresje.

## Task 2: Kurs i numeracja

Files: curriculum.js, lessons/gameDev.js, useCourseProgress.js; tests: curriculum.test.js i gameEngineJava.test.js.
Interfaces: GameMain extends Game; po trzy zadania; wszystkie rozwiązania kompilują i przechodzą javaTestMainClass.
- [ ] RED: zakresy numeracji i sześć lekcji.
- [ ] Wdrożyć sceny 401–406, testy obiektów i migrację wyboru.
- [ ] GREEN: wszystkie rozwiązania oraz lekcje konsolowe.

## Task 3: Dokumentacja i zakończenie

Files: docs/game-engine.md, docs/todo.md, README.md, javaEngineNavigation.js.
- [ ] Opisać faktyczne klasy/pola, hover i ograniczenia.
- [ ] npm test, npm run build, runtime TeaVM w istniejącym browserze.
- [ ] Oddzielny przegląd całości, poprawki i commit; push nie jest częścią tego polecenia.

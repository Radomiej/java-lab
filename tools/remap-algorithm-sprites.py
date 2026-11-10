"""Remap game-RPG sprites to semantic algorithm icons in javaConceptPages.js.

Only touches actor() calls inside 'algorithms-06'..'algorithms-20' blocks
(algorithms-01..05 were already remapped by hand). The new sprite is chosen
from keywords in the actor's name and state — every icon name must exist in
src/components/algoIcons.jsx or in the game asset manifest.
"""
import re, sys

PATH = r'C:\Nauka\java-lab\src\data\javaConceptPages.js'

RULES = [
    (r'zamian', 'swap'),
    (r'przesu', 'shift'),
    (r'sift', 'shift'),
    (r'stack|stos|odkład|zejście|push|pop', 'stack'),
    (r'podział|dziel|połow|half|exp\b|dzieci|część|partition|mniejsze|większe|wywoła|factorial\(|fib\(|power\(', 'split'),
    (r'scalan|merge|powrót|skład', 'merge'),
    (r'count|liczn|tally|sum\b|akumul|obrót|krok\b', 'tally'),
    (r'mid\b|indeks|index|low|high|i \+|wskaźnik|pozycj|przedział', 'pointer'),
    (r'lup|szuka|szukaj|patrz|obserwu|dno\b|warunek stopu|pivot|minimum|minIndex|korzeń|klucz|key\b|temp|zapamięt|pamięć|trzyma|przechow|największ|najmniejsz|d = |divisor', 'look'),
    (r'porównan|sprawdz|warunek|mniejsz|większ', 'compare'),
    (r'pass|przejść|iteracj|pętl', 'pass'),
    (r'błąd|poza|wyjąt|nieprawidłow|duplikat|koszt|uwaga|zły', 'warn'),
    (r'posortowan|wynik|gotow|koniec|właściw|miejscu|nwd|nww|pierwsz|palindrom|cezar|binom|odwrócon|zbilansowan|osiągaln|składow', 'bars-sorted'),
    (r'insert|wstaw', 'insert'),
    (r'tablic|element|komórk|rząd|ciąg', 'cells'),
]
DEFAULT = 'look'

pattern = re.compile(r"actor\('([^']*)', '([^']*)', '([a-z0-9-]+)'")

def pick(name, state):
    text = (name + ' ' + state).lower()
    for rx, icon in RULES:
        if re.search(rx, text):
            return icon
    return DEFAULT

lines = open(PATH, encoding='utf-8').read().splitlines(keepends=True)
inside = False
changed = 0
out = []
for line in lines:
    m = re.match(r"^  '(algorithms-\d+|objects|inheritance|fundamentals)", line)
    if m:
        key = m.group(1)
        inside = key.startswith('algorithms-') and int(key.split('-')[1]) >= 6
    if inside:
        def repl(match):
            nonlocal_changed = pick(match.group(1), match.group(2))
            if nonlocal_changed != match.group(3):
                globals()['changed'] += 1
            return f"actor('{match.group(1)}', '{match.group(2)}', '{nonlocal_changed}'"
        line = pattern.sub(repl, line)
    out.append(line)
open(PATH, 'w', encoding='utf-8', newline='').write(''.join(out))
print(f'remapped {changed} actor sprites')

# -*- coding: utf-8 -*-
"""Generates java-concepts infographics for the algorithms track (PIL).
Style: white bg, navy titles, orange/navy/teal cells, 3 connected panels."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "course-assets", "java-concepts")
W, H = 1568, 784
NAVY = (22, 45, 78); ORANGE = (226, 117, 82); TEAL = (24, 167, 140)
BORDER = (210, 222, 235); TXT = (35, 51, 71); SUB = (90, 106, 126)
FB = "C:/Windows/Fonts/arialbd.ttf"; FR = "C:/Windows/Fonts/arial.ttf"
f_title = ImageFont.truetype(FB, 46); f_head = ImageFont.truetype(FB, 26)
f_cell = ImageFont.truetype(FB, 40); f_idx = ImageFont.truetype(FR, 18)
f_cap = ImageFont.truetype(FR, 22); f_foot = ImageFont.truetype(FR, 20)

def center(d, x, y, s, f, fill):
    bb = d.textbbox((0, 0), s, font=f)
    d.text((x - (bb[2]-bb[0])/2, y - (bb[3]-bb[1])/2 - bb[1]), s, font=f, fill=fill)

def cells(d, x, y, vals, colors, idx=True, size=90, gap=14):
    for i, (v, c) in enumerate(zip(vals, colors)):
        px = x + i * (size + gap)
        d.rounded_rectangle([px, y, px+size, y+size], 14, fill=c)
        center(d, px+size/2, y+size/2, str(v), f_cell, (255, 255, 255))
        if idx:
            center(d, px+size/2, y+size+18, f"[{i}]", f_idx, SUB)

def arrow(d, x, y):
    d.polygon([(x, y-12), (x+26, y-12), (x+26, y-26), (x+56, y), (x+26, y+26), (x+26, y+12), (x, y+12)], fill=TEAL)

def row(vals, hi=(), base=NAVY, hic=ORANGE, size=90, cy=60, idx=True):
    n = len(vals)
    size = min(size, (430 - (n - 1) * 14) // max(n, 1))  # auto-fit within panel
    def b(d, x, y):
        total = n * size + (n - 1) * 14
        px = x + (470 - total) // 2
        cells(d, px, y+cy, vals, [hic if i in hi else base for i in range(n)], idx=idx, size=size)
    return b

def wrap(lines, cy=60):  # text lines inside a panel; (text, bold?)
    def b(d, x, y):
        for i, (s, bold) in enumerate(lines):
            center(d, x+235, y+cy+i*36, s, f_head if bold else f_cap, NAVY if bold else TXT)
    return b

def panel(d, x, y, w, h, header, body, caption):
    d.rounded_rectangle([x, y, x+w, y+h], 18, fill=(250, 252, 255), outline=BORDER, width=2)
    center(d, x+w/2, y+46, header, f_head, NAVY)
    body(d, x, y)
    for i, line in enumerate(caption):
        center(d, x+w/2, y+h-40-len(caption)*24+i*26, line, f_cap, TXT)

def render(spec):
    img = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(img)
    center(d, W/2, 62, spec["title"], f_title, NAVY)
    pw, ph, y0 = 470, 500, 170
    xs = [54, 548, 1042]
    for i, (header, body, caption) in enumerate(spec["panels"]):
        panel(d, xs[i], y0, pw, ph, header, body, caption)
        if i < 2:
            arrow(d, xs[i]+pw+8, y0+ph//2)
    d.line([(70, 706), (W-70, 706)], fill=BORDER, width=2)
    center(d, W/2, 738, spec["footer"], f_foot, TXT)
    img.save(os.path.join(OUT, spec["id"] + ".png"))
    print("OK", spec["id"])

SPECS = [
 dict(id="algorithms-01", title="Tablica: indeks wskazuje komórkę",
   panels=[
     ("Dane: int[] scores = {4, 9, 2, 7}", row([4,9,2,7]), ["indeksy liczymy od zera", "length = 4 komórki"]),
     ("findMax: lider = scores[0]", row([4,9,2,7], hi=(1,), cy=90), ["max = 4, przy i = 1:", "9 > 4 → max = 9", "2 i 7 nie wygrywają"]),
     ("Wynik przeglądania", row([9], base=TEAL, cy=110, idx=False), ["max = 9 po pełnej pętli", "sum += values[i] → 22", "zliczanie: count++"])],
   footer="findMax, sum, countAbove — każdy to jedno przejście pętlą po komórkach tablicy"),
 dict(id="algorithms-03", title="Sortowanie przez wybór: minimum staje na start",
   panels=[
     ("Reszta nieposortowana", row([4,2,7,3], hi=(1,)), ["minIndex zapamiętuje", "najmniejszy z reszty:", "2 na indeksie 1"]),
     ("Zamiana na granicy", row([2,4,7,3], hi=(0,), hic=TEAL), ["values[start] <-> values[minIndex]", "{2 | 4, 7, 3}", "2 już się nie ruszy"]),
     ("Posortowane od lewej", row([2,3,4,7], base=TEAL), ["n - 1 kroków", "ostatni element", "sam zostaje na miejscu"])],
   footer="selectionSort robi najwyżej n - 1 zamian — mniej niż bąbelkowe, ale O(n²) porównań"),
 dict(id="algorithms-04", title="Sortowanie przez wstawianie: klucz wchodzi w dziurę",
   panels=[
     ("key = values[i]", row([5,1,8,2], hi=(1,)), ["key = 1", "lewa część {5}", "jest posortowana"]),
     ("Przesuwanie w prawo", row([5,5,8,2], hi=(0,1)), ["5 > 1 → kopia w prawo", "dziura otwiera się", "na początku"]),
     ("key wstawiony", row([1,5,8,2], base=TEAL), ["values[j+1] = key", "{1, 5 | 8, 2}", "lewa część rośnie"])],
   footer="insertionSort przesuwa zamiast zamieniać — na prawie posortowanych danych zbliża się do O(n)"),
 dict(id="algorithms-05", title="Sortowanie przez scalanie: dziel i scalaj",
   panels=[
     ("Podział na połowy", wrap([("{5,1} | {4,2}", True), ("{5} {1} {4} {2}", False)], cy=110), ["dzielimy aż do jedynki:", "jednoelementowa", "jest posortowana"]),
     ("Scalanie palcami", row([1,5], base=ORANGE, cy=110), ["{1,5} + {2,4}", "mniejszy z czoła", "trafia do wyniku"]),
     ("Wynik posortowany", row([1,2,4,5], base=TEAL), ["merge(left, right)", "O(n log n)", "+ osobna tablica wyniku"])],
   footer="mergeSort: copyOfRange dzieli, merge scala — rekurencja schodzi do jedynki i wraca"),
 dict(id="algorithms-06", title="Sortowanie szybkie: pivot ustawia granicę",
   panels=[
     ("pivot = v[hi] = 5", row([4,7,2,9,5], hi=(4,)), ["ostatni element", "jest pivotem"]),
     ("Po partition", row([4,2,5,7,9], hi=(2,), hic=TEAL), ["mniejsze na lewo", "pivot na i + 1 = 2", "większe na prawo"]),
     ("Rekurencja stron", row([2,4,5,7,9], base=TEAL), ["quickSort(lo, p - 1)", "quickSort(p+1, hi)", "pivot już gotowy"])],
   footer="quickSort: partition ustawia pivot, rekurencja sortuje obie strony — O(n log n)"),
 dict(id="algorithms-07", title="Sortowanie przez zliczanie: kubełki bez porównań",
   panels=[
     ("Dane 0..9", row([4,1,3,1,2]), ["count[v]++", "kubełek 1 dostaje 2", "reszta po 1"]),
     ("Licznik wystąpień", row([0,2,1,1,1], base=ORANGE, size=70, cy=130), ["count[0..4]", "= [0,2,1,1,1]", "jedno przejście"]),
     ("Rozpisane z powrotem", row([1,1,2,3,4], base=TEAL), ["v pisane count[v] razy", "{1, 1, 2, 3, 4}", "zero porównań"])],
   footer="countingSort działa w O(n + zakres) — dla małego zakresu bije O(n²) prostych metod"),
 dict(id="algorithms-08", title="Shell i kopiec: odstępy oraz drzewo maksimum",
   panels=[
     ("Shell: gap = n/2", row([8,3,7,1,5], hi=(0,2)), ["porównujemy pary", "oddalone o gap", "potem gap /= 2"]),
     ("Kopiec w tablicy", row([9,6,4,1,2], hi=(0,)), ["v[0] = 9 = max", "dzieci i:", "2i+1 i 2i+2"]),
     ("Wynik", row([1,3,5,7,8], base=TEAL), ["siftDown naprawia", "korzeń po zamianie", "O(n log n)"])],
   footer="shellSort wygrywa na prawie gotowych danych; heapSort nie potrzebuje dodatkowej tablicy"),
 dict(id="algorithms-09", title="Wyszukiwanie binarne: odrzucamy połowę",
   panels=[
     ("mid = (low+high)/2", row([2,4,6,8,10], hi=(2,)), ["sorted[2] = 6", "cel = 8", "6 < 8"]),
     ("Lewa połowa odpada", row([8,10], cy=130, idx=False), ["low = mid + 1", "szukamy w {8, 10}", "−1 gdy zakres pusty"]),
     ("Trafienie", row([8], base=TEAL, cy=110, idx=False), ["indeks 3", "log n kroków", "nie n porównań"])],
   footer="findIndex działa tylko na posortowanej tablicy — w nieposortowanej odrzucenie połowy gubi cel"),
 dict(id="algorithms-10", title="Rekurencja: warunek stopu i krok rekurencyjny",
   panels=[
     ("Stos wywołań", row([4,3,2,1], cy=110, idx=False), ["factorial(4) czeka", "na factorial(3)...", "aż do factorial(1)"]),
     ("Warunek stopu", wrap([("n <= 1 → return 1", True), ("bez kolejnego wywołania", False), ("koniec zejścia w dół", False)], cy=120), ["1 to dno rekurencji"]),
     ("Powrót wyników", row([2,6,24], base=TEAL, cy=130, idx=False), ["składa się w górę:", "1→2→6→24", "factorial(4) = 24"])],
   footer="factorial(n) = n × factorial(n−1); szybka potęga: half = power(base, exp/2), half×half"),
 dict(id="algorithms-11", title="Ciąg Fibonacciego: dwa wywołania albo pętla",
   panels=[
     ("Definicja", row([0,1,1,2,3,5,8], size=58, cy=140), ["fib(0)=0, fib(1)=1", "każdy wyraz:", "suma dwóch poprzednich"]),
     ("Rekurencja dubli pracę", wrap([("fib(5) → fib(4)+fib(3)", True), ("fib(3) liczone 2×", False), ("bardzo duzo wywolan", False)], cy=120), ["drzewo wywołań rośnie", "wykładniczo"]),
     ("Iteracja: a, b", row([13], base=TEAL, cy=110, idx=False), ["next = a + b", "a = b, b = next", "fib(7) = 13 w 7 krokach"])],
   footer="fibLoop pamięta tylko dwa ostatnie wyrazy — n kroków zamiast wykładniczego drzewa"),
 dict(id="algorithms-12", title="Algorytm Euklidesa: NWD przez reszty",
   panels=[
     ("a = 18, b = 12", row([18,12], cy=110, idx=False), ["rest = a % b", "= 18 % 12", "= 6"]),
     ("Przesunięcie pary", row([12,6], base=ORANGE, cy=110, idx=False), ["a = 12, b = 6", "rest = 12 % 6", "= 0"]),
     ("NWD w zmiennej a", row([6], base=TEAL, cy=110, idx=False), ["b = 0 → koniec", "NWD(18,12) = 6", "NWW = a * b / NWD"])],
   footer="while (b != 0): rest = a % b; a = b; b = rest — reszty maleją aż do zera"),
 dict(id="algorithms-13", title="Liczby pierwsze: dzielniki do pierwiastek z n, potem sito",
   panels=[
     ("Test: n = 29", row([2,3,4,5], cy=120), ["d = 2..5", "żadne nie dzieli", "6 * 6 = 36 > 29 stop"]),
     ("Sito Eratostenesa", row([2,3,5,7], cy=110), ["skreślamy", "wielokrotności", "od n·n co n"]),
     ("Pierwsze do 10", row([2,3,5,7], base=TEAL, cy=110), ["nieskreślone", "= pierwsze", "bez dzielenia"])],
   footer="isPrime sprawdza d * d <= n; sito skreśla wielokrotności i liczy nieskreślone"),
 dict(id="algorithms-14", title="Palindrom: dwa wskaźniki do środka",
   panels=[
     ("Wskaźniki i, j", wrap([("k  a  j  a  k", True), ("i ↑         ↑ j", False), ("k == k (zgodne)", False)], cy=120), ["brzegi zgodne"]),
     ("Do środka", wrap([("k  a  j  a  k", True), ("    ↑     ↑", False), ("a == a (zgodne)", False)], cy=120), ["i++ i j--"]),
     ("Wynik", wrap([("i < j kończy", True), ("pętlę", True), ("→ true", True)], cy=120), ["\"kot\": k≠t → false", "na pierwszej parze"])],
   footer="isPalindrome porównuje charAt(i) z charAt(j) — pierwsza różnica rozstrzyga"),
 dict(id="algorithms-15", title="Szyfr Cezara: litera to pozycja w alfabecie",
   panels=[
     ("Tekst jawny", row(['A','B','C'], cy=110, idx=False), ["c − 'A'", "pozycje 0, 1, 2", "char jest liczbą"]),
     ("Przesunięcie +3", wrap([("(pos + 3) % 26", True), ("A→D, B→E, C→F", False), ("Z zawija do A", False)], cy=120), ["modulo 26 pilnuje", "końca alfabetu"]),
     ("Szyfrogram", row(['D','E','F'], base=TEAL, cy=110, idx=False), ["caesar(\"ABC\",3)", "= \"DEF\"", "odszyfr: −shift"])],
   footer="caesar przesuwa litery o k; ROT13 to k=13 — dwa razy zastosowane przywraca tekst"),
 dict(id="algorithms-16", title="Systemy liczbowe: reszty od końca",
   panels=[
     ("Dzielenie 13 / 2", wrap([("13→6 reszta 1", False), ("6→3 reszta 0", False), ("3→1 reszta 1", False), ("1→0 reszta 1", False)], cy=100), ["4 reszty: 1,0,1,1"]),
     ("Od końca do przodu", row([1,1,0,1], base=ORANGE, cy=120), ["doklejamy PRZED:", "result = cyfra + result", "→ \"1101\""]),
     ("I z powrotem", row([13], base=TEAL, cy=110, idx=False), ["value×2 + cyfra", "1→3→6→13", "fromBinary = 13"])],
   footer="toBase: number % base → digits.charAt(reszta); fromBase: value = value·base + cyfra"),
 dict(id="algorithms-17", title="Wzorzec w tekście: okno o długości wzorca",
   panels=[
     ("Okno na pozycji", wrap([("a l a _ m a _ k o t a", False), ("            ↑ k o t", True), ("start = 7", False)], cy=120), ["znaki charAt(start+i)"]),
     ("Porównanie", wrap([("k==k, o==o, t==t", True), ("i == 3 = długość", False), ("→ return start", False)], cy=120), ["pełne dopasowanie"]),
     ("Wynik i zliczanie", row([7], base=TEAL, cy=110, idx=False), ["find = 7", "\"ana\" w \"banana\":", "2 nakładające trafy"])],
   footer="naiwne find: start ≤ length−pattern.length; różnica kończy porównanie okna"),
 dict(id="algorithms-18", title="Macierz int[][]: wiersz, potem kolumna",
   panels=[
     ("Dwie pętle", wrap([("{1, 2}", True), ("{3, 4}", True), ("m[0][1] = 2", False)], cy=110), ["m[r][c]: r wiersz", "c kolumna"]),
     ("Przekątna r == c", wrap([("1  .", True), (".  4", True), ("m[0][0] + m[1][1]", False)], cy=110), ["sum = 1 + 4"]),
     ("Wynik i transpozycja", row([5], base=TEAL, cy=110, idx=False), ["diagonalSum = 5", "t[c][r] = m[r][c]", "odwraca wymiary"])],
   footer="m.length to wiersze, m[0].length to kolumny; mnożenie: wiersz × kolumna w pętli k"),
 dict(id="algorithms-19", title="Stos: ostatni wchodzi, pierwszy wychodzi",
   panels=[
     ("push → wierzch", wrap([("push 2 → [2]", False), ("push 3 → [2,3]", True), ("top = 2", False)], cy=110), ["stack[top++] = v"]),
     ("ONP: \"2 3 +\"", wrap([("pop 3, pop 2", False), ("a=2, b=3", False), ("push a+b = 5", True)], cy=110), ["operator zdejmuje", "dwie wartości"]),
     ("Wynik", row([5], base=TEAL, cy=110, idx=False), ["stack[0] = 5", "\"4 2 -\" → a−b", "kolejność!"])],
   footer="evalRpn: liczby na stos, operator zdejmuje parę i odkłada wynik — poprawna ONP bez nawiasów"),
 dict(id="algorithms-20", title="Graf: sąsiedzi, visited i kolejka BFS",
   panels=[
     ("Lista sąsiedztwa", wrap([("0 → {1, 2}", True), ("1 → {0, 3}", False), ("2 → {0}, 3 → {1}", False)], cy=110), ["graph[v] = tablica", "połączonych numerów"]),
     ("BFS falą", row([0,1,2,3], base=ORANGE, cy=110, idx=False), ["kolejka: [0]", "odłóż sąsiadów 1,2", "potem ich sąsiad 3"]),
     ("Wszystkie osiągalne", row([4], base=TEAL, cy=110, idx=False), ["visited bez powtórek", "reachable = 4", "DFS: rekurencja"])],
   footer="BFS: kolejka przetwarza falowo od startu; DFS: rekurencja idzie do końca gałęzi"),
]

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for spec in SPECS:
        render(spec)
    print("DONE", len(SPECS))

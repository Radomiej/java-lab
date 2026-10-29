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
 dict(id="algorithms-01", title="Tablica: indeks wskazuje element",
   panels=[
     ("Dane: int[] scores = {4, 9, 2, 7}", row([4,9,2,7]), ["indeksy liczymy od zera", "length = 4 elementy"]),
     ("findMax: max = scores[0]", row([4,9,2,7], hi=(1,), cy=90), ["max = 4, przy i = 1:", "9 > 4 → max = 9", "2 i 7 są mniejsze"]),
     ("Wynik przeglądania", row([9], base=TEAL, cy=110, idx=False), ["max = 9 po pełnej pętli", "sum += values[i] → 22", "zliczanie: count++"])],
   footer="findMax, sum, countAbove — każde zadanie to jedno przejście pętlą po elementach tablicy"),
 dict(id="algorithms-03", title="Sortowanie przez wybór: minimum na początek",
   panels=[
     ("Nieposortowana część", row([4,2,7,3], hi=(1,)), ["minIndex zapamiętuje", "indeks najmniejszego:", "2 pod indeksem 1"]),
     ("Zamiana na granicy", row([2,4,7,3], hi=(0,), hic=TEAL), ["values[start] <-> values[minIndex]", "{2 | 4, 7, 3}", "2 stoi już na miejscu"]),
     ("Posortowane od lewej", row([2,3,4,7], base=TEAL), ["n - 1 kroków", "ostatni element", "zostaje na miejscu"])],
   footer="selectionSort wykonuje najwyżej n - 1 zamian — mniej niż bąbelkowe, ale O(n²) porównań"),
 dict(id="algorithms-04", title="Sortowanie przez wstawianie: klucz na właściwą pozycję",
   panels=[
     ("key = values[i]", row([5,1,8,2], hi=(1,)), ["key = 1", "lewa część {5}", "jest posortowana"]),
     ("Przesuwanie w prawo", row([5,5,8,2], hi=(0,1)), ["5 > 1 → przesuń w prawo", "zwalnia się pozycja", "na początku"]),
     ("key wstawiony", row([1,5,8,2], base=TEAL), ["values[j+1] = key", "{1, 5 | 8, 2}", "lewa część rośnie"])],
   footer="insertionSort przesuwa większe elementy zamiast zamieniać pary — dla prawie posortowanych danych zbliża się do O(n)"),
 dict(id="algorithms-05", title="Sortowanie przez scalanie: dziel i scalaj",
   panels=[
     ("Podział na połowy", wrap([("{5,1} | {4,2}", True), ("{5} {1} {4} {2}", False)], cy=110), ["dzielimy do tablic", "jednoelementowych"]),
     ("Scalanie dwoma indeksami", row([1,5], base=ORANGE, cy=110), ["{1,5} + {2,4}", "mniejszy z bieżących", "trafia do wyniku"]),
     ("Wynik posortowany", row([1,2,4,5], base=TEAL), ["merge(left, right)", "O(n log n)", "+ pomocnicza tablica"])],
   footer="mergeSort: copyOfRange dzieli tablicę, merge scala uporządkowane części"),
 dict(id="algorithms-06", title="Sortowanie szybkie: pivot dzieli tablicę",
   panels=[
     ("pivot = v[hi] = 5", row([4,7,2,9,5], hi=(4,)), ["ostatni element", "jest pivotem"]),
     ("Po partition", row([4,2,5,7,9], hi=(2,), hic=TEAL), ["mniejsze po lewej", "pivot na i + 1 = 2", "większe po prawej"]),
     ("Rekurencja obu części", row([2,4,5,7,9], base=TEAL), ["quickSort(lo, p - 1)", "quickSort(p+1, hi)", "pivot już na miejscu"])],
   footer="quickSort: partition ustawia pivot na docelowej pozycji, rekurencja sortuje obie części — średnio O(n log n)"),
 dict(id="algorithms-07", title="Sortowanie przez zliczanie: tablica liczników",
   panels=[
     ("Dane 0..9", row([4,1,3,1,2]), ["count[v]++", "licznik dla 1 wynosi 2", "pozostałe po 1"]),
     ("Tablica liczników", row([0,2,1,1,1], base=ORANGE, size=70, cy=130), ["count[0..4]", "= [0,2,1,1,1]", "jedno przejście"]),
     ("Zapis do tablicy", row([1,1,2,3,4], base=TEAL), ["v wpisywane count[v] razy", "{1, 1, 2, 3, 4}", "bez porównań"])],
   footer="countingSort działa w czasie O(n + zakres) — dla małego zakresu wartości jest szybsze niż O(n²)"),
 dict(id="algorithms-08", title="Shell i kopiec: odstępy oraz drzewo maksimum",
   panels=[
     ("Shell: gap = n/2", row([8,3,7,1,5], hi=(0,2)), ["porównujemy elementy", "odległe o gap", "potem gap /= 2"]),
     ("Kopiec w tablicy", row([9,6,4,1,2], hi=(0,)), ["v[0] = 9 = maksimum", "dzieci elementu i:", "2i+1 oraz 2i+2"]),
     ("Wynik", row([1,3,5,7,8], base=TEAL), ["siftDown naprawia", "kopiec po zamianie", "O(n log n)"])],
   footer="shellSort przyspiesza wstawianie dużymi krokami; heapSort sortuje w miejscu w czasie O(n log n)"),
 dict(id="algorithms-09", title="Wyszukiwanie binarne: odrzucamy połowę przedziału",
   panels=[
     ("mid = (low+high)/2", row([2,4,6,8,10], hi=(2,)), ["sorted[2] = 6", "szukane = 8", "6 < 8"]),
     ("Lewa połowa odrzucona", row([8,10], cy=130, idx=False), ["low = mid + 1", "szukamy w {8, 10}", "−1 gdy przedział pusty"]),
     ("Znaleziony indeks", row([8], base=TEAL, cy=110, idx=False), ["indeks 3", "O(log n) kroków", "zamiast n porównań"])],
   footer="findIndex wymaga posortowanej tablicy — w nieposortowanej odrzucenie połowy mogłoby pominąć szukany element"),
 dict(id="algorithms-10", title="Rekurencja: warunek stopu i krok rekurencyjny",
   panels=[
     ("Stos wywołań", row([4,3,2,1], cy=110, idx=False), ["factorial(4) czeka", "na factorial(3)...", "aż do factorial(1)"]),
     ("Warunek stopu", wrap([("n <= 1 → return 1", True), ("bez kolejnego wywołania", False), ("koniec zejścia", False)], cy=120), ["1 kończy rekurencję"]),
     ("Powrót wyników", row([2,6,24], base=TEAL, cy=130, idx=False), ["mnożenie przy powrocie:", "1→2→6→24", "factorial(4) = 24"])],
   footer="factorial(n) = n × factorial(n−1); szybkie potęgowanie: half = power(base, exp/2), wynik half×half"),
 dict(id="algorithms-11", title="Ciąg Fibonacciego: rekurencja a iteracja",
   panels=[
     ("Definicja", row([0,1,1,2,3,5,8], size=58, cy=140), ["fib(0)=0, fib(1)=1", "każdy kolejny wyraz:", "suma dwóch poprzednich"]),
     ("Rekurencja powtarza obliczenia", wrap([("fib(5) → fib(4)+fib(3)", True), ("fib(3) liczone 2×", False), ("koszt wykładniczy", False)], cy=120), ["drzewo wywołań rośnie", "wykładniczo"]),
     ("Iteracja: zmienne a, b", row([13], base=TEAL, cy=110, idx=False), ["next = a + b", "a = b, b = next", "fib(7) = 13 w 7 krokach"])],
   footer="fibLoop pamięta tylko dwa ostatnie wyrazy — wykonuje n kroków zamiast wykładniczego drzewa wywołań"),
 dict(id="algorithms-12", title="Algorytm Euklidesa: NWD z reszt z dzielenia",
   panels=[
     ("a = 18, b = 12", row([18,12], cy=110, idx=False), ["rest = a % b", "= 18 % 12", "= 6"]),
     ("Przesunięcie pary", row([12,6], base=ORANGE, cy=110, idx=False), ["a = 12, b = 6", "rest = 12 % 6", "= 0"]),
     ("NWD w zmiennej a", row([6], base=TEAL, cy=110, idx=False), ["b = 0 → koniec", "NWD(18,12) = 6", "NWW = a * b / NWD"])],
   footer="while (b != 0): rest = a % b; a = b; b = rest — kolejne reszty maleją aż do zera"),
 dict(id="algorithms-13", title="Liczby pierwsze: dzielniki do pierwiastka z n oraz sito",
   panels=[
     ("Test: n = 29", row([2,3,4,5], cy=120), ["d = 2..5", "żadne nie dzieli 29", "6 * 6 = 36 > 29 → stop"]),
     ("Sito Eratostenesa", row([2,3,5,7], cy=110), ["skreślamy", "wielokrotności", "od n·n co n"]),
     ("Pierwsze do 10", row([2,3,5,7], base=TEAL, cy=110), ["nieskreślone", "= liczby pierwsze", "bez dzielenia"])],
   footer="isPrime sprawdza dzielniki d * d <= n; sito Eratostenesa wykreśla wielokrotności każdej liczby pierwszej"),
 dict(id="algorithms-14", title="Palindrom: dwa indeksy zbieżne do środka",
   panels=[
     ("Indeksy i, j", wrap([("k  a  j  a  k", True), ("i ↑         ↑ j", False), ("k == k (zgodne)", False)], cy=120), ["znaki na brzegach równe"]),
     ("Krok do środka", wrap([("k  a  j  a  k", True), ("    ↑     ↑", False), ("a == a (zgodne)", False)], cy=120), ["i++ oraz j--"]),
     ("Wynik", wrap([("i >= j kończy", True), ("pętlę", True), ("→ true", True)], cy=120), ["\"kot\": k≠t → false", "już przy pierwszej parze"])],
   footer="isPalindrome porównuje charAt(i) z charAt(j) — pierwsza różnica kończy sprawdzanie wynikiem false"),
 dict(id="algorithms-15", title="Szyfr Cezara: przesunięcie pozycji w alfabecie",
   panels=[
     ("Tekst jawny", row(['A','B','C'], cy=110, idx=False), ["c − 'A'", "pozycje 0, 1, 2", "char przechowuje kod znaku"]),
     ("Przesunięcie +3", wrap([("(pos + 3) % 26", True), ("A→D, B→E, C→F", False), ("Z przechodzi w A", False)], cy=120), ["modulo 26 zawija", "koniec alfabetu"]),
     ("Szyfrogram", row(['D','E','F'], base=TEAL, cy=110, idx=False), ["caesar(\"ABC\",3)", "= \"DEF\"", "deszyfrowanie: −shift"])],
   footer="caesar przesuwa litery o k pozycji; ROT13 używa stałego przesunięcia 13 — dwukrotne wywołanie zwraca oryginał"),
 dict(id="algorithms-16", title="Systemy liczbowe: reszty z dzielenia od końca",
   panels=[
     ("Dzielenie 13 / 2", wrap([("13 : 2 = 6, reszta 1", False), ("6 : 2 = 3, reszta 0", False), ("3 : 2 = 1, reszta 1", False), ("1 : 2 = 0, reszta 1", False)], cy=100), ["kolejne reszty: 1, 0, 1, 1"]),
     ("Zapis od końca", row([1,1,0,1], base=ORANGE, cy=120), ["dopisujemy Z PRZODU:", "result = cyfra + result", "→ \"1101\""]),
     ("Powrót do dziesiętnego", row([13], base=TEAL, cy=110, idx=False), ["value * 2 + cyfra", "1→3→6→13", "fromBinary = 13"])],
   footer="toBase: reszta number % base wybiera cyfrę; fromBase: value = value * base + cyfra (schemat Hornera)"),
 dict(id="algorithms-17", title="Wzorzec w tekście: przesuwane okno porównań",
   panels=[
     ("Okno na pozycji start", wrap([("a l a _ m a _ k o t a", False), ("            ↑ k o t", True), ("start = 7", False)], cy=120), ["porównujemy charAt(start+i)"]),
     ("Zgodność znaków", wrap([("k==k, o==o, t==t", True), ("i == 3 == długość", False), ("→ return start", False)], cy=120), ["pełne dopasowanie"]),
     ("Wynik i zliczanie", row([7], base=TEAL, cy=110, idx=False), ["find = 7", "\"ana\" w \"banana\":", "2 nakładające się wystąpienia"])],
   footer="naiwne wyszukiwanie: start <= text.length() - pattern.length(); niezgodność przerywa wewnętrzną pętlę"),
 dict(id="algorithms-18", title="Macierz int[][]: indeks wiersza i kolumny",
   panels=[
     ("Dwie pętle", wrap([("{1, 2}", True), ("{3, 4}", True), ("m[0][1] = 2", False)], cy=110), ["m[r][c]: r — wiersz", "c — kolumna"]),
     ("Przekątna główna r == c", wrap([("1  .", True), (".  4", True), ("m[0][0] + m[1][1]", False)], cy=110), ["sum = 1 + 4"]),
     ("Wynik i transpozycja", row([5], base=TEAL, cy=110, idx=False), ["diagonalSum = 5", "t[c][r] = m[r][c]", "zamienia wiersze z kolumnami"])],
   footer="m.length to liczba wierszy, m[0].length to liczba kolumn; mnożenie macierzy sumuje iloczyny wiersza i kolumny"),
 dict(id="algorithms-19", title="Stos (LIFO): ostatni wchodzi, pierwszy wychodzi",
   panels=[
     ("push — na wierzch", wrap([("push 2 → [2]", False), ("push 3 → [2,3]", True), ("top = 2", False)], cy=110), ["stack[top++] = v"]),
     ("ONP: \"2 3 +\"", wrap([("pop 3, pop 2", False), ("a=2, b=3", False), ("push a+b = 5", True)], cy=110), ["operator zdejmuje", "dwa argumenty ze stosu"]),
     ("Wynik", row([5], base=TEAL, cy=110, idx=False), ["stack[0] = 5", "\"4 2 -\" → a − b", "ważna kolejność argumentów"])],
   footer="evalRpn: liczby wkładamy na stos, operator zdejmuje dwa argumenty i wkłada wynik — zapis bez nawiasów"),
 dict(id="algorithms-20", title="Graf: lista sąsiedztwa, tablica visited i kolejka BFS",
   panels=[
     ("Lista sąsiedztwa", wrap([("0 → {1, 2}", True), ("1 → {0, 3}", False), ("2 → {0}, 3 → {1}", False)], cy=110), ["graph[v] = tablica", "sąsiadów wierzchołka v"]),
     ("BFS: warstwa po warstwie", row([0,1,2,3], base=ORANGE, cy=110, idx=False), ["kolejka: [0]", "dopisz sąsiadów 1, 2", "potem sąsiada 3"]),
     ("Osiągalne wierzchołki", row([4], base=TEAL, cy=110, idx=False), ["visited zapobiega powtórkom", "reachable = 4", "DFS: rekurencja w głąb"])],
   footer="BFS używa kolejki i odwiedza wierzchołki warstwami; DFS schodzi rekurencyjnie w głąb ścieżki"),
]

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for spec in SPECS:
        render(spec)
    print("DONE", len(SPECS))

# Java Lab — sesje na żywo i lab-admin

Status: projekt zatwierdzony przez użytkownika. Doprecyzowanie: brak połączenia nigdy nie blokuje ani nie psuje działania Java Lab.

## Cel i zakres

Nauczyciel widzi aktywne instalacje Java Lab oraz bieżącą lekcję, zadanie, pliki kodu i wynik ostatniego uruchomienia. Uczniowie nie zakładają kont. Umami jest poza zakresem tej iteracji.

## Architektura

Rekomendacja: Java Lab na Vercel publikuje zdarzenia przez własny endpoint HTTPS do istniejącego RabbitMQ. Osobny projekt C:/Nauka/lab-admin zawiera stale działający backend Node.js, odbiornik AMQP, SQLite i panel React. Panel aktualizuje dane przez SSE, z ponownym połączeniem i pobraniem pełnego stanu po przerwie. Backend i panel mogą działać lokalnie; docelowe miejsce stałego procesu to VPS Mikrusa, poza zarządzanym kontenerem RabbitMQ. Dostęp i możliwość uruchomienia procesu na VPS trzeba sprawdzić przed wdrożeniem.

Alternatywy: cały system na VPS upraszcza komunikację, ale wymaga publicznego endpointu z CORS; cały system na Vercel wymaga dodatkowego trwałego magazynu i rozwiązania do konsumpcji kolejki. Rekomendacja zachowuje istniejące wdrożenie Java Lab i wykorzystuje posiadany broker.

## Identyfikacja i wysyłka

- Losowy UUID zapisany w localStorage oznacza instalację przeglądarki, nie fizyczny komputer. Wyświetlany zamiast „Ucz się przez budowanie”.
- Każde otwarcie karty ma osobny sessionId, licznik sekwencji i eventId; równoległe karty nie nadpisują sobie pracy.
- Start sesji, zmiana lekcji/zadania, zmiana plików po 2 sekundach i maksymalnie co 5 sekund przy ciągłym pisaniu, wynik uruchomienia i heartbeat co 15 sekund.
- Snapshot zawiera tylko pliki bieżącego zadania/projektu, identyfikatory lekcji i zadania, aktywny plik, wynik i ograniczony rozmiar konsoli. Bez klawiszy, schowka, innych stron i plików komputera.
- Widoczna informacja o udostępnianiu pracy nauczycielowi oraz statusie połączenia. Awaria telemetrii nie blokuje nauki.
- Każde wywołanie sieci ma timeout, błędy są przechwytywane poza stanem kompilatora i edytora. Bez oczekiwania na telemetrię w obsłudze edycji, uruchomienia i sprawdzania. Bufor w pamięci ma limit 20 zdarzeń; przy przepełnieniu zachowuje najnowszy pełny snapshot. Ponowienia z backoff 2–30 sekund, bez nieskończonego wzrostu pamięci i bez zapisu kodu do dodatkowego trwałego bufora. Po odzyskaniu sieci wysyłany jest bieżący pełny snapshot. Odmowa localStorage oznacza ID tymczasowe, nie błąd aplikacji.
- Sesja aktywna: heartbeat otrzymany w ostatnich 45 sekundach. Panel wyświetla też osobno czas ostatniej zmiany kodu i oznacza widoczną/ukrytą kartę.

## Endpoint odbiorczy na Vercel

POST /api/telemetry/session wydaje krótko ważny podpisany token sesji. POST /api/telemetry/events sprawdza token, schemat, rozmiar do 256 KiB i dozwolone originy. Podpis identyfikuje uprawnioną sesję przeglądarki, nie potwierdza tożsamości ucznia. Ochrona przed nadużyciami wymaga również limitów na brzegu Vercel; limit w pamięci pojedynczej funkcji nie jest globalny.

Publikowanie przez HTTPS RabbitMQ Management API, vhost /, exchange domyślny, routing key java-lab.activity. Wiadomości persistent, odpowiedź przyjęcia dopiero po routed=true. Timeout i błędy brokera zwracają błąd umożliwiający ponowienie. Hasła oraz klucz podpisujący tylko w zmiennych środowiskowych serwera. Brak sekretów VITE_*.

## Odbiornik i trwałość

AMQP consumer z manual acknowledgement po transakcji SQLite. EventId deduplikuje ponowienia, sequence zapobiega cofaniu aktualnego snapshotu. Odbiornik ponawia połączenie z backoff. Nieprawidłowe wiadomości trafiają do ograniczonej kwarantanny, bez nieskończonej pętli ponowień. Istniejący test integration_test nie jest sesją ucznia.

SQLite przechowuje sesje, ostatni snapshot i historię zdarzeń przez 7 dni; automatyczne czyszczenie oraz limit historii 500 MiB. RabbitMQ ma już kolejkę classic durable z limitem 50 MiB. Po przekroczeniu limitu kolejka może odrzucić stare wiadomości; broker nie zastępuje archiwum. Po przerwie klient wysyła pełny aktualny snapshot, aby przywrócić bieżący podgląd.

## Panel lab-admin

Logowanie nauczyciela osobnym hasłem, hash po stronie serwera, cookie HttpOnly, SameSite i Secure przy HTTPS. Wszystkie endpointy sesji i SSE wymagają uwierzytelnienia. Bez publicznego odczytu kodu.

Lista aktywnych i ostatnich sesji: ID instalacji, sesja/karta, lekcja, zadanie, ostatni kontakt i wynik. Szczegóły: wybór pliku, kod jako tekst, konsola i chronologiczne zdarzenia. Aktualizacja bez przeładowania; jawny status rozłączenia. Panel nie wykonuje kodu uczniów.

## Kolejność wykonania i weryfikacja

1. Kontrakt zdarzeń, walidacja i endpoint Vercel; testy odrzucania błędnych danych, tokenów, błędów publikacji i braku routingu.
2. ID instalacji i synchronizacja w Java Lab; testy stabilności ID, rozdzielenia kart, debounce, heartbeat i ponowień.
3. Projekt lab-admin: odbiornik, SQLite i chronione API; testy deduplikacji, kolejności, restartu, nieaktywnych sesji i dostępu bez logowania.
4. Panel i SSE; test dwóch sesji, zmiany kodu, wyniku uruchomienia, reconnect i awarii brokera.
5. Build obu aplikacji, lokalny test całego przepływu, potem konfiguracja wdrożenia i test z rzeczywistym RabbitMQ.

Wdrożenie i działanie produkcyjne nie są potwierdzone, dopóki nie przejdzie rzeczywisty przepływ Java Lab → backend → RabbitMQ → lab-admin. Nie commitować istniejących zmian użytkownika ani sekretów.

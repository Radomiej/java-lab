const readableCriteria={
 'g2d.scene.guided':[
 'Istnieje jeden aktywny obiekt Player z własnym Transform i komponentem ShapeRenderer.',
 'Player znajduje się w pozycji (80, 90). Prostokąt ma szerokość 40 px, wysokość 30 px i kolor #76b9f2.',
 'Na mapie prostokąt sięga w poziomie od x = 60 do x = 100, a w pionie od y = 75 do y = 105. To jego krawędzie; środek obiektu nadal jest w (80, 90).',
 'Po 20 aktualizacjach nadal istnieje jeden Player, a jego pozycja nie zmienia się.'
 ],
 'g2d.scene.modified':[
 'PlatformA i PlatformB są osobnymi obiektami, każdy z własnym Transform i ShapeRenderer.',
 'PlatformA ma pozycję (120, 180), szerokość 100 px i wysokość 20 px.',
 'Po przesunięciu PlatformB ma pozycję (340, 120), szerokość 80 px i wysokość 20 px.',
 'Zmiana koloru lub pozycji PlatformB nie zmienia PlatformA.'
 ],
 'g2d.scene.independent':[
 'Scena zawiera dokładnie trzy obiekty: Player z teksturą player, Enemy z teksturą slime i Coin z teksturą coin.',
 'Player ma pozycję (100, 100), szerokość 32 px i wysokość 32 px.',
 'Enemy ma pozycję (280, 100), szerokość 32 px i wysokość 32 px.',
 'Coin ma pozycję (180, 180), szerokość 16 px i wysokość 16 px.',
 'Przesunięcie Coin do (200, 180) nie przesuwa Player ani Enemy.',
 'Bez dodanego zachowania obiekty nie zmieniają pozycji po upływie sekundy.'
 ]
};
const replacements=new Map([
 ['Na granicach świata środek koła pozostaje w x=12..628,y=12..348.','Środek koła na mapie może przesuwać się w poziomie od x = 12 do x = 628, a w pionie od y = 12 do y = 348. Dzięki marginesowi 12 px koło nie wychodzi poza granice świata.'],
 ['Wizualny offset na każdej osi mieści się w -8..8 i nie jest stale zerowy w środku efektu.','Podczas wstrząsu sama grafika przesuwa się na każdej osi o wartość od −8 do 8 px względem swojej zwykłej pozycji. W trakcie efektu widać drganie, nie tylko nieruchomy obraz.'],
 ['Obraz prostokąta obejmuje x=60..100 i y=75..105; pozycja obiektu pozostaje (80,90).','Na mapie prostokąt sięga w poziomie od x = 60 do x = 100, a w pionie od y = 75 do y = 105. To jego krawędzie; środek obiektu nadal jest w (80, 90).'],
 ['Ścieżka zajmuje x=120..520,y=164..196 i nie tworzy przeszkody bez collidera.','Ścieżka ma środek w (320, 180), szerokość 400 px i wysokość 32 px. Bez collidera nie blokuje ruchu.'],
 ['Prostokąt ma granice x=60..100,y=75..105, a tekst środek (80,140).','Prostokąt ma pozycję (80, 90), szerokość 40 px i wysokość 30 px. Tekst jest wyśrodkowany w (80, 140).'],
 ['Prostokąt środka (80,90),40×30 ma granice x=60..100,y=75..105.','Prostokąt ma środek w (80, 90), szerokość 40 px i wysokość 30 px.'],
 ['Wartości current<0 i current>max są wizualnie ograniczone do 0..200; max=0 nie daje NaN.','Pasek o szerokości 200 px pokazuje od 0% do 100%: ujemna wartość daje pusty pasek, a wartość ponad maksimum daje pełny pasek. Maksimum równe 0 nie powoduje błędu.']
]);
export function studentGameCriteria(task){return readableCriteria[task.id]||task.criteria.map(text=>replacements.get(text)||text);}

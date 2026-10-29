// Executed against the student's classes, never inferred from their console text.
const check=(id,label,expression)=>({id,label,expression});
const contract=(setup,...checks)=>({setup,checks});
const namedChild=(type,level=false)=>contract(
  `${type} first=new ${type}("Ala"${level?',2':''}); ${type} second=new ${type}("Olek"${level?',7':''}); Character base=first;`,
  check('base-type',`${type} jest Character`,'base instanceof '+type),
  check('constructor','Konstruktor przekazuje imię do klasy bazowej','"Ala".equals(base.name)'),
  check('instances','Instancje mają niezależne imiona','"Olek".equals(second.name) && first!=second'));
const override=(type,result,baseResult='Character')=>contract(`Character base=new Character(); Character hero=new ${type}();`,
  check('base-method','Metoda klasy bazowej','"'+baseResult+'".equals(base.describe())'),
  check('override',`${type}: wywołanie przez Character`,'"'+result+'".equals(hero.describe())'),
  check('different-types','Osobny obiekt klasy potomnej','hero instanceof '+type+' && !(base instanceof '+type+') && hero!=base'));
const polymorphism=(a,b,method,one,two)=>contract(`Character[] team={new ${a}(),new ${b}()};`,
  check('first-dispatch',`${a}: polimorficzne ${method}()`,'"'+one+'".equals(team[0].'+method+'())'),
  check('second-dispatch',`${b}: polimorficzne ${method}()`,'"'+two+'".equals(team[1].'+method+'())'),
  check('separate-types','Dwa różne typy w tablicy bazowej','team[0] instanceof '+a+' && team[1] instanceof '+b+' && team[0]!=team[1]'));

const contracts={
  'fundamentals-04':[
    contract('',check('positive','Podwaja inną wartość','Main.calculateReward(7)==14'),check('zero','Obsługuje zero','Main.calculateReward(0)==0'),check('negative','Korzysta z argumentu, nie stałej','Main.calculateReward(-3)==-6')),
    contract('',check('sum','Dodaje oba argumenty','Main.addBonus(7,4)==11'),check('zero','Obsługuje zerową premię','Main.addBonus(9,0)==9'),check('negative','Obsługuje ujemny argument','Main.addBonus(5,-2)==3')),
    contract('',check('below','Przed progiem: false','!Main.canLevelUp(99)'),check('boundary','Na progu: true','Main.canLevelUp(100)'),check('above','Powyżej progu: true','Main.canLevelUp(150)')),
  ],
  'algorithms-01':[
    contract('',check('max','Zwraca maksimum','Main.findMax(new int[]{4,9,2,7})==9'),check('first','Maksimum na początku','Main.findMax(new int[]{9,1,2})==9'),check('negative','Działa dla samych ujemnych','Main.findMax(new int[]{-5,-2,-9})==-2')),
    contract('',check('sum','Suma elementów','Main.sum(new int[]{4,5,6})==15'),check('empty-sum','Inna tablica','Main.sum(new int[]{1,2,3,4})==10'),check('negative-sum','Ujemne elementy','Main.sum(new int[]{-1,5})==4')),
    contract('',check('above','Zlicza powyżej limitu','Main.countAbove(new int[]{3,8,2,9},5)==2'),check('none','Żaden nie przekracza','Main.countAbove(new int[]{1,2},5)==0'),check('boundary','Równy limit się nie liczy','Main.countAbove(new int[]{5,6},5)==1')),
  ],
  'algorithms-02':[
    contract('int[] first={5,2,9,1};Main.bubbleSort(first);int[] second={3,1,2};Main.bubbleSort(second);',
      check('sorted-first','Tablica posortowana rosnąco','first[0]==1 && first[1]==2 && first[2]==5 && first[3]==9'),
      check('sorted-second','Działa też dla innej tablicy','second[0]==1 && second[1]==2 && second[2]==3'),
      check('in-place','Sortuje przekazaną tablicę','first[0]==1 && first[3]==9')),
    contract('int[] already={1,2,3};Main.bubbleSortEarly(already);int[] mixed={4,1,3,2};Main.bubbleSortEarly(mixed);',
      check('kept-sorted','Posortowana zostaje posortowana','already[0]==1 && already[2]==3'),
      check('sorts-mixed','Nieposortowana też działa','mixed[0]==1 && mixed[1]==2 && mixed[2]==3 && mixed[3]==4')),
    contract('int[] first={9,1,5,2};Main.sortDescending(first);int[] second={1,3,2};Main.sortDescending(second);',
      check('desc-first','Posortowana malejąco','first[0]==9 && first[1]==5 && first[2]==2 && first[3]==1'),
      check('desc-second','Inna tablica malejąco','second[0]==3 && second[1]==2 && second[2]==1')),
  ],
  'algorithms-03':[
    contract('int[] first={4,2,7,3};Main.selectionSort(first);int[] second={5,1};Main.selectionSort(second);',
      check('sorted-first','Posortowana przez wybór','first[0]==2 && first[1]==3 && first[2]==4 && first[3]==7'),
      check('sorted-second','Dwa elementy też','second[0]==1 && second[1]==5')),
    contract('',check('from-two','Minimum od indeksu 2','Main.minIndex(new int[]{4,2,7,3},2)==3'),check('from-zero','Minimum całej tablicy','Main.minIndex(new int[]{4,2,7,3},0)==1'),check('from-last','Zakres od ostatniego','Main.minIndex(new int[]{4,2,7,3},3)==3')),
    contract('int[] first={4,2,7,3};Main.selectionDescending(first);',
      check('desc','Posortowana malejąco','first[0]==7 && first[1]==4 && first[2]==3 && first[3]==2')),
  ],
  'algorithms-04':[
    contract('int[] first={5,1,8,2};Main.insertionSort(first);int[] second={6,4,3};Main.insertionSort(second);',
      check('sorted-first','Posortowana wstawianiem','first[0]==1 && first[1]==2 && first[2]==5 && first[3]==8'),
      check('reverse-case','Odwrotna kolejność też','second[0]==3 && second[1]==4 && second[2]==6')),
    contract('int[] first={7,3,9,1};Main.insertionSort(first);',
      check('sorted','Inna tablica posortowana','first[0]==1 && first[1]==3 && first[2]==7 && first[3]==9')),
    contract('int[] first={5,1,8,2};Main.insertionDescending(first);',
      check('desc','Posortowana malejąco','first[0]==8 && first[1]==5 && first[2]==2 && first[3]==1')),
  ],
  'algorithms-05':[
    contract('',check('merge','Scalona tablica','Main.merge(new int[]{1,4},new int[]{2,3,5}).length==5 && Main.merge(new int[]{1,4},new int[]{2,3,5})[2]==3'),
      check('merge-order','Kolejność rosnąca','Main.merge(new int[]{1,3},new int[]{2,4})[1]==2 && Main.merge(new int[]{1,3},new int[]{2,4})[3]==4'),
      check('merge-empty','Pusta połowa','Main.merge(new int[]{},new int[]{7})[0]==7')),
    contract('int[] first={5,1,4,2};Main.mergeSort(first);int[] second={3};Main.mergeSort(second);',
      check('sorted','Posortowana przez scalanie','first[0]==1 && first[1]==2 && first[2]==4 && first[3]==5'),
      check('single','Jednoelementowa bez zmian','second[0]==3')),
    contract('',check('desc','Scalona malejąco','Main.mergeDesc(new int[]{5,3},new int[]{4,2,1})[0]==5 && Main.mergeDesc(new int[]{5,3},new int[]{4,2,1})[4]==1')),
  ],
  'algorithms-06':[
    contract('int[] first={4,7,2,9,5};int p=Main.partition(first,0,4);',
      check('pivot-index','Pivot na właściwym miejscu','p==2 && first[2]==5'),
      check('left-right','Mniejsze na lewo, większe na prawo','first[0]<5 && first[1]<5 && first[3]>5 && first[4]>5')),
    contract('int[] first={4,7,2,9,5};Main.quickSort(first,0,4);int[] second={6,1,3};Main.quickSort(second,0,2);',
      check('sorted','Posortowana szybko','first[0]==2 && first[1]==4 && first[2]==5 && first[3]==7 && first[4]==9'),
      check('sorted-two','Krótsza też','second[0]==1 && second[1]==3 && second[2]==6')),
    contract('int[] first={4,7,2,9,5};Main.quickDescending(first,0,4);',
      check('desc','Posortowana malejąco','first[0]==9 && first[1]==7 && first[2]==5 && first[3]==4 && first[4]==2')),
  ],
  'algorithms-07':[
    contract('int[] first={4,1,3,1,2};Main.countingSort(first);',
      check('sorted','Posortowana przez zliczanie','first[0]==1 && first[1]==1 && first[2]==2 && first[3]==3 && first[4]==4')),
    contract('int[] first={3,0,3,2};Main.countingSort(first);',
      check('sorted-zero','Zero też się sortuje','first[0]==0 && first[1]==2 && first[2]==3 && first[3]==3')),
    contract('',check('count','Zlicza wystąpienia','Main.countOccurrences(new int[]{4,1,3,1},1)==2'),check('none','Brak wystąpień','Main.countOccurrences(new int[]{4,1,3,1},7)==0')),
  ],
  'algorithms-08':[
    contract('int[] first={8,3,7,1,5};Main.shellSort(first);int[] second={6,2,4};Main.shellSort(second);',
      check('sorted','Posortowana Shell-em','first[0]==1 && first[1]==3 && first[2]==5 && first[3]==7 && first[4]==8'),
      check('sorted-two','Krótsza też','second[0]==2 && second[1]==4 && second[2]==6')),
    contract('int[] first={4,1,9,2,6};Main.heapSort(first);',
      check('sorted','Posortowana kopcowaniem','first[0]==1 && first[1]==2 && first[2]==4 && first[3]==6 && first[4]==9')),
    contract('int[] first={5,2,8,1};Main.gnomeSort(first);',
      check('sorted','Posortowana gnome','first[0]==1 && first[1]==2 && first[2]==5 && first[3]==8')),
  ],
  'algorithms-09':[
    contract('',check('found','Znajduje element','Main.findIndex(new int[]{2,4,6,8,10},8)==3'),check('missing','Brak elementu zwraca -1','Main.findIndex(new int[]{2,4,6,8,10},5)==-1'),check('edge','Pierwszy element','Main.findIndex(new int[]{2,4,6,8,10},2)==0')),
    contract('',check('first','Pierwsze wystąpienie','Main.firstIndex(new int[]{1,2,2,2,3},2)==1'),check('first-edge','Pierwsze na starcie','Main.firstIndex(new int[]{2,2,3},2)==0'),check('first-miss','Brak to -1','Main.firstIndex(new int[]{1,2,3},9)==-1')),
    contract('',check('last','Ostatnie wystąpienie','Main.lastIndex(new int[]{1,2,2,2,3},2)==3'),check('last-edge','Ostatnie na końcu','Main.lastIndex(new int[]{1,2,2},2)==2'),check('last-miss','Brak to -1','Main.lastIndex(new int[]{1,2,3},9)==-1')),
  ],
  'algorithms-10':[
    contract('',check('base','factorial(1) to 1','Main.factorial(1)==1'),check('zero','factorial(0) to 1','Main.factorial(0)==1'),check('six','Silnia 6','Main.factorial(6)==720')),
    contract('',check('ten','2 do 10','Main.power(2,10)==1024'),check('zero','Wykładnik 0','Main.power(7,0)==1'),check('odd','Nieparzysty wykładnik','Main.power(3,3)==27')),
    contract('',check('sum','Suma cyfr','Main.digitSum(1234)==10'),check('single','Jednocyfrowa','Main.digitSum(7)==7'),check('zeros','Zera w środku','Main.digitSum(1002)==3')),
  ],
  'algorithms-11':[
    contract('',check('base','Warunek stopu fib(0) i fib(1)','Main.fib(0)==0 && Main.fib(1)==1'),check('small','Mały wyraz','Main.fib(5)==5'),check('larger','Dziesiąty wyraz','Main.fib(10)==55')),
    contract('',check('ten','fibLoop(10)','Main.fibLoop(10)==55'),check('base','fibLoop(0) i fibLoop(1)','Main.fibLoop(0)==0 && Main.fibLoop(1)==1'),check('seven','fibLoop(7)','Main.fibLoop(7)==13')),
    contract('',check('sum6','Suma do fib(6)','Main.sumFib(6)==20'),check('sum0','Suma fib(0)','Main.sumFib(0)==0'),check('sum3','Suma do fib(3)','Main.sumFib(3)==4')),
  ],
  'algorithms-12':[
    contract('',check('gcd','NWD 18 i 12','Main.gcd(18,12)==6'),check('equal','Równe liczby','Main.gcd(5,5)==5'),check('coprime','Względnie pierwsze','Main.gcd(8,15)==1')),
    contract('',check('lcm','NWW 6 i 8','Main.lcm(6,8)==24'),check('multiple','Jedna dzieli drugą','Main.lcm(3,9)==9'),check('coprime-lcm','Względnie pierwsze dają iloczyn','Main.lcm(8,15)==120')),
    contract('',check('yes','8 i 15 względnie pierwsze','Main.areCoprime(8,15)'),check('no','8 i 12 nie są','!Main.areCoprime(8,12)')),
  ],
  'algorithms-13':[
    contract('',check('prime','29 jest pierwsza','Main.isPrime(29)'),check('composite','30 nie jest','!Main.isPrime(30)'),check('edge','0, 1, 2','!Main.isPrime(1) && !Main.isPrime(0) && Main.isPrime(2)')),
    contract('',check('ten','Pierwszych do 30 jest 10','Main.countPrimes(30)==10'),check('small','Do 10 jest 4','Main.countPrimes(10)==4'),check('edge','Do 2 jest 1','Main.countPrimes(2)==1')),
    contract('',check('sixth','Szósta pierwsza to 13','Main.nthPrime(6)==13'),check('first','Pierwsza to 2','Main.nthPrime(1)==2'),check('tenth','Dziesiąta to 29','Main.nthPrime(10)==29')),
  ],
  'algorithms-14':[
    contract('',check('yes','kajak to palindrom','Main.isPalindrome("kajak")'),check('no','kot nie jest','!Main.isPalindrome("kot")'),check('even','Parzysta długość','Main.isPalindrome("anna")')),
    contract('',check('reverse','Java od tyłu','"avaJ".equals(Main.reverse("Java"))'),check('empty','Pusty tekst','"".equals(Main.reverse(""))'),check('same','Palindrom bez zmian','"kajak".equals(Main.reverse("kajak"))')),
    contract('',check('yes','tok i kot to anagramy','Main.areAnagrams("tok","kot")'),check('no','kot i pies nie są','!Main.areAnagrams("kot","pies")'),check('length','Różne długości','!Main.areAnagrams("kot","kota")')),
  ],
  'algorithms-15':[
    contract('',check('cipher','ABC + 3 to DEF','"DEF".equals(Main.caesar("ABC",3))'),check('wrap','Zawija alfabet','"ABC".equals(Main.caesar("XYZ",3))'),check('keep','Znaki poza zakresem bez zmian','"D1".equals(Main.caesar("A1",3))')),
    contract('',check('dec','DEF - 3 to ABC','"ABC".equals(Main.caesarDec("DEF",3))'),check('dec-wrap','Zawija w tył','"XYZ".equals(Main.caesarDec("ABC",3))')),
    contract('',check('rot','HELLO to URYYB','"URYYB".equals(Main.rot13("HELLO"))'),check('double','Podwójne ROT13 to tekst','"HELLO".equals(Main.rot13("URYYB"))')),
  ],
  'algorithms-16':[
    contract('',check('bin','13 to 1101','"1101".equals(Main.toBinary(13))'),check('one','1 to 1','"1".equals(Main.toBinary(1))'),check('eight','8 to 1000','"1000".equals(Main.toBinary(8))')),
    contract('',check('hex','255 to FF','"FF".equals(Main.toHex(255))'),check('hex-small','16 to 10','"10".equals(Main.toHex(16))'),check('hex-mid','26 to 1A','"1A".equals(Main.toHex(26))')),
    contract('',check('from','1101 to 13','Main.fromBinary("1101")==13'),check('one','1 to 1','Main.fromBinary("1")==1'),check('zero','0 to 0','Main.fromBinary("0")==0')),
  ],
  'algorithms-17':[
    contract('',check('found','kot na pozycji 7','Main.find("ala ma kota","kot")==7'),check('missing','Brak wzorca to -1','Main.find("ala ma kota","pies")==-1'),check('start','Wzorzec na początku','Main.find("ala ma kota","ala")==0')),
    contract('',check('overlap','ana w banana to 2','Main.countMatches("banana","ana")==2'),check('none','Brak to 0','Main.countMatches("banana","kot")==0'),check('adjacent','aa w aaaa to 3','Main.countMatches("aaaa","aa")==3')),
    contract('',check('longest','kota ma 4 litery','Main.longestWord("ala ma kota")==4'),check('single','Jedno słowo','Main.longestWord("program")==7'),check('equal','Równe słowa','Main.longestWord("ab cd")==2')),
  ],
  'algorithms-18':[
    contract('',check('diag','Przekątna 1+4','Main.diagonalSum(new int[][]{{1,2},{3,4}})==5'),check('three','Macierz 3×3','Main.diagonalSum(new int[][]{{1,0,0},{0,2,0},{0,0,3}})==6')),
    contract('',check('trans','Zamiana wymiarów','Main.transpose(new int[][]{{1,2},{3,4}})[0][1]==3 && Main.transpose(new int[][]{{1,2},{3,4}})[1][0]==2'),check('rect','Prostokątna 2×3','Main.transpose(new int[][]{{1,2,3},{4,5,6}}).length==3')),
    contract('',check('mul','Kwadrat macierzy','Main.multiply(new int[][]{{1,2},{3,4}},new int[][]{{1,2},{3,4}})[1][1]==22'),check('mul-00','Komórka [0][0]','Main.multiply(new int[][]{{1,2},{3,4}},new int[][]{{1,2},{3,4}})[0][0]==7')),
  ],
  'algorithms-19':[
    contract('',check('add','2 3 + to 5','Main.evalRpn(new String[]{"2","3","+"})==5'),check('sub','4 2 - to 2','Main.evalRpn(new String[]{"4","2","-"})==2'),check('chain','1 2 + 3 + to 6','Main.evalRpn(new String[]{"1","2","+","3","+"})==6')),
    contract('',check('sub','4 2 - to 2','Main.evalRpn(new String[]{"4","2","-"})==2'),check('sub-order','Kolejność operandów','Main.evalRpn(new String[]{"2","4","-"})==-2'),check('mixed','5 3 - 2 + to 4','Main.evalRpn(new String[]{"5","3","-","2","+"})==4')),
    contract('',check('yes','(())() zbalansowane','Main.balanced("(())()")'),check('no',')( niezbalansowane','!Main.balanced(")(")'),check('open','( niezamknięte','!Main.balanced("(")')),
  ],
  'algorithms-20':[
    contract('',check('all','Wszystkie 4 osiągalne','Main.reachable(new int[][]{{1,2},{0,3},{0},{1}},0)==4'),check('part','Część grafu','Main.reachable(new int[][]{{1},{0},{3},{2}},0)==2'),check('alone','Wierzchołek samotny','Main.reachable(new int[][]{{},{0}},0)==1')),
    contract('',check('yes','Ścieżka 0→3 istnieje','Main.hasPath(0,3,new int[][]{{1,2},{0,3},{0},{1}},new boolean[4])'),check('no','Ścieżka nie istnieje','!Main.hasPath(0,3,new int[][]{{1},{0},{},{}} ,new boolean[4])'),check('self','Cel to start','Main.hasPath(0,0,new int[][]{{}},new boolean[1])')),
    contract('',check('two','Dwie składowe','Main.countComponents(new int[][]{{1},{0},{}})==2'),check('one','Jedna składowa','Main.countComponents(new int[][]{{1},{0,2},{1}})==1'),check('three','Trzy samotne','Main.countComponents(new int[][]{{},{},{}})==3')),
  ],
  'inheritance-09':[namedChild('Mage'),namedChild('Warrior'),namedChild('Rogue',true)],
  'inheritance-10':[override('Mage','Mage'),override('Warrior','Warrior'),override('Knight','Bohater z tarczą','Bohater')],
  'inheritance-11':[polymorphism('Mage','Warrior','describe','Mage','Warrior'),polymorphism('Healer','Archer','role','Healer','Archer'),polymorphism('Mage','Warrior','attack','Czar','Miecz')],
  'objects-05':[
    contract('Quest a=new Quest();Quest b=new Quest();a.title="Mapa";b.title="Las";',check('field','Odczyt pola title','"Mapa".equals(a.title)'),check('independent','Dwa niezależne obiekty','"Las".equals(b.title) && a!=b')),
    contract('Quest a=new Quest();Quest b=new Quest();a.title="Most";b.title="Wieża";',check('first','Pierwszy tytuł','"Most".equals(a.title)'),check('second','Drugi niezależny tytuł','"Wieża".equals(b.title)')),
    contract('Quest a=new Quest();a.title="Las";',check('describe','Opis korzysta z tytułu instancji','"Quest: Las".equals(a.describe())'),check('changed','Opis widzi zmianę tytułu','changedDescription(a)')),
  ],
  'objects-06':[
    contract('Quest a=new Quest("Las");Quest b=new Quest("Most");',check('constructor','Getter zwraca argument konstruktora','"Las".equals(a.getTitle())'),check('independent','Tytuły nie są współdzielone','"Most".equals(b.getTitle())')),
    contract('Quest a=new Quest("Las");Quest b=new Quest("Most");a.rename("Wieża");',check('rename','rename zmienia stan','"Wieża".equals(a.getTitle())'),check('independent','rename nie zmienia drugiego questa','"Most".equals(b.getTitle())')),
    contract('Player a=new Player(7);Player b=new Player(20);a.addPoints(4);a.addPoints(6);',check('addition','Dodawanie zmienia punkty instancji','a.getPoints()==17'),check('independent','Drugi gracz zachowuje punkty','b.getPoints()==20')),
  ],
  'objects-07':[
    contract('Task task=new Task("Las");Task other=new Task("Most");Planner a=new Planner(task);Planner b=new Planner(other);',check('composition','Planner przechowuje otrzymany Task','a.getTask()==task'),check('independent','Drugi Planner ma własny Task','b.getTask()==other && a.getTask()!=b.getTask()')),
    contract('Team a=new Team(new Quest("Las"));Team b=new Team(new Quest("Most"));',check('first','Team odczytuje tytuł otrzymanego questa','"Las".equals(a.currentTitle())'),check('independent','Druga drużyna ma własny quest','"Most".equals(b.currentTitle())')),
    contract('Inventory inventory=new Inventory(3);Inventory other=new Inventory(9);Hero a=new Hero(inventory);Hero b=new Hero(other);',check('composition','Hero przechowuje otrzymane Inventory','a.getInventory()==inventory'),check('independent','Drugi Hero ma własne Inventory','b.getInventory()==other && a.getInventory()!=b.getInventory()')),
  ],
  'objects-08':[
    contract('Quest a=new Quest("Las");Quest b=new Quest("Most");boolean before=a.isCompleted();a.complete();',check('initial','Początkowo quest nie jest ukończony','!before'),check('complete','complete zmienia stan','a.isCompleted()'),check('independent','Drugi quest nie jest ukończony','!b.isCompleted()')),
    contract('Quest a=new Quest();boolean before=a.isCompleted();a.complete();boolean complete=a.isCompleted();a.reset();',check('initial','Stan początkowy false','!before'),check('complete','Stan po complete true','complete'),check('reset','Stan po reset false','!a.isCompleted()')),
    contract('RewardWallet a=new RewardWallet();RewardWallet b=new RewardWallet();a.add(3);a.add(8);',check('sum','Suma dwóch innych nagród','a.total()==11'),check('independent','Portfele mają oddzielny stan','b.total()==0')),
  ],
};

const structures={
  'objects-06':[['Quest','title','Ljava/lang/String;'],['Quest','title','Ljava/lang/String;'],['Player','points','I']],
  'objects-07':[['Planner','task','LTask;'],['Team','quest','LQuest;'],['Hero','inventory','LInventory;']],
  'objects-08':[['Quest','completed','Z'],['Quest','completed','Z'],['RewardWallet','points','I']],
};

export function withObjectAssertions(lesson) {
  const recipes=contracts[lesson.id];
  if(!recipes)return lesson;
  return {...lesson,tasks:lesson.tasks.map((task,index)=>{
    const recipe=recipes[index];
    const structureChecks=[];
    const field=structures[lesson.id]?.[index];
    if(field)structureChecks.push({id:'private-state',label:`${field[0]}.${field[1]}: prywatne pole instancji`,className:field[0],field:field[1],descriptor:field[2],private:true,instance:true});
    if(lesson.id==='inheritance-09')structureChecks.push({id:'parent',label:'Prawidłowa klasa bazowa Character',className:['Mage','Warrior','Rogue'][index],parent:'Character'});
    if(lesson.id==='inheritance-09'&&index===2)structureChecks.push({id:'level',label:'Rogue.level: prywatny poziom instancji',className:'Rogue',field:'level',descriptor:'I',private:true,instance:true});
    if(lesson.id==='inheritance-10') {
      const className=['Mage','Warrior','Knight'][index];
      structureChecks.push({id:'parent',label:`${className} dziedziczy po Character`,className,parent:'Character'},
        {id:'declared-override',label:`${className} deklaruje własną metodę describe()`,className,method:'describe',descriptor:'()Ljava/lang/String;',instance:true});
    }
    if(lesson.id==='inheritance-11') {
      const types=[['Mage','Warrior'],['Healer','Archer'],['Mage','Warrior']][index],method=['describe','role','attack'][index];
      for(const className of types)structureChecks.push({id:'parent-'+className,label:`${className} dziedziczy po Character`,className,parent:'Character'},
        {id:'override-'+className,label:`${className} deklaruje własną metodę ${method}()`,className,method,descriptor:'()Ljava/lang/String;',instance:true});
    }
    const checks=[...recipe.checks,...structureChecks].map(({id,label})=>({id,label}));
    const extra=lesson.id==='objects-05' && index===2?'static boolean changedDescription(Quest q) { q.title="Wieża"; return "Quest: Wieża".equals(q.describe()); }':'';
    const code=`public class CourseJavaTest {
 static void check(String id, String label, boolean passed) {
  System.out.println("__JAVA_LAB_CHECK__"+id+"\\t"+(passed?"PASS":"FAIL")+"\\t"+label);
 }
 ${extra}
 public static void main(String[] args) {
  Main.main(args);
  ${recipe.setup}
  ${recipe.checks.map(c=>`check(${JSON.stringify(c.id)},${JSON.stringify(c.label)},${c.expression});`).join('\n  ')}
 }
}
`;
    return {...task,javaTestMainClass:'CourseJavaTest',javaTestFiles:{'CourseJavaTest.java':code},assertionChecks:checks,structureChecks};
  })};
}

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

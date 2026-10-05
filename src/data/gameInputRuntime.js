export const gameInputRuntimeFiles = {
  'KeyPressed.java': `package engine;
/** Callback raz na początek naciśnięcia, bez powtarzania podczas trzymania. */
public class KeyPressed extends Component {
    public final String key;
    public final Runnable action;
    public KeyPressed(String key,Runnable action) {
        if(key==null || key.isEmpty() || action==null)throw new IllegalArgumentException("Wymagany klawisz i callback");
        this.key=key;this.action=action;
    }
    @Override public void onUpdate(double delta) {if(Input.isKeyPressed(key))action.run();}
}
`,
  'KeyDoublePressed.java': `package engine;
/** Dwa początki naciśnięcia w oknie czasu gry; pomiędzy nimi trzeba puścić klawisz. */
public class KeyDoublePressed extends KeyPressed {
    public double maxDelaySeconds=0.3;
    private double elapsed;
    private boolean armed;
    public KeyDoublePressed(String key,Runnable action) {super(key,action);}
    @Override public void onUpdate(double delta) {
        if(!Double.isFinite(maxDelaySeconds)||maxDelaySeconds<=0)throw new IllegalArgumentException("Niepoprawne okno podwojnego nacisniecia");
        elapsed+=delta;
        if(!Input.isKeyPressed(key))return;
        if(armed && elapsed<=maxDelaySeconds){armed=false;action.run();}
        else {armed=true;elapsed=0;}
    }
}
`,
  'NoneOfKeysPressed.java': `package engine;
/** Callback w każdej klatce, w której żaden z klawiszy nie jest trzymany. */
public class NoneOfKeysPressed extends Component {
    public final String[] keys;
    public final Runnable action;
    public NoneOfKeysPressed(String[] keys,Runnable action) {
        if(keys==null || keys.length==0 || action==null)throw new IllegalArgumentException("Wymagane klawisze i callback");
        this.keys=keys.clone();this.action=action;
        for(String key:this.keys)if(key==null || key.isEmpty())throw new IllegalArgumentException("Niepoprawny klawisz");
    }
    @Override public void onUpdate(double delta) {
        for(String key:keys)if(Input.isKeyDown(key))return;
        action.run();
    }
}
`,
};

export const swingLessons = [
  {
    id: "swing-13", track: "swing", order: 13, title: "Pierwsze okno Swing", summary: "JFrame i EDT",
    objective: "Poznasz strukturę pierwszej aplikacji okienkowej i ograniczenia Swinga w TeaVM.",
    theory: [
      { title: "JFrame jest oknem", text: "Swing dostarcza komponenty GUI. JFrame jest głównym oknem aplikacji, do którego dodajemy kolejne elementy.", code: "JFrame frame = new JFrame(\"Java Lab\");\nframe.setSize(480, 280);" },
      { title: "EDT obsługuje UI", text: "Kod interfejsu uruchamiaj przez SwingUtilities.invokeLater. Dzięki temu zmiany komponentów trafiają na właściwy wątek Swinga.", code: "SwingUtilities.invokeLater(() -> {\n    frame.setVisible(true);\n});" },
    ],
    tips: ["Pamiętaj o setDefaultCloseOperation.", "TeaVM nie udostępnia biblioteki Swing w tym kursie; skupiamy się na strukturze kodu."],
    tasks: [{
      id: "swing-13-task", title: "Otwórz okno", mode: "guided", runMode: "swing",
      prompt: "Utwórz okno Swing o tytule Java Lab i rozmiarze 480×280.",
      steps: ["Dodaj importy JFrame i SwingUtilities.", "Utwórz JFrame, ustaw rozmiar i zamykanie.", "Pokaż okno przez setVisible(true)."],
      hints: ["W tym kursie sprawdzamy zgodność kodu ze składnią Javy; natywne okno Swing nie jest uruchamiane w TeaVM."],
      starterFiles: { "Main.java": `import javax.swing.JFrame;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        // TODO: utwórz i pokaż JFrame
    }
}
` },
      solutionFiles: { "Main.java": `import javax.swing.JFrame;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Java Lab");
            frame.setSize(480, 280);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "import javax.swing.JFrame", label: "Import JFrame" },
        { kind: "contains", file: "Main.java", value: "new JFrame(\"Java Lab\")", label: "Utworzenie okna" },
        { kind: "contains", file: "Main.java", value: "setDefaultCloseOperation", label: "Bezpieczne zamykanie" },
        { kind: "contains", file: "Main.java", value: "setVisible(true)", label: "Pokazanie okna" },
      ], mainClass: "Main", runMode: "swing",
    }],
  },
  {
    id: "swing-14", track: "swing", order: 14, title: "Komponenty i layout", summary: "JLabel, JButton i panel",
    objective: "Dodasz do okna tekst i przycisk, a następnie ułożysz je w panelu.",
    theory: [
      { title: "Komponenty są obiektami", text: "JLabel, JButton i JPanel to klasy. Tworzysz je przez new i dodajesz do kontenera.", code: "JPanel panel = new JPanel();\npanel.add(new JLabel(\"Quest\"));\npanel.add(new JButton(\"Start\"));" },
      { title: "Layout pomaga układać elementy", text: "Panel ma menedżer układu. Na początku wystarczy domyślny FlowLayout, który układa elementy obok siebie.", code: "frame.add(panel);\nframe.pack();" },
    ],
    tips: ["Dodawaj komponenty przed setVisible(true).", "pack() dobiera rozmiar do zawartości."],
    tasks: [{
      id: "swing-14-task", title: "Panel questa", mode: "guided", runMode: "swing",
      prompt: "Dodaj label z tytułem questa oraz przycisk Start do panelu.",
      steps: ["Utwórz JPanel.", "Dodaj JLabel i JButton.", "Dodaj panel do frame i użyj pack()."],
      hints: ["JButton wymaga importu javax.swing.JButton."],
      starterFiles: { "Main.java": `import javax.swing.JFrame;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: panel z JLabel i JButton
    }
}
` },
      solutionFiles: { "Main.java": `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Quest Planner");
            JPanel panel = new JPanel();
            panel.add(new JLabel("Zaginiony klucz"));
            panel.add(new JButton("Start"));
            frame.add(panel);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "new JPanel()", label: "Panel" },
        { kind: "contains", file: "Main.java", value: "new JLabel", label: "Etykieta" },
        { kind: "contains", file: "Main.java", value: "new JButton", label: "Przycisk" },
        { kind: "contains", file: "Main.java", value: "frame.add(panel)", label: "Dodanie panelu" },
      ], mainClass: "Main", runMode: "swing",
    }],
  },
  {
    id: "swing-15", track: "swing", order: 15, title: "Zdarzenia przycisku", summary: "ActionListener i zmiana UI",
    objective: "Podepniesz reakcję na kliknięcie przycisku i zmienisz tekst etykiety.",
    theory: [
      { title: "Listener czeka na zdarzenie", text: "ActionListener opisuje, co ma się wydarzyć po aktywacji JButtona. Lambda jest krótkim zapisem implementacji interfejsu.", code: "button.addActionListener(event -> {\n    label.setText(\"Gotowe!\");\n});" },
      { title: "Zmieniaj istniejący komponent", text: "Zachowaj referencję do label, aby móc zmienić jego tekst po kliknięciu.", code: "JLabel label = new JLabel(\"Jeszcze nie\");" },
    ],
    tips: ["Listener dodajemy do przycisku przez addActionListener.", "Kod obsługi zdarzenia powinien być krótki i czytelny."],
    tasks: [{
      id: "swing-15-task", title: "Kliknij i zalicz", mode: "guided", runMode: "swing",
      prompt: "Spraw, aby kliknięcie przycisku zmieniało etykietę na Gotowe!.",
      steps: ["Przechowaj JLabel w zmiennej label.", "Dodaj JButton.", "Podepnij addActionListener i użyj label.setText()."],
      hints: ["Lambda event -> { ... } nie potrzebuje ręcznego tworzenia klasy listenera."],
      starterFiles: { "Main.java": `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: label, button i listener
    }
}
` },
      solutionFiles: { "Main.java": `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Zdarzenie");
            JLabel label = new JLabel("Jeszcze nie");
            JButton button = new JButton("Zalicz");
            button.addActionListener(event -> label.setText("Gotowe!"));
            JPanel panel = new JPanel();
            panel.add(label);
            panel.add(button);
            frame.add(panel);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "addActionListener", label: "Listener przycisku" },
        { kind: "contains", file: "Main.java", value: "label.setText", label: "Zmiana etykiety" },
        { kind: "contains", file: "Main.java", value: "Gotowe!", label: "Komunikat po kliknięciu" },
      ], mainClass: "Main", runMode: "swing",
    }],
  },
  {
    id: "swing-16", track: "swing", order: 16, title: "Mini-projekt Quest Planner", summary: "połącz wszystko w GUI",
    objective: "Zbudujesz małe okno, które przyjmuje nazwę questa i reaguje na kliknięcie.",
    theory: [
      { title: "Projekt składa się z decyzji", text: "Najpierw rozdziel komponenty i dane, potem dodaj listener. Nie zaczynaj od przypadkowego kodowania całego okna.", code: "JTextField input = new JTextField(16);\nJButton add = new JButton(\"Dodaj quest\");" },
      { title: "Pętla i GUI spotykają się w zdarzeniu", text: "Jedno kliknięcie może odczytać tekst, zaktualizować model i odświeżyć label. To fundament większych aplikacji.", code: "String title = input.getText();\nstatus.setText(\"Dodano: \" + title);" },
    ],
    tips: ["Najpierw uruchom małą wersję, potem dodawaj szczegóły.", "W projekcie ważniejsza jest czytelna struktura niż liczba komponentów."],
    tasks: [{
      id: "swing-16-task", title: "Dodaj questa", mode: "challenge", runMode: "swing",
      prompt: "Zbuduj formularz z JTextField, JButton i JLabel. Po kliknięciu pokaż w labelu nazwę wpisanego questa.",
      steps: ["Utwórz pole tekstowe, przycisk i status.", "Dodaj je do panelu.", "W listenerze odczytaj getText() i ustaw status przez setText()."],
      hints: ["Potrzebujesz importu javax.swing.JTextField.", "Wartość z pola pobierzesz metodą input.getText()."],
      starterFiles: { "Main.java": `import javax.swing.JFrame;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: zbuduj Quest Planner
    }
}
` },
      solutionFiles: { "Main.java": `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Quest Planner");
            JTextField input = new JTextField(16);
            JButton add = new JButton("Dodaj quest");
            JLabel status = new JLabel("Wpisz nazwę questa");
            add.addActionListener(event -> status.setText("Dodano: " + input.getText()));
            JPanel panel = new JPanel();
            panel.add(input);
            panel.add(add);
            panel.add(status);
            frame.add(panel);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "new JTextField", label: "Pole tekstowe" },
        { kind: "contains", file: "Main.java", value: "new JButton", label: "Przycisk akcji" },
        { kind: "contains", file: "Main.java", value: "input.getText()", label: "Odczyt danych" },
        { kind: "contains", file: "Main.java", value: "status.setText", label: "Aktualizacja statusu" },
      ], mainClass: "Main", runMode: "swing",
    }],
  },
];

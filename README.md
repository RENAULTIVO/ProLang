# ProLang
### This is a language inspired by many others, Swift and Java are the main inspirations, followed by JavaScript and PHP.

- A General-purpose script programming language that focuses on performance and readability
- Can be Compiled, Transpiled or Interpreted
- No external dependencies on runtime
- Cross-platform

# ALPHA VERSION
## The code here is in absolute ALPHA version, the current version is only a <strong>concept-test<strong>, all the code here will be replaced and refactored in a few months (or less). The focus now is just to see everything working, define a design, test and implement new functionalities.

## Focus Now: Android and iOS transpiled code
### Example

- Example code written in ProLang

```Swift

Screen HomeScreen : Activity {

    // Variable example 
    $variable : String = "Vamos ver";

    // function example 
    function printMessage: Void ($mesage: String) {
      terminal($message);
    }

}

```

- Java Output:

```Java
import android.app.Activity;
import android.widget.LinearLayout;

class HomeScreen extends Activity {

  /* Variable example */
  String variable = "Vamos ver";

  /* function example */
  void printMessage(String mesage) {  
    System.out.println(message);
  }

  // Inserted by ProLang
  LinearLayout contentView;

  @Override
  public void onCreate(Bundle bundle) {
    super.onCreate(bundle);
    contentView = new LinearLayout(this);
    setContentView(contentView);
  }
    
}
```

- Swift Output

```Swift
import SwiftUI;

struct HomeScreen: View {

  /* Variable example */
  var variable : String = "Vamos ver";

  /* function example */
  func printMessage(mesage : String ) -> Void {  
    print(message);

  }

  var body: some View {
    Text("Empty Screen");
  }
  
}
```

## Platform compiled code

Platform | Generated Code
-------- | --------------
AVR|AVR Assembly
Android | Java
iOS | SwiftUI
Web|JavaScript
Desktop|NASM Assembly
BIOS|NASM Assembly
Bootloader|NASM Assembly (16bits)

## Work ahead

### Parser resources 
- [x] Data types
- [x] Define and use variables
- [x] Define and use functions
- [x] Indentation of generated code

## AVR
- [ ] Control and set ports
- [ ] Read ports and flags
- [ ] Delay functions

## Web
- [ ] Print text
- [ ] Read values from mouse/keyboard
- [ ] Create screen elements and CSSObject styles

## Desktop
### Windows
- [ ] Print text
- [ ] Read values from keyboard

### Linux
- [ ] Print text
- [ ] Read values from keyboard

### DevOS
- [ ] Print text
- [ ] Read values from keyboard

## Main purpose
- Build a script programming language capable of build kernel, Operational Systems, platform programs and WEB pages without any external dependency

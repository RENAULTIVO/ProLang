# ProLang
### This is a language inspired by many others, Swift and Java are the main inspirations, followed by JavaScript and PHP.

- A General-purpose script programming language that focuses on performance and readability
- Lexical error free
- Can be Compiled, Transpiled or Interpreted
- No external dependencies on runtime
- Cross-platform

# ALPHA VERSION
### The current version is only a <strong>concept-test<strong>, all the code here will be replaced and refactored in a few months (or less). The focus now is just to see everything working, define a design, test and implement new functionalities.

## Focus Now: Android and iOS transpiled code
### Example

- Example code in ProLang

```Swift
Screen HomeScreen : Activity {

  // Variable example 
  $variable : String = "Text Example";

  // function example 
  function printMessage: Void ($message: String) {
    terminal($message);
  }

}
```

- Java Output:

```Java
import android.app.Activity;
import android.os.Bundle;
import android.widget.LinearLayout;

class HomeScreen extends Activity {

  /* Variable example */
  String variable = "Text Example";

  /* function example */
  void printMessage(String message) {  
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
  var variable : String = "Text Example";

  /* function example */
  func printMessage(message : String ) -> Void {  
    print(message);

  }

  var body: some View {
    Text("Empty Screen");
  }
  
}
```

## Lexical error free
- The code below works (not recommended at all) as the first example. The parser just allows these errors to save your time. Fix your errors when you find them.

### Note that the parser tries to copy your break lines (to organize the final code in a similar way that original code did), when you do not use break lines and correct indentation the generated code will have less break lines and a bad identation (but still a working code).

```Swift
ScreenHomeScreen:Activity{$variable:String="Text Example";functionprintMessage:Void($mesage:String){terminal($message);}}
```

## Platform transpiled code

Platform | Generated Code
-------- | --------------
AVR | AVR Assembly
Android | Java
iOS | SwiftUI
Web | JavaScript
Desktop | NASM Assembly

## Work ahead

### Parser resources 
- [x] Data types
- [x] Define and use variables
- [x] Define and use functions
- [x] Allow specific platform function
- [x] Copy break lines and original code identation
- [x] Lexical error free
- [x] Screens
- [x] Classes
- [ ] View elements
- [ ] States

## Main purpose
- Build a script programming language capable of build kernel, Operational Systems, platform programs and WEB pages without external dependencies.

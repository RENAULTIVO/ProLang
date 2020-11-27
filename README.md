# ProLang
### This is a language inspired by many others, but the main inspirations are Swift and Java.

- A General-purpose script programming language that focuses on performance and readability
- Can be Compiled, Transpiled or Interpreted
- No external dependencies on runtime
- Cross-platform

# ALPHA VERSION
## The code here is in absolute ALPHA version, the current version is only a <strong>concept-test<strong>, all the code here will be replaced and refactored in a few months (or less). The focus now is just to see everything working, define a design, test and implement new functionalities.

## Focus Now: Android and iOS transpiled code
### Example

- Example code written in ProLang
´´´SwiftUI
@myState : String = "Initial Value";
$myVariable : String = "my text :)";

function helloWorld : Void ($text : String) {
    terminal($text);
}

´´´

- Java Output:

```Java
String myState_STATE  = "Initial Value";
String myVariable  = "my text :)";

void helloWorld(String text) {
    System.out.println(text);
}
```

- Swift Output

```Swift
@State var myState_STATE : String  = "Initial Value";
var myVariable : String  = "my text :)";

func helloWorld(text : String ) -> Void {
    print(text);
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

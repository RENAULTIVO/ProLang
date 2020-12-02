(() => {

  // temporary
  let onCreate = `  // Inserted by ProLang
  var body: some View {
    Text("Empty Screen");
  }
  `;
  

    let types = {
        'String': 'String',
        'Int': 'Int',
        'Bool': 'Bool',
        'Void': 'Void',
        'Float': 'Float'
    }

    let platformFunctions = {
        terminal: (params) => {
            return `print(${parseFunctionCallParams(params)})`;
        }
    }

    let imports = ['SwiftUI'];

    function parseCommandData(command) {

        if (command.type == 'variable') {
            return `${command.name}`;
        } else if (command.type == 'state') {
            return `${command.name}_STATE`;
        } else if (command.type == 'string') {
            return `"${command.value}"`;
        }

    }

    function parseFunctionCallParams(command) {

        let functionCallParams = '';

        for (let i=0; i<command.length; i++) {
            functionCallParams += parseCommandData(command[i]) + ',';
        }

        return functionCallParams.substring(0, functionCallParams.length-1);

    }

    function parseDataDeclaration(command) {

        if (command.type == 'variable') {
            return `var ${command.name} : ${types[command.dataType]}`;
        } else if (command.type == 'state') {
            return `@State var ${command.name}_STATE : ${types[command.dataType]}`;
        }

    }

    function parseFunctionParams(params) {

        let functionCallParams = '';

        for (let i=0; i<params.length; i++) {
            functionCallParams += `${parseCommandData(params[i])}: ${params[i].dataType}, `;
        }

        return functionCallParams.substring(0, functionCallParams.length-2);

    }

    function parser(commands, identation='') {

        let finalCode = '';

        for (let i=0; i<commands.length; i++) {

            if (commands[i].type == 'screen') {

                finalCode += `\nstruct ${commands[i].name}: View {${parser(commands[i].instructions, identation + '  ')}\n${onCreate}\n}`;

            } else if (commands[i].type == 'class') {

                finalCode += `\nclass ${commands[i].name} {\n${parser(commands[i].instructions, identation + '  ')}\n}`;

            } else if (commands[i].type == 'variable'
            || commands[i].type == 'state') {

                if (commands[i].dataType != '') {
                    finalCode += `${identation}${parseDataDeclaration(commands[i])}`;
                } else {
                    finalCode += `${commands[i].name}`;
                }

            }  else if (commands[i].type == 'operator') {

                finalCode += ` ${commands[i].operator} `;

            } else if (commands[i].type == 'string') {

                finalCode += `"${commands[i].value}"`;

            } else if (commands[i].type == 'number') {

                finalCode += `${commands[i].value}`;

            } else if (commands[i].type == 'function') {

                finalCode += `\n${identation}func ${commands[i].name}(${parseFunctionParams(commands[i].params)}) -> ${commands[i].dataType} {${identation}${parser(commands[i].instructions, identation + '  ')}\n${identation}}`;

            } else if (commands[i].type == 'functionCall'
                && commands[i].platform == 'all'
                || commands[i].platform == 'ios') {
                
                if (platformFunctions[commands[i].function]) {

                    finalCode += `${identation}${platformFunctions[commands[i].function](commands[i].params)}`;

                } else {
                    finalCode += `${identation}${commands[i].function}(${parseFunctionCallParams(commands[i].params)})`;
                }

            } else if (commands[i].type == 'comment') {

                finalCode += `${identation}/*${commands[i].comment}*/\n`;

            } else if (commands[i].type == 'semicolon') {

                if (typeof commands[i-1].platform != 'undefined'
                    && commands[i-1].platform != 'all'
                    && commands[i-1].platform != 'ios') {
                    continue;
                }

                finalCode += `;`;

            } else if (commands[i].type == 'breakline') {

                if (typeof commands[i-1] != 'undefined') {
                    if (typeof commands[i-1].platform != 'undefined'
                        && commands[i-1].platform != 'all'
                        && commands[i-1].platform != 'ios') {
                        continue;
                    }
                }

                finalCode += `\n`;

            }

        }

        return finalCode;

    }

    function mountImpors() {

        let importList = '';

        for (let i=0; i<imports.length; i++) {
            importList += `import ${imports[i]};\n`;
        }

        return importList;

    }

    function parseAll(string) {

        let finalCode = parser(string);
        let importList = mountImpors();

        finalCode = importList + '\n' + finalCode;

        return finalCode;

    }

    window.SwiftUI = {
        parser: parseAll
    }

})(window);
(() => {

    // temporary
    let onCreate = `
  // Inserted by ProLang
  LinearLayout contentView;

  @Override
  public void onCreate(Bundle bundle) {
    super.onCreate(bundle);
    contentView = new LinearLayout(this);
    setContentView(contentView);
  }
    `;

    let types = {
        'String': 'String',
        'Int': 'int',
        'Bool': 'boolean',
        'Void': 'void',
        'Float': 'float'
    }

    let platformExtends = {
        'screen': {
            class: 'Activity',
            import: 'android.app.Activity'
        }
    }

    let platformFunctions = {
        terminal: (params) => {
            return `System.out.println(${parseFunctionCallParams(params)})`;
        }
    }

    let imports = new Array();

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
            return `${types[command.dataType]} ${command.name}`;
        } else if (command.type == 'state') {
            return `${types[command.dataType]} ${command.name}_STATE`;
        }

    }

    function parseFunctionParams(commands) {

        let functionCallParams = '';

        for (let i=0; i<commands.length; i++) {
            functionCallParams += parseDataDeclaration(commands[i]) + ',';
        }

        return functionCallParams.substring(0, functionCallParams.length-1);

    }

    function parser(commands, identation='') {

        let finalCode = '';

        for (let i=0; i<commands.length; i++) {

            if (commands[i].type == 'screen') {

                if (imports.indexOf(platformExtends.screen.import) == -1) {
                    imports.push(platformExtends.screen.import);
                }

                finalCode += `class ${commands[i].name} extends ${platformExtends.screen.class} {${parser(commands[i].instructions, identation + '  ')}${onCreate}\n}`;

            } else if (commands[i].type == 'variable'
            || commands[i].type == 'state') {

                finalCode += `${identation}${parseDataDeclaration(commands[i])}`;

            }  else if (commands[i].type == 'operator') {

                finalCode += ` ${commands[i].operator} `;

            } else if (commands[i].type == 'string') {

                finalCode += `"${commands[i].value}"`;

            } else if (commands[i].type == 'function') {

                finalCode += `${identation}${types[commands[i].dataType]} ${commands[i].name}(${parseFunctionParams(commands[i].params)}) {${identation}${parser(commands[i].instructions, identation + '  ')}${identation}}`;

            } else if (commands[i].type == 'functionCall'
            && commands[i].platform == 'all'
            || commands[i].platform == 'android') {
                
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
                    && commands[i-1].platform != 'android') {
                    continue;
                }

                finalCode += `;`;

            } else if (commands[i].type == 'breakline') {

                if (typeof commands[i-1] != 'undefined') {
                    if (typeof commands[i-1].platform != 'undefined'
                        && commands[i-1].platform != 'all'
                        && commands[i-1].platform != 'android') {
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

    window.Java = {
        parser: parseAll
    }

})(window);
(() => {

    let types = {
        'String': 'String',
        'Int': 'int',
        'Bool': 'boolean',
        'Void': 'void',
        'Float': 'float'
    }

    let platformFunctions = {
        terminal: (params) => {
            return `System.out.println(${parseFunctionCallParams(params)})`;
        }
    }

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

            if (commands[i].type == 'variable'
            || commands[i].type == 'state') {

                finalCode += `${parseDataDeclaration(commands[i])} `;

            }  else if (commands[i].type == 'operator') {

                finalCode += ` ${commands[i].operator} `;

            } else if (commands[i].type == 'string') {

                finalCode += `"${commands[i].value}"`;

            } else if (commands[i].type == 'function') {

                finalCode += `${types[commands[i].dataType]} ${commands[i].name}(${parseFunctionParams(commands[i].params)}) {${identation}${parser(commands[i].instructions, identation + '  ')}${identation}\n}`;

            } else if (commands[i].type == 'functionCall') {
                
                if (platformFunctions[commands[i].function]) {

                    finalCode += `${identation}${platformFunctions[commands[i].function](commands[i].params)}`;

                } else {
                    finalCode += `${identation}${commands[i].function}(${parseFunctionCallParams(commands[i].params)})`;
                }

            } else if (commands[i].type == 'semicolon') {

                finalCode += `;`;

            } else if (commands[i].type == 'breakline') {

                finalCode += `\n${identation}`;

            }

        }

        return finalCode;

    }

    window.Java = {
        parser: parser
    }

})(window);
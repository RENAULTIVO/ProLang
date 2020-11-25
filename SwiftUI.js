(() => {

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
            functionCallParams += `${parseCommandData(params[i])} : ${params[i].dataType} ,`;
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

                finalCode += `func ${commands[i].name}(${parseFunctionParams(commands[i].params)}) -> ${commands[i].dataType} {${identation}${parser(commands[i].instructions, identation + '  ')}${identation}\n}`;

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

    window.SwiftUI = {
        parser: parser
    }

})(window);
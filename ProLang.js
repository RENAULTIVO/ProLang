(()=>{

    "use strict";

    let ProLang = new Object();

    ProLang.data = {
        variables: new Object()
    }

    ProLang.platforms = {
        linux: {
            '$': (command) => {

            }
        }
    }

    ProLang.compileTo = 'linux';

    ProLang.setPlatform = (platform) => {
        ProLang.compileTo = platform;
    }

    ProLang.newLineOn = ';';

    ProLang.newLineOn = (newLineOn) => {

        if (newLineOn == '\\n') {
            newLineOn = '\n';
        }

        ProLang.newLineOn = newLineOn;

    }

    ProLang.setVariable = (variable) => {
        ProLang.data.variables[variable.name] = variable.value;
    }

    ProLang.getVariable = (variable) => {
        return ProLang.data.variables[variable.name];
    }

    let operators = ['>', '<', '>>', '<<', '=', '+', '-', '*', '/', '!', '%'];

    let variableSettings = {
        name: {
            invalidCharacters: ['\\', ']', '[', '@', '{', '}', '|', '#', '(', ')', ' ', '$', '"', "'"]
        }
    }

    ProLang.parseCommand = (commandString) => {

        let commandArray = new Array();

        commandString = commandString.split('');

        let i=0;

        function getVariableName() {

            let variableName = "";

            for (;i<commandString.length; i++) {

                if (variableSettings.name.invalidCharacters.indexOf(commandString[i]) != -1
                || operators.indexOf(commandString[i]) != -1) {
                    break;
                }

                variableName += commandString[i];

            }

            i--;
            return variableName;

        }

        for (i=0; i<commandString.length; i++) {

            if (commandString[i] == '"') {

                i++;
                let string = "";

                for (;i<commandString.length; i++) {

                    if (commandString[i] == "\\") {
                        continue;
                    } else if (commandString[i] == '"' && commandString[i-1] != "\\") {
                        break;
                    }

                    if (commandString[i] == '$') {
                        i++;
                        let variableName = getVariableName();
                        string += ProLang.getVariable({
                            name: variableName
                        });
                    } else {
                        string += commandString[i];
                    }

                }

                commandArray.push({
                    isString: true,
                    value: string.trim()
                });

            } else if (commandString[i] == '$') {

                i++;
                let variableName = getVariableName();

                commandArray.push({
                    isVariable: true,
                    name: variableName.trim()
                });

            } else if (operators.indexOf(commandString[i]) != -1) {

                let operatorString = "";

                for (;i<commandString.length; i++) {

                    if (operators.indexOf(commandString[i]) == -1) {
                        break;
                    }

                    operatorString += commandString[i];

                }

                i--;

                commandArray.push({
                    isOperator: true,
                    operator: operatorString
                });

            } else if (!isNaN(parseFloat(commandString[i]))) {

                let numberString = "";

                for (;!isNaN(parseFloat(commandString[i])) && i<commandString.length; i++) {
                    numberString += commandString[i];
                }

                i--;

                commandArray.push({
                    isNumber: true,
                    value: parseFloat(numberString)
                });

            }

        }

        return commandArray;

    }

    ProLang.run = (comandList) => {

        comandList.forEach((command) => {
            
            for (let i=0; i<command.length; i++) {

                if (command[i].isVariable && command[+1].isOperator) {

                    let variableName = command[i].name;

                    if (command[+1].operator == '=') {

                        let valueString = "";
                        let containsString = false;

                        for (i=i+2; i<command.length; i++) {

                            if (command[i].isVariable) {

                                let value = ProLang.getVariable({ name: command[i].name});
                                valueString += value;

                                if (typeof value == 'string') {
                                    containsString = true;
                                }

                            } else if (command[i].isNumber) {
                                valueString += command[i].value;
                            } else if (command[i].isOperator) {
                                valueString += command[i].operator;
                            } else if (command[i].isString) {
                                valueString += command[i].value;
                                containsString = true;
                            }

                        }

                        i--;

                        if (!containsString) {
                            valueString = eval(valueString);
                        }

                        ProLang.setVariable({
                            name: variableName,
                            value: valueString
                        });

                    }

                }

            }

        });

    }

    ProLang.parser = (string) => {

        let commandList = new Array();
        ProLang.data.variables = new Object();

        string.trim().split(ProLang.newLineOn).forEach((commandLine) => {
            let command = ProLang.parseCommand(commandLine.trim());
            ProLang.run([command]);
            commandList.push(command);
        });

        console.log(commandList);

    }

    ProLang.compile = (string) => {
        ProLang.parser(string);
    }

    window.ProLang = {
        compile: ProLang.compile,
        newLineOn: ProLang.newLineOn,
        setPlatform: ProLang.setPlatform
    }

    window.getVariables = () => {
        return ProLang.data
    }

})(window);
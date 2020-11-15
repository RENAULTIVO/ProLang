(()=>{

    let ProLang = new Object();

    let operators = ['>', '<', '>>', '<<', '=', ':', '+', '-', '*', '/', '!', '%'];
    let invalidNameCharacters = ['\\', ']', '[', '@', '{', '}', '|', '#', '(', ')', ' ', '$', '"', "'", ',', '\n'];

    function run() {
        


    }

    function parser(string) {

        string = string.split('');

        let i=0;
        let currentString = '';

        let commandList = new Array();

        function getVariableName() {

            let variableName = '';

            if (string[i] == '$') {
                i++;
            }

            for (;i<string.length; i++) {

                if (invalidNameCharacters.indexOf(string[i]) != -1
                || operators.indexOf(string[i]) != -1) {
                    break;
                }

                variableName += string[i];

            }

            return variableName;

        }

        function getString() {

            let quotes = string[i];
            i++;

            let value = '';

            for (;i<string.length; i++) {

                if (string[i] == '\\') {
                    continue
                } else if (string[i] == quotes && string[i-1] != '\\') {
                    break;
                }

                value += string[i];

            }

            return value;

        }

        function getNumber() {

            let numberString = '';

            for (;i<string.length && !isNaN(parseFloat(string[i], 10)); i++) {
                numberString += string[i];
            }

            return parseFloat(numberString, 10);

        }

        function getFunction() {

            let functionData = {
                name: '',
                params: '',
                commands: ''
            };

            for (; i<string.length && string[i] != '('; i++) {

                if (string[i] == '@') {
                    continue;
                }

                functionData.name += string[i];

            }

            i--;

            for (; i<string.length && string[i] != ')'; i++) {

                if (string[i] == '@') {
                    continue;
                }

                functionData.params += string[i];

            }
            
            for (; i<string.length && string[i] != '{'; i++);
            i++;

            let contextCounter = 0;

            for (;i<string.length; i++) {

                if (string[i] == '{') {
                    contextCounter++;
                } else if (string[i] == '}') {
                    contextCounter--;
                }

                functionData.commands += string[i];

                if (contextCounter == -1) {
                    break;
                }

            }

            functionData.params = parser(functionData.params);
            functionData.commands = parser(functionData.commands);

            return functionData;

        }

        for (i=0; i<string.length; i++) {

            if (string[i] == '$') {

                commandList.push({
                    type: 'variable',
                    name: getVariableName()
                });

            } else if (string[i] == '"' || string[i] == "'") {

                commandList.push({
                    type: 'string',
                    value: getString()
                })

            } else if (operators.indexOf(string[i]) != -1) {

                commandList.push({
                    type: 'operator',
                    operator: string[i]
                });

            } else if (!isNaN(parseFloat(string[i], 10))) {

                commandList.push({
                    type: 'number',
                    value: getNumber()
                });

            } else if (string[i] == '@') {

                let functionData = getFunction();

                commandList.push({
                    type: 'function',
                    name: functionData.name,
                    params: functionData.params,
                    commands: functionData.commands
                });

            } else if (string[i] == '\n') {
                
                commandList.push({
                    type: 'breakLine'
                });

            }

        }

        return commandList;

    }

    ProLang.compile = (string) => {
        let commandList = parser(string);
        console.log(window.ProLang.JavaScript.parser(commandList));
    }

    window.ProLang = {
        compile: ProLang.compile
    }

    window.getParserData = () => {
        return ProLang.data;
    }


})(window);
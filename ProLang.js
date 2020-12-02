(() => {

    let platforms = ['android', 'ios'];

    let validChars = [
        '.',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    let breakCommandChars = [';', '-', '~', '"', "'"];

    let operators = ['=', '+', '-', '*', '/', '<', '>', '|', '&'];

    function getNextString(string, initialIndex) {

        let text = '';
        let quotes = string[initialIndex];
        initialIndex++;

        let i;

        for (i=initialIndex; i<string.length; i++) {

            if (string[i] == '\\'
             && string[i+1] == quotes) {
                i++;
                text += quotes;
                continue;
            } else if (string[i] == quotes) {
                i++;
                break;
            }

            text += string[i];

        }

        return {
            value: text,
            finalIndex: i-1
        };

    }

    function getNextName(string, initialIndex) {
        
        let name = '';
        let type = '';
        let isDefinition = false;
        initialIndex++;

        let i;

        // remove empty spaces
        for (i=initialIndex; i<string.length
            && validChars.indexOf(string[i].toLowerCase()) == -1
            && breakCommandChars.indexOf(string[i]) == -1; i++);

        for (; i<string.length
            && breakCommandChars.indexOf(string[i]) == -1; i++) {

            if (validChars.indexOf(string[i].toLowerCase()) == -1) {
                break;
            }

            name += string[i];

        }

        // verify if this is a variable/function definition
        for (; i<string.length
            && validChars.indexOf(string[i].toLowerCase()) == -1
            && breakCommandChars.indexOf(string[i]) == -1
            && string[i] != ':'
            && string[i] != '{'; i++);
        

        if (string[i] == ':') {
            isDefinition =  true;
        }

        // go to type definition
        for (; i<string.length
            && isDefinition
            && validChars.indexOf(string[i].toLowerCase()) == -1
            && breakCommandChars.indexOf(string[i]) == -1; i++);

        for (; i<string.length
            && isDefinition
            && breakCommandChars.indexOf(string[i]) == -1; i++) {

            if (validChars.indexOf(string[i].toLowerCase()) == -1) {
                break;
            }

            type += string[i];

        }

        return {
            name,
            type,
            finalIndex: i-1
        }

    }

    function getNextFunctionParams(string, initialIndex) {

        let params = '';
        let i;

        initialIndex++;
        
        for (;initialIndex<string.length && string[initialIndex] == ' '; initialIndex++);

        for (i=initialIndex; i<string.length; i++) {
            
            if (string[i] == '(') {
                continue;
            }
            else if (string[i] == ')') {
                break;
            }

            params += string[i];

        }   

        params = parser(params);

        return {
            params,
            finalIndex: i-1
        }

    }

    function getNextCurlyBracket(string, initialIndex) {

        let i = initialIndex;
        let instructions = '';

        // clear empty spaces
        for (; i<string.length && string[i] != '{'; i++);

        let contextCounter = 0;
        
        for (;i<string.length; i++) {

            if (string[i] == '{') {
                contextCounter++;
            } else if (string[i] == '}') {
                contextCounter--;
            }

            instructions += string[i];
            
            if (contextCounter == 0) {
                break;
            }

        }

        return {
            instructions: instructions.substring(1, instructions.length-1),
            finalIndex: i
        };

    }

    function getNextNumber(string, initialIndex) {

        let i = initialIndex;
        let numberString = '';

        for (; i<string.length; i++) {

            if (isNaN(parseFloat(string[i], 10))) {
                break;
            }

            numberString += string[i];

        }

        return {
            number: parseFloat(numberString, 10),
            finalIndex: i-1
        }

    }

    function getComment(string, initialIndex) {

        let i = initialIndex;
        let comment = '';

        // one line comment
        if (string[i] == '/' && string[i+1] == '/') {

            i += 2;

            for (; i<string.length; i++) {

                if (string[i] == '\n') {
                    break;
                }

                comment += string[i];

            }

        } else {

            i += 2;

            for (; i<string.length; i++) {

                if (string[i] == '*' && string[i+1] == '/') {
                    i++;
                    break;
                }

                comment += string[i];

            }

        }

        return {
            comment,
            finalIndex: i
        };

    }

    function parser(string) {

        string = string.split('');
        let commands = new Array();
        
        let currentString = '';

        for (let i=0; i<string.length; i++) {

            if (currentString.trim().toLowerCase() == 'screen'
            || currentString.trim().toLowerCase() == 'class') {

                let name = getNextName(string, i-1);
                let instructions = getNextCurlyBracket(string, name.finalIndex);

                i = instructions.finalIndex;

                commands.push({
                    type: currentString.trim().toLowerCase(),
                    name: name.name,
                    instructions: parser(instructions.instructions)
                });

                currentString = '';

            } else if (currentString.trim().toLowerCase() == 'function') {

                let name = getNextName(string, i-1);
                let params = getNextFunctionParams(string, name.finalIndex);
                let instructions = getNextCurlyBracket(string, params.finalIndex);

                i = instructions.finalIndex;

                commands.push({
                    type: 'function',
                    name: name.name,
                    dataType: name.type,
                    params: params.params,
                    platform: 'all',
                    instructions: parser(instructions.instructions)
                });

                currentString = '';

            } else if ( platforms.indexOf(currentString.trim().toLowerCase()) != -1
                && string[i] == ':') {

                let name = getNextName(string, i);
                let functionParams = getNextFunctionParams(string, name.finalIndex);
                i = functionParams.finalIndex;

                commands.push({
                    type: 'functionCall',
                    params: functionParams.params,
                    platform: currentString.trim().toLowerCase(),
                    function: name.name
                });
    
                currentString = '';

            }  else if (string[i] == '"'
            || string[i] == "'") {
                
                let stringValue = getNextString(string, i);

                i = stringValue.finalIndex;

                commands.push({
                    type: 'string',
                    value: stringValue.value
                });

                currentString = '';
            
            } else if (string[i] == '@') {

                let state = getNextName(string, i);
                i = state.finalIndex;

                commands.push({
                    type: 'state',
                    name: state.name,
                    dataType: state.type
                });

                currentString = '';

            } else if (string[i] == '$') {

                let variable = getNextName(string, i);

                i = variable.finalIndex;

                console.log(variable, string[i])

                commands.push({
                    type: 'variable',
                    name: variable.name,
                    dataType: variable.type
                });

                currentString = '';

            } else if (!isNaN(parseFloat(string[i], 10))) {

                let number = getNextNumber(string, i);
                i = number.finalIndex;

                commands.push({
                    type: 'number',
                    value: number.number
                });

            } else if (string[i] == '/'
            && (string[i+1] == '/' || string[i+1] == '*')) {

                let comment = getComment(string, i);

                i = comment.finalIndex;

                commands.push({
                    type: 'comment',
                    comment: comment.comment
                });

            } else if (operators.indexOf(string[i]) != -1) {

                commands.push({
                    type: 'operator',
                    operator: string[i]
                });

                currentString = '';

            } else if (string[i] == ';') {

                commands.push({
                    type: 'semicolon'
                });

                currentString = '';

            } else if (string[i] == '(') {

                let functionParams = getNextFunctionParams(string, i);

                i = functionParams.finalIndex;

                commands.push({
                    type: 'functionCall',
                    params: functionParams.params,
                    platform: 'all',
                    function: currentString.trim()
                });

                currentString = '';

            } else if (string[i] == '\n') {

                commands.push({
                    type: 'breakline'
                });

            }  else {
                currentString += string[i];
            }

        }

        return commands;

    }

    function compile(string) {

        let parseData = parser(string);

        console.log(parser(string));
        console.log('----- swift ------');
        console.log(SwiftUI.parser(parseData));
        console.log('\n\n----- java ------');
        console.log(Java.parser(parseData));

    }

    window.ProLang = {
        compile: compile
    }

})(window);
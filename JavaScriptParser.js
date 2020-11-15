(()=>{

    function parser(commandList, leftTab='') {

        let finalCode = '';

        commandList.forEach((command) => {

            if (command.type == 'variable') {

                finalCode += `${leftTab}let ${command.name} `;

            } else if (command.type == 'operator') {

                finalCode += `${command.operator} `;

            } else if (command.type == 'string') {

                finalCode += `"${command.value}" `;

            } else if (command.type == 'number') {

                finalCode += `${command.value} `;

            } else if (command.type == 'function') {

                finalCode += `${leftTab}function ${command.name}() {${leftTab}${parser(command.commands, leftTab+'  ')}${leftTab}}`;
            
            } else if (command.type == 'breakLine') {

                finalCode += '\n';

            }

        });

        return finalCode;

    }

    window.ProLang.JavaScript = {
        parser: parser
    };

})(window);
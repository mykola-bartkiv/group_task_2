function transpile() {
    let obj = {};
    let input = document.getElementById('inputCode').value.split('\n');
    let output = [];
    let errorInfo = [];
    let info;
    for (let i = 0; i < input.length; i += 1) {
        let syntaxError = input[i][input[i].length -1]!== ';'
            &&input[i][input[i].length -1]!== '{'
            &&input[i][input[i].length -1]!== '}'
            &&input[i].replace(/\s/g, '')!=='';
        if (syntaxError) {
            errorInfo.push(`Line ${i + 1}: syntax error`);
        }
        if (input[i].includes(':') && input[i].includes('<=')) { //assigned block

            let start = 0;
            input[i] = input[i].match(/('.*?'|[^'\s]+)+(?=\s*|\s*$)/g).join(''); //delete white space
            let name = input[i].substring(input[i].lastIndexOf(':'), start); //cut variable name
            let typeValue = input[i].substring(input[i].lastIndexOf(':') + 1, input[i].lastIndexOf(';')); //get type and value of variable
            typeValue = typeValue.split('<=');
            let type = 0;
            let value = 1;

            if (typeValue[type] === 'int') {
                typeValue[value] = parseInt(typeValue[value], 10);
            } else if (typeValue[type] === 'float') {
                typeValue[value] = parseFloat(typeValue[value]);
            } else if (typeValue[type] === 'string') {
                // typeValue[value] = typeValue[value].replace(/\'/g, '');
            } else {
                errorInfo.push(`Line ${i + 1}: invalid data type`);
                continue;
            }
            obj[name] = typeValue[value];
            output[i] = `var ${name} = ${typeValue[value]};`;

        } else if (input[i].includes('repeat')) { //for block

            if (input[i].includes('int')) {
                let cut = 3;
                let cycleInit = input[i].substring(input[i].indexOf('int')+cut, input[i].indexOf(';'))
                    .replace(/\s/g, '');
                let typeValue = cycleInit.split('=');
                let name = 0;
                let value = 1;
                typeValue[value] = parseInt(typeValue[value], 10);
                obj[typeValue[name]] = typeValue[value];
            } else {
                errorInfo.push(`Line ${i + 1}: syntax error`);
            }


            console.log(obj);

            input[i] = input[i].replace(/repeat/g, 'for ').replace(/int/g, 'var');
            output[i] = `${input[i]}`;

        } else if (!input[i].includes(':') && input[i].includes('<=')) { //expression block

            input[i] = input[i].replace(/<=/g, '=')
                .replace(/\+\+/g, '+')
                .replace(/%/g, '/')
                .replace(/--/g, '-')
                .replace(/\^/g, '*');

            /*start: check if has variable*/
            let start = 0;
            let end = -1;
            let checkVar = input[i].slice(start, end).split(' ');
            for (let j = 0; j < checkVar.length; j += 1) {
                checkVar[j] = checkVar[j].replace(/\s/g, '');
                let checkQuery = checkVar[j] !== '='
                    && !checkVar[j].includes("'")
                    && isNaN(checkVar[j])
                    && checkVar[j] !== '+'
                    && checkVar[j] !== '-'
                    && checkVar[j] !== '*'
                    && checkVar[j] !== '/'
                    && checkVar[j] !== ')'
                    && checkVar[j] !== '('
                    && !obj.hasOwnProperty(checkVar[j]);
                if (checkQuery) {
                    errorInfo.push(`Line ${i + 1}: syntax error`);
                }
            }
            /*end: check if has variable*/

            output[i] = `${input[i]}`;

        } else {
            output[i] = `${input[i]}`;
        }
    }

    let min = 0;
    info = errorInfo.length > min ? errorInfo.join('\n') : 'Transpilation completed... No errors found';
    document.getElementById('info').value = info;
    if (errorInfo.length <= min) {
        document.getElementById('outputCode').value = output.join('\n');
    } else {
        document.getElementById('outputCode').value = '';
    }
}

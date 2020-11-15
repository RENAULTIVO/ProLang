let textarea = document.querySelector('textarea');
let newLineIdentifier = document.getElementById('newLineIdentifier');
let platform = document.getElementById('platform');
let button = document.querySelector('button');

function compileCode() {
    //window.ProLang.newLineOn(newLineIdentifier.value);
    //window.ProLang.setPlatform(platform.value);
    window.ProLang.compile(textarea.value);
}

button.onclick = compileCode;

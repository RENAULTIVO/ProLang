/*
 * RENAULTIVO WEB SYSTEM
 * Welcome to the Source Code of the Renaultivo Web System :)
 * RELEASE: 10/19/2020
 * */

((window)=>{

    "use strict";

    function verify(data) {
        return data != null && data != undefined && data != NaN && typeof data != "undefined";
    }

    window.verify = verify;
    
    let upperCaseLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let lowerCaseLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

    function JSStyleToCss(code, spaced=false) {

		let finalCode = '';
		let allOrganize = [];

		if (spaced) {
			allOrganize[0] = '  ';
			allOrganize[1] = '\n';
		}
		else {
			allOrganize[0] = '';
			allOrganize[1] = '';
		}

		for (let ob in code) {

			let propName = ob.split('');
			finalCode += allOrganize[0];

			for (let l=0; l<propName.length; l++) {
				let verifyLetter = upperCaseLetters.indexOf(propName[l]);
				if (verifyLetter!=-1) {
					propName[l] = '-'+lowerCaseLetters[verifyLetter];
				}
				finalCode += propName[l];
			}

			finalCode += ':' + code[ob] + ';'+allOrganize[1];

		}

		return finalCode;

	}

    let elementManagerCSSNames = new Array();
    let elementManagerCSSElement = null;

    function getCSSRandomName() {

        let randomString = '';
        let elementManagerCSSLetters = upperCaseLetters.concat(lowerCaseLetters);

        for (let i=0; i<7; i++) {
            randomString += elementManagerCSSLetters[Math.floor(Math.random() * 48)];
        }

        return randomString;

    }

    function createCSS(style) {

        let styleName = `${getCSSRandomName()}`;

        if (elementManagerCSSNames.indexOf(styleName) != -1) {

            while (elementManagerCSSNames.indexOf(styleName) != -1) {
                styleName = `${getCSSRandomName()}`;
            }

        }

        elementManagerCSSNames.push(styleName);

        if (elementManagerCSSElement == null) {
            elementManagerCSSElement = createElement({
                tag: 'style'
            }).addTo(document.head);
        }

        elementManagerCSSElement.addText(`.${styleName} {${JSStyleToCss(style)}}`);

        return styleName;

    }

    window.createCSS = createCSS;

    function createCSSObject(jsObject) {

        let cssObject = new Object();

        for (let key in jsObject) {

            let firstKey = Object.keys(jsObject[key])[0];
            let objFirstValue = jsObject[key][firstKey];

            if (typeof objFirstValue == 'object') {

                cssObject[key] = new Object();

                for (let prop in jsObject[key]) {

                    firstKey = Object.keys(jsObject[key][prop])[0];

                    if (typeof jsObject[key][prop][firstKey] == 'object') {
                        cssObject[key][prop] = createCSSObject(jsObject[key][prop]);
                    } else {
                        cssObject[key][prop] = createCSS(jsObject[key][prop]);
                    }

                }

            } else if (typeof objFirstValue == 'string' || typeof objFirstValue == 'number') {
                cssObject[key] = createCSS(jsObject[key]);
            }

        }

        return cssObject;

    }

    window.createCSSObject = createCSSObject;

    function setStyle(element, style) {

        for (let prop in style) {
            element.style[prop] = style[prop];
        }

        return element;

    }

    function setAttributes(element, attributes) {

        for (let att in attributes) {
            element[att] = attributes[att];
        }

        return element;

    }

    function addTo(area, element) {
        area.appendChild(element);
        return element;
    }

    function clearElement(element) {
        
        for (let content in element.children) {

            if (typeof element.children[content] == 'object') {
                element.removeChild(element.children[content]);
            }

        }

        return element;

    }

    function setContent(element, content) {
        
        clearElement(element);

        if (typeof content == 'string' || typeof content == 'number') {
            content = document.createTextNode(content);
        }

        if (Array.isArray(content)) {
            
            content.forEach((c) => {
                addContent(element, c);
            });

        } else {
            element.appendChild(content);
        }

        return element;

    }

    function clearElement(element) {
        
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        return element;

    }

    function addContent(element, content) {
        
        if (typeof content == 'string' || typeof content == 'number') {
            content = document.createTextNode(content);
        }

        if (Array.isArray(content)) {

            content.forEach((c) => {
                addContent(element, c);
            });

        } else {

            element.appendChild(content);

        }

        return element;

    }

    function setText(element, text) {
        element.innerText = text;
        return element;
    }

    function addText(element, text) {
        element.innerText += text;
        return element;
    }

    function changeText(element, oldText, newText) {
        element.innerText = element.innerText.replace(oldText, newText);
        return element;
    }

    function changeContent(element, oldContent, newContent) {
        element.replaceChildren(oldContent, newContent);
        return element;
    }

    function on(element, event, action) {

        if (Array.isArray(element)) {

            element.forEach((e) => {
                on(e, event, action);
            });

            return element;

        }

        if (Array.isArray(event)) {

            event.forEach((e) => {
                on(element, e, action);
            });

            return element;

        }

        if (Array.isArray(action)) {

            action.forEach((a) => {
                on(e, a);
            });

            return element;

        }

        element.addEventListener(event, action);

        return element;

    }

    function setRipple(element, color) {

        let lastStyleSettings = {
            overflow: element.style.overflow,
            transform: element.style.transform
        };
        
        let rippleElement = createElement({
            style: {
                zIndex: element.style.zIndex != "" ? element.style.zIndex - 1 : -1,
                position: 'absolute',
                borderRadius: '50%',
                pointerEvents: 'none',
                backgroundColor: color
            }
        });

        rippleElement.active = false;

        element.on({
            on: 'mousedown',
            do: function(e) {

                if (rippleElement.active === true) {
                    return;
                }

                element.style.overflow = 'hidden';
                element.style.transform = 'scale(1.1)';

                let rippleSize = Math.max(element.offsetWidth, element.offsetHeight) * 3;

                rippleElement.setStyle({
                    top: `${e.layerY - (rippleSize/2)}px`,
                    left: `${e.layerX - (rippleSize/2)}px`,
                    width: `${rippleSize}px`,
                    height: `${rippleSize}px`,
                    animation: 'ripple linear 0.3s',
                });

                this.appendChild(rippleElement);

                rippleElement.active = true;

            }
        });

        element.on({
            on: ['mouseup', 'mouseleave', 'touchend'],
            do: () => {

                setTimeout(()=>{

                    if (rippleElement.active === true && rippleElement.parentElement != null) {
                        
                        rippleElement.setStyle({
                            animation: 'rippleFadeOut linear 0.2s'
                        });

                        setTimeout(()=>{

                            
                            if (rippleElement.active === true && rippleElement.parentElement != null) {
                                rippleElement.active = false;
                                element.style.overflow = lastStyleSettings.overflow;
                                element.style.transform = lastStyleSettings.transform;
                                element.removeChild(rippleElement);
                            }

                        }, 190);

                    }

                }, 290);

            }
        })

    }

    function setDefaultMethods(element) {

        element.setStyle = (style) => {
            setStyle(element, style);
            return element;
        }

        element.setAttributes = (attributes) => {
            setAttributes(element, attributes);
            return element;
        }

        element.addTo = (area) => {
            addTo(area, element);
            return element;
        }

        element.setContent = (content) => {
            setContent(element, content);
            return element;
        }

        element.addContent = (content) => {
            addContent(element, content);
            return element;
        }

        element.changeContent = (oldContent, newContent) => {
            changeContent(element, oldContent, newContent);
            return element;
        }

        element.setText = (text) => {
            setText(element, text);
            return element;
        }

        element.addText = (text) => {
            addText(element, text);
            return element;
        }

        element.setHTML = (htmlString) => {
            element.innerHTML = htmlString;
            return element;
        }

        element.changeText = (oldText, newText) => {
            changeText(element, oldText, newText);
            return element;
        }

        element.on = (props) => {

            if (Array.isArray(props)) {
                props.forEach((e) => {
                    on(element, e.on, e.do);
                });
            } else {
                on(element, props.on, props.do);
            }

            return element;
        }

        element.setClass = (className) => {
            element.className = className;
            return element;
        }

        element.addClass = (className) => {
            element.classList.add(className);
            return element;
        }

        element.changeClass = (oldClassName, newClassName) => {
            element.classList.remove(oldClassName);
            element.classList.add(newClassName);
            return element;
        }

        element.setID = (id) => {
            element.id = id;
            return element;
        }

        element.addID = (id) => {
            element.id.concat(' ' + id);
            return element;
        }

        element.changeID = (oldID, newID) => {
            element.id = element.id.replace(oldID, newID);
            return element;
        }

        element.setRipple = (color) => {
            setRipple(element, color);
            return element;
        }

        element.clear = () => {
            clearElement(element);
            return element;
        }

        return element;

    }

    function createElement(props = {}) {

        let element = document.createElement(verify(props.tag) ? props.tag : 'div');
        
        setDefaultMethods(element);

        if (verify(props.id)) {
            element.setID(props.id);
        }

        if (verify(props.class)) {
            element.setClass(props.class);
        }

        if (verify(props.content)) {
            element.setContent(props.content);
        }

        if (verify(props.html)) {
            element.setHTML(props.html);
        }

        if (verify(props.event)) {
            element.on(props.event);
        }

        if (verify(props.style)) {
            if (typeof props.style == 'string') {
                element.addClass(props.style);
            } else {
                element.setStyle(props.style);
            }
        }

        if (verify(props.attributes)) {
            element.setAttributes(props.attributes);
        }

        if (verify(props.ripple)) {
            element.setRipple(props.ripple);
        }

        return element;

    }

    window.createElement = createElement;

    function createElementList(props = {}) {

        let elementList = new Array();

        if (typeof props.list != 'undefined') {

            if (Array.isArray(props.list)) {
                props.list.forEach((e) => {
                    elementList.push(createElement(Object.assign(props, e)));
                });
            } else if (typeof props.list == 'number') {
                for (let i=0; i<props.list; i++) {
                    elementList.push(createElement(props));
                }
            }

        }

        return elementList;

    }

    window.createElementList = createElementList;

})(window);
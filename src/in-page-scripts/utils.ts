﻿interface Utils {
    <TElement extends HTMLElement>(selector: string, element?: NodeSelector, condition?: (el: TElement) => boolean): TElement;
    try<TElement extends HTMLElement>(selector: string, element?: NodeSelector, condition?: (el: TElement) => boolean): TElement;
    visible<TElement extends HTMLElement>(selector: string, element?: NodeSelector): TElement;
    all<TElement extends HTMLElement>(selector: string, element?: NodeSelector): TElement[];
    select<TElement extends HTMLElement>(selector: (string) | (string[]) | (() => string[]) | (() => string), element?: NodeSelector): TElement[];
    closest<TElement extends HTMLElement>(selector: string, element: HTMLElement): TElement;
    getAttribute(selector: string, attributeName: string, element?: NodeSelector): string;
    create<TElement extends HTMLElement>(tagName: string, className?: string): TElement;
    getRelativeUrl(baseUrl: string, fullUrl: string): string;
}

var $$ = <Utils>function (selector: string, element?: NodeSelector, condition?: (el: Element) => boolean) {

    element = element || document;

    if (!condition) {
        return <HTMLElement>element.querySelector(selector);
    }

    var nodeList = element.querySelectorAll(selector);
    for (var i = 0; i < nodeList.length; i++) {
        if (condition(nodeList[i])) {
            return nodeList[i];
        }
    }
}

$$.try = function (selector: string, element?: NodeSelector, condition?: (el: Element) => boolean) {
    return $$(selector, element, condition) || <HTMLElement>{};
}

$$.create = function (tagName, className) {
    var element = document.createElement(tagName);
    element.classList.add(Integrations.IntegrationService.affix + '-' + tagName.toLowerCase());
    if (className) {
        element.classList.add(className);
    }
    return element;
}

$$.all = function (selector: string, element?: NodeSelector) {
    element = element || document;
    var nodeList = element.querySelectorAll(selector);
    var result = <Element[]>[];
    for (var i = nodeList.length - 1; i >= 0; i--) {
        result[i] = nodeList[i];
    }
    return result;
}

$$.select = function (selector: any, element?: NodeSelector) {
    element = element || document;

    var selectors = [];
    if (typeof selector == 'function') {
        selectors = selectors.concat(selector());
    } else {
        selectors = selectors.concat(selector);
    }

    var result = <Element[]>[];
    selectors.forEach((selector) => {
        var nodeList = element.querySelectorAll(selector);
        for (var i = 0, size = nodeList.length; i < size; i++) {
            result.push(nodeList[i]);
        }
    });

    return result;
}

$$.visible = function (selector: string, element?: NodeSelector) {
    return $$(selector, element, el => {
        while (el) {
            if (el === document.body) {
                return true;
            }
            if (!el || el.style.display === 'none' || el.style.visibility === 'hidden') {
                return false;
            }
            el = el.parentElement;
        }
        return false;
    });
}

$$.closest = function (selector: string, element: HTMLElement) {
    var results = $$.all(selector);
    while (element) {
        if (results.indexOf(element) >= 0) {
            return element;
        }
        element = element.parentElement;
    }
}

$$.getAttribute = function (selector: string, attributeName: string, element?: NodeSelector): string {
    var result: string;
    var child = $$(selector, element);
    if (child) {
        result = child.getAttribute(attributeName);
    }
    return result || '';
}

$$.getRelativeUrl = function (baseUrl: string, url: string) {

    if (!url) {
        console.error('Url is not specified.');
        url = '/';
    }
    else if (!baseUrl) {
        console.error('Base url is not specified.');
    }
    else {

        if (baseUrl[baseUrl.length - 1] != '/') {
            baseUrl += '/';
        }

        if (url.indexOf(baseUrl) == 0) {
            url = '/' + url.substring(baseUrl.length);
        }
    }
    return url;
}
export class DomHelper {
    static div(className, target, html) {
        const el = document.createElement('div');
        el.className = className;

        if (html) {
            el.innerHTML = html;
        }

        if (target) {
            target.appendChild(el);
        }

        return el;
    }

    static svg(tag, target, className) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        if (className) {
            el.setAttribute('class', className);
        }

        if (target) {
            target.appendChild(el);
        }
        return el;
    }

    static style(target, html) {
        const el = document.createElement('style');

        if (html) {
            el.innerHTML = html;
        }

        if (target) {
            target.appendChild(el);
        }

        return el;
    }
}

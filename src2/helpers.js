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

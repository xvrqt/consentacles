/* {{ name }} Web Component */

export class {{ name }} extends HTMLElement {
    /* Interface */
    private _hello = "girls!";

    /* State */
    private tentacle = true;

    private shadow: DocumentFragment = null;

    /* Minified styles injected here */
    private static html = `[ inject-inline {{ name }}.html ]`;
    private static styles = `[ inject-inline {{ name }}.css ]`;

    constructor() {
        super();

        /* Attach Shadow Root */
        this.shadow = this.attachShadow({mode: 'open'});

        /* Add Styling */
        const style = document.createElement('style');
        style.innerHTML = {{ name }}.styles;
        this.shadow.appendChild(style);

        /* Add HTML */
        this.shadow.insertAdjacentHTML('beforeend', {{ name }}.html);
    }

    /* Called each time the element is connected to the document */
    connectedCallback() {
        this.greeter();
    }

    /* Called each time the element is disconnect to the document */
    disconnectedCallback() {
        console.log(`{{ name }} disconnected from the DOM`);
    }

    /* Called each time the element is moved to a new document */
    adoptedCallback() {
        console.log(`{{ name }} moved`);
    }

    /* METHODS */
    greeter(): void {
        console.log(`${this._hello}`);
    }

    /* SETTERS & GETTERS */
    get hello() {
        return this._hello;
    }

    set hello(str: string) {
        this.setAttribute('hello', str);
    }

    /* Reflexive Attributes */
    static get observedAttributes() {
        return ['hello'];
    }

    attributeChangedCallback(name: string, old_val: string, new_val: string): void {
        switch (name) {
            case 'hello':
                this._hello = new_val;
                break;
            default:
                console.warn(`[{{ name }}] Attribute '${name}' set but does not exist on {{ name }}`);
        }
    }
}

/* Self register the element */
try {
    window.customElements.define("{{ name }}", {{ name }});
} catch(e) {
    console.warn(`Custom Element {{ name }} already registered`);
}

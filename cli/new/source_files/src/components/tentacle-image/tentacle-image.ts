/* TentacleImage
 * Usage: <tentacle-image src="<src>" | formats="[png|webp|jpg|jpeg|gif]" sizes="[1,2,3]" default="<src>" loading open></>
 *
 * TentacleImage is a <picture> tag replacement that allows for neater HTML by
 * allowing you to specify the formats and sizes you support without having to 
 * enumerate all the sources.
 * 
 * TentacleImage also provides an optional default image incase the specified
 * image fails to load, and an optional loading screen while the image loads.
*/

/* Used to keep track of where a bubble is located on the canvas */

/* The eponymous web component */
class TentacleImage extends HTMLElement {
    /* Elements */
    private picture: HTMLPictureElement = null;

    /* State */
    private _src: string = null;

    /* Minified styles injected here */
    // private static styles = `[ inject-inline tentacle-image.css ]`;

    constructor() {
        super();

        /* Add Picture Element */
        this.picture = document.createElement('picture');
        this.appendChild(this.picture);

        /* Add image element */
        const img = new Image();
        img.src = this.getAttribute('src');
        this.picture.appendChild(img);
    }

    connectedCallback() {
       
    }

    /* Displays a loading screen when called */
    displayLoading(): void {

    }

    /* Displays the default image */
    displayDefault(): void {

    }


    /* SETTERS & GETTERS */
    get src(): string {
        return this._src;
    }

    set src(val: string) {
        this.setAttribute('src', val);
    }

    /* Reflexive Attributes */
    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name: string, old_val: string, new_val: string): void {
        switch (name) {
            case 'src':
                this._src = new_val;
                break;
            default:
                console.warn(`[TentacleImage] Attribute '${name}' set but does not exist on BubbleBackground`);
        }
    }
}

/* Self register the element */
try {
    window.customElements.define("tentacle-image", TentacleImage);
} catch(e) {
    console.warn(`TentacleImage Custom Element already exists`);
}

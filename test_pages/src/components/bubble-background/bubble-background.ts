/* BubbleBackground
 * Usage: <bubble-background number="X"><'/bubble-backgroung>
 * Adds a canvas to the DOM that expands to fill the width and height of the
 * parent. Draws up to X number of bubbles of different sizes that float toward
 * the top of the screen.
 *
 * Recommended to add a radial gradient to the parent element to give a 'deep
 * sea' look.
 * Example:
 * body { background: radial-gradient(circle, #04619F 0%, #111 95%); }
*/

/* Used to keep track of where a bubble is located on the canvas */
interface Point {
    x: number;
    y: number;
}

/* Bubbles! */
class Bubble {
  public point: Point = {x: 0, y: 0};
  public speed: number;
  public radius: number;
  public opacity: number;

  constructor() {
    this.randomize(true);
  }

  randomize(first_time: boolean = false): void {
    /* Coordinates are a % of page width/height */
    this.point.x = Math.random();
    this.point.y = Math.random();

    /* On subsequent randomizations, start below the page */
    if(!first_time) {
        this.point.y = 1 + (this.point.y / 10);
    }
    
    /* Speed ranges from 0.25% to 1.5% of page height per frame */
    this.speed = (Math.random() + 0.25) / 100;

    /* Bubbles range from 0 to 3% of the page width in radius, this calculation
     * done in the BubbleBackground element since it knows the dimensions of the 
     * canvas.
    */
    this.radius = Math.random();

    /* Opacity ranges from 0 to 10% */
    this.opacity = Math.random() / 10;
  }
}

/* The eponymous web component */
class BubbleBackground extends HTMLElement {
    private shadow: DocumentFragment = null;

    /* Canvas */
    private ctx: CanvasRenderingContext2D = null;
    private canvas: HTMLCanvasElement = null;

    /* State */
    private bubbles: Array<Bubble> = [];
    private _number: number = 300;

    /* Minified styles injected here */
    private static styles = `[ inject-inline bubble-background.css ]`;

    constructor() {
        super();

        /* Attach Shadow Root */
        this.shadow = this.attachShadow({mode: 'open'});

        /* Add Styling */
        const style = document.createElement('style');
        style.innerHTML = BubbleBackground.styles;
        this.shadow.appendChild(style);

        /* Add Canvas */
        this.canvas = document.createElement('canvas');
        this.ctx    = this.canvas.getContext('2d');
        this.shadow.appendChild(this.canvas);

        /* Resize the canvas when the window resizes */
        window.onresize = this.matchResolution;
    }

    connectedCallback() {
        /* Size the canvas correctly */
        this.matchResolution();

        /* Create the bubbles */
        for(let i = 0; i < this._number; i++) {
            this.bubbles.push(new Bubble());
        }

        /* Begin rendering */
        this.render();
    }

    /* Sets the resolution of the canvas to the window's viewport */
    matchResolution(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /* Draws the bubbles to the canvas and updates their positions */
    drawBubbles(bubbles: Array<Bubble>, ctx: CanvasRenderingContext2D): void {
        /* Clear the canvas */
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        /* When shapes overlap, their RGB values are _added_ */
        ctx.globalCompositeOperation = 'lighter';

        bubbles.forEach((bubble, index) => {
            const x = bubble.point.x * this.canvas.width;
            const y = bubble.point.y * this.canvas.height;
            const r = bubble.radius * (0.03 * Math.min(this.canvas.width, 300));

            /* Render the bubble */
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
            ctx.arc(x, y, r, 0, (Math.PI * 2), false);
            ctx.fill();

            /* Replace the bubble when it leaves the view */
            if(bubble.point.y < -0.05) {
                bubble.randomize(); 
            } else {    
                /* Update the bubble's position */
                bubble.point.y -= bubble.speed;
            }
        });
    }
    
    /* Begin the animation loop */
    render(): void {
        requestAnimationFrame(() => {
            this.render();
        });
        this.drawBubbles(this.bubbles, this.ctx);
    }

    /* SETTERS & GETTERS */
    get number() {
        return this._number;
    }

    set number(val: number) {
        this.setAttribute('number', val.toString());
    }

    /* Reflexive Attributes */
    static get observedAttributes() {
        return ['number'];
    }

    attributeChangedCallback(name: string, old_val: string, new_val: string): void {
        switch (name) {
            case 'number':
                this._number = Math.min(Math.max(0, Number(new_val)), 500);
                break;
            default:
                console.warn(`[BubbleBackground] Attribute '${name}' set but does not exist on BubbleBackground`);
        }
    }
}

/* Self register the element */
try {
    window.customElements.define("bubble-background", BubbleBackground);
} catch(e) {
    console.warn(`BubbleBackground Custom Element already exists`);
}

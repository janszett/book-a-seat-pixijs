  <template>
  <div class="molecule-seat-map">
    <div ref="pixiStage" class="pixi-stage">
    </div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

const CATEGORYCOLORS = ['0xcccc00', '0x990000', '0x3333ff', '0x009900'];
const SEATBLOCKS = [
  { x: 0, y: 0, w: 770, h: 480 },
  { x: 0, y: 500, w: 770, h: 480 },
  { x: 0, y: 1000, w: 770, h: 480 }
];
const MINZOOM = 0.8;

export default {
  name: 'MoleculeSeatMapPixi',
  data () {
    return {
      seats: [],
      bounds: null,
      loading: false
    };
  },

  mounted () {
    this.app = new PIXI.Application({
      autoresize: true,
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      resizeTo: this.$refs.pixiStage
    });

    this.app.view.style.textAlign = 'center';
    this.$refs.pixiStage.appendChild(this.app.view);
    this.viewport = this.app.stage.addChild(new Viewport({ screenWidth: this.app.view.offsetWidth, screenHeight: this.app.view.offsetHeight }));

    this.updateCanvas();
    this.viewport
      .moveCenter(200, 800)
      .setZoom(0.3, true)
      .drag()
      .pinch()
      .wheel()
      .decelerate()
      .on('moved-end', this.updateBounds);

    this.viewport.clampZoom({ minScale: 0.2, maxScale: 3 });
  },

  methods: {
    async updateBounds () {
      if (!this.viewport) return;

      this.bounds = {
        xMin: this.viewport.hitArea.x,
        yMin: this.viewport.hitArea.y,
        xMax: this.viewport.hitArea.x + this.viewport.hitArea.width,
        yMax: this.viewport.hitArea.y + this.viewport.hitArea.height
      };

      if (this.viewport.scale.x > MINZOOM) {
        await this.loadSeats();
      } else {
        this.seats = [];
      }
      this.updateCanvas();
    },

    async loadSeats () {
      if (this.loading) return;
      this.loading = true;
      this.seats = await fetch(`${process.env.apiEndpointSeats}?xMin=${this.bounds.xMin}0&xMax=${this.bounds.xMax}&yMin=${this.bounds.yMin}0&yMax=${this.bounds.yMax}`).then(res => res.json());
      this.loading = false;
      this.updateCanvas();
    },

    updateCanvas () {
      this.clearStage();
      this.drawSeatBlockOutlines();
      this.drawTooltips();
      this.drawCircles();
      this.drawStage();
    },

    drawCircles () {
      this.seats.forEach(seat => this.drawSingleCircle(seat));
    },

    clearStage () {
      while (this.viewport.children[0]) {
        this.viewport.removeChild(this.viewport.children[0]);
      }
    },

    drawSingleCircle (seat) {
      const r = 20;
      const { x, y, category, status } = seat;
      const circle = new PIXI.Graphics();
      const color = status ? this.getCategoryColor(category) : '0x888888';

      // circle shape
      circle.beginFill(color);
      circle.drawCircle(x, y, r);
      circle.endFill();
      circle.alpha = 0.5;
      circle.interactive = Boolean(status);
      circle.hitArea = new PIXI.Circle(x, y, r);
      circle.buttonMode = Boolean(status);
      circle.id = seat.id;
      circle.block = seat.block;
      circle.category = category;

      // circle label
      const text = new PIXI.Text(seat.id, { fontFamily: 'Arial', fontSize: 10, fill: 0x001010, align: 'center' });
      text.anchor.set(0.5);
      text.x = x;
      text.y = y;

      circle.mouseover = () => {
        circle.alpha = 1;
      };
      circle.mouseout = () => {
        circle.alpha = 0.5;
      };
      circle.pointerdown = (e) => {
        console.log(`Block ${e.target.block}, Seat ${e.target.id}, Category ${e.target.category}`);
      };

      this.viewport.addChild(circle);
      this.viewport.addChild(text);
    },

    drawStage () {
      const stage = new PIXI.Graphics();
      stage.lineStyle(4, 0x000000);
      stage.drawRect(-350, 100, 100, 1300);

      const text = new PIXI.Text('STAGE', { fontFamily: 'Arial', fontSize: 60, fill: 0xff1010, align: 'center' });
      text.anchor.set(0.5);
      text.x = -300;
      text.y = 760;
      text.angle = -90;

      this.viewport.addChild(stage);
      this.viewport.addChild(text);
    },

    drawTooltips () {
      if (this.seats.length) return;
      const text = new PIXI.Text('Zoom in to book a seat', { fontFamily: 'Arial', fontSize: 60, fill: '0x333333', align: 'center' });
      text.anchor.set(0.5);
      text.x = 370;
      text.y = 750;
      this.viewport.addChild(text);
    },

    drawSeatBlockOutlines () {
      SEATBLOCKS.forEach(seatblock => {
        const block = new PIXI.Graphics();
        const { x, y, w, h } = seatblock;
        block.beginFill(0xeeeeee);
        block.lineStyle(2, 0x000000);
        block.drawRect(x, y, w, h);
        this.viewport.addChild(block);
      });
    },

    getCategoryColor (i) {
      return CATEGORYCOLORS[Number(i - 1)];
    }
  }
};

</script>

<style lang="postcss" scoped>
  .molecule-seat-map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    touch-action: none;

    & .pixi-stage {
      width: 100%;
      height: 100%;
      min-height: 300px;
    }
  }

</style>

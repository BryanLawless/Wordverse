<template>
	<canvas
		id="canvas"
		@mousedown="down($event, 'mouse')"
		@mouseup="up($event, 'mouse')"
		@mousemove="move($event, 'mouse')"
		@mouseout="up($event, 'mouse')"
		@touchstart="down($event, 'touch')"
		@touchend="up($event, 'touch')"
		@touchmove="move($event, 'touch')"
		@touchcancel="up($event, 'touch')"
		ref="canvasElement"></canvas>
	<div
		v-if="!props.disabled"
		class="flex flex-row gap-5 mt-5 items-center justify-center">
		<div v-for="color in colors">
			<input
				type="radio"
				class="color-select"
				:name="`color`"
				:style="{ backgroundColor: color }"
				:value="color"
				v-model="state.color" />
		</div>
	</div>
	<div
		v-if="!props.disabled"
		class="flex flex-row gap-5 mt-5 items-center justify-center">
		<div v-for="color in colors2">
			<input
				type="radio"
				class="color-select"
				:name="`color`"
				:style="{ backgroundColor: color }"
				:value="color"
				v-model="state.color" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch, reactive, onMounted } from 'vue';

const emit = defineEmits(['drawing']);

const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();

const state = reactive({
	isDrawing: false,
	current: { x: 0, y: 0 },
	canvas: undefined as HTMLCanvasElement | undefined,
	context: null as CanvasRenderingContext2D | null,
	color: '#ffffff',
	brushSize: 5,
	resize: false,
	lines: [] as any[],
	canvasClass: ''
});

const props = defineProps({
	drawData: {
		type: Object,
		required: false
	},
	disabled: {
		type: Boolean,
		required: false
	},
	undo: {
		type: Boolean,
		required: false
	},
	clear: {
		type: Boolean,
		required: false
	},
	save: {
		type: Boolean,
		required: false
	},
	setUndo: {
		type: Function,
		required: true
	},
	setClear: {
		type: Function,
		required: true
	},
	setSave: {
		type: Function,
		required: true
	},
	width: {
		type: Number,
		required: true
	},
	height: {
		type: Number,
		required: true
	}
});

const colors = [
	'#fc0341',
	'#fc7703',
	'#fcfc03',
	'#00FF37',
	'#03FCFA',
	'#038cfc',
	'#743ad5',
	'#AD00FF',
	'#f403fc',
	'#FF00CA',
	'#6F2f00',
	'#888888',
	'#ffffff'
];
const colors2 = [
	'#990000',
	'#993300',
	'#999900',
	'#009901',
	'#009997',
	'#004499',
	'#541ab5',
	'#7D00cc',
	'#800089',
	'#990097',
	'#3f1e00',
	'#222222',
	'#000000'
];

watch(
	() => props.save,
	() => {
		let canvas = canvasElement.value;

		let link = document.createElement('a');
		link.download = 'drawing.png';
		link.href = canvas!.toDataURL('image/png');
		link.click();

		props.setSave(false);
	}
);

onMounted(() => renderCanvas());

watch(
	() => props.drawData,
	(newDrawData) => {
		state.lines = [...state.lines, newDrawData];

		drawLine(
			newDrawData!.x0 * props.width,
			newDrawData!.y0 * props.height,
			newDrawData!.x1 * props.width,
			newDrawData!.y1 * props.height,
			false,
			newDrawData!.c,
			newDrawData!.l
		);
	}
);

watch(
	() => props.width,
	() => {
		renderCanvas();
	}
);

watch(
	() => props.undo,
	(newUndo) => {
		if (newUndo) {
			state.lines = state.lines.slice(0, -15);
			renderCanvas();
			props.setUndo(false);
		}
	}
);

watch(
	() => props.clear,
	(newClear) => {
		if (newClear) {
			state.lines = [];
			renderCanvas();
			props.setClear(false);
		}
	}
);

function renderCanvas() {
	var canvas = canvasElement.value;
	var width = document.querySelector('#canvas')!.clientWidth;
	var height = document.querySelector('#canvas')!.clientHeight;
	canvas!.width = props.width;
	canvas!.height = props.height;
	canvas!.style.width = `${props.width}px`;
	canvas!.style.height = `${props.height}px`;
	state.canvas = canvas;
	state.context = canvas!.getContext('2d');
	state.current = { x: 0, y: 0 };
	state.isDrawing = false;

	if (state.lines) {
		state.lines.map((data) => {
			drawLine(
				data.x0 * width,
				data.y0 * height,
				data.x1 * width,
				data.y1 * height,
				false,
				data.c,
				data.l
			);

			return true;
		});
	}
}

function drawLine(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	emits: boolean,
	color: string,
	l: number
): void {
	if (state.context !== null) {
		const c = state.context as CanvasRenderingContext2D;

		c.beginPath();
		c.moveTo(x0, y0);
		c.lineTo(x1, y1);
		c.lineCap = 'round';
		c.strokeStyle = color;
		c.lineWidth = l;
		c.stroke();
		c.closePath();
	}

	if (emits) {
		let data = {
			x0: x0 / props.width,
			y0: y0 / props.height,
			x1: x1 / props.width,
			y1: y1 / props.height,
			c: color,
			l: l
		};

		state.lines = [...state.lines, data];

		emit('drawing', data);
	}
}

function down(event: any, type: string) {
	if (props.disabled) {
		return;
	}

	let clientX;
	let clientY;
	if (type === 'mouse') {
		clientX = event.clientX;
		clientY = event.clientY;
	} else {
		event.preventDefault();
		clientX = event.touches[0].clientX;
		clientY = event.touches[0].clientY;
	}

	const canvasDom = document.querySelector('#canvas')!.getBoundingClientRect();
	const x = clientX - canvasDom.left;
	const y = clientY - canvasDom.top;

	state.current = { x: x, y: y };
	state.isDrawing = true;
}

function move(event: any, type: string) {
	if (!state.isDrawing || props.disabled) {
		return;
	}

	let clientX;
	let clientY;
	let x, y;
	const canvasDom = document.querySelector('#canvas')!.getBoundingClientRect();
	if (type === 'mouse') {
		clientX = event.clientX;
		clientY = event.clientY;
		x = clientX - canvasDom.left;
		y = clientY - canvasDom.top;

		drawLine(
			state.current.x,
			state.current.y,
			x,
			y,
			true,
			state.color,
			state.brushSize
		);
	} else {
		event.preventDefault();
		clientX = event.touches[0].clientX;
		clientY = event.touches[0].clientY;
		x = clientX - canvasDom.left;
		y = clientY - canvasDom.top;
		drawLine(
			state.current.x,
			state.current.y,
			x,
			y,
			true,
			state.color,
			state.brushSize
		);
	}

	state.current = { x: x, y: y };
	state.isDrawing = true;
}

function up(event: any, type: string) {
	if (!state.isDrawing || props.disabled) {
		return;
	}

	let clientX;
	let clientY;
	let x, y;
	const canvasDom = document.querySelector('#canvas')!.getBoundingClientRect();
	if (type === 'mouse') {
		clientX = event.clientX;
		clientY = event.clientY;
		x = clientX - canvasDom.left;
		y = clientY - canvasDom.top;
		drawLine(
			state.current.x,
			state.current.y,
			x,
			y,
			true,
			state.color,
			state.brushSize
		);
	} else {
		event.preventDefault();
		if (event.touches[0] !== undefined) {
			clientX = event.touches[0].clientX;
			clientY = event.touches[0].clientY;
			x = clientX - canvasDom.left;
			y = clientY - canvasDom.top;
			drawLine(
				state.current.x,
				state.current.y,
				x,
				y,
				true,
				state.color,
				state.brushSize
			);
		}
	}

	state.isDrawing = false;
}
</script>

<style lang="css" scoped>
#canvas {
	width: 100%;
	height: 50vh;
	border-radius: 1rem;
	border: 5px solid #7d5afa;
	background-color: #15141a;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

#canvas::selection {
	background-color: transparent;
}

#canvas::moz-selection {
	background-color: transparent;
}

#canvas::webkit-selection {
	background-color: transparent;
}

.color-select {
	-webkit-appearance: none;
	appearance: none;
	transform: scale(2);
	font: inherit;
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	transform: translateY(-0.075em);
}

.color-select::before {
	content: '';
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	transform: scale(0);
	transition: 120ms transform ease-in-out;
}

.color-select:checked {
	outline: max(2px, 0.15em) solid #fff;
	outline-offset: max(3px);
}
</style>

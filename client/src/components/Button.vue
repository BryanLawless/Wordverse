<template>
	<button class="btn">
		<span class="edge"></span>
		<span class="front" :class="btnSize"><i v-if="props.icon" :class="props.icon"></i> {{
			props.text
		}}</span>
	</button>
</template>

<script setup>
const props = defineProps({
	text: {
		type: String,
		required: true
	},
	icon: {
		type: String,
		required: false
	},
	size: {
		type: String,
		required: false,
	}
});

var btnSize;
switch (props.size) {
	case 'small':
		btnSize = 'btn-small';
		break;
	case 'large':
		btnSize = 'btn-large';
		break;
	default:
		btnSize = 'btn-regular';
		break;
}
</script>

<style lang="css" scoped>
.btn {
	position: relative;
	border: none;
	background: transparent;
	padding: 0;
	cursor: pointer;
	outline-offset: 4px;
	transition: filter 250ms;
}

.edge {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 1rem;
	background: #dbae86;
}

.front {
	display: block;
	position: relative;
	border-radius: 1rem;
	font-size: 1.25rem;
	color: #592e2e;
	background: #fefb75;
	will-change: transform;
	transform: translateY(-4px);
	transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

.btn:hover {
	filter: brightness(110%);
}

.btn:hover .front {
	transform: translateY(-6px);
	transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
}

.btn:active .front {
	transform: translateY(-2px);
	transition: transform 34ms;
}

.btn:focus:not(:focus-visible) {
	outline: none;
}

.btn-small {
	padding: 0.75rem 1.25rem;
}

.btn-regular {
	padding: 1rem 2.5rem;
}

.btn-large {
	font-size: 1.5rem;
	padding: 1.5rem 5rem;
}
</style>
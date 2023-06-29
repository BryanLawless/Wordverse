<template>
	<button class="btn" :class="[btnSize, btnType]">
		<i v-if="props.icon" :class="props.icon"></i>
		<span v-if="props.text">{{ ' ' + props.text }}</span>
	</button>
</template>

<script lang="ts" setup>
const props = defineProps({
	text: {
		type: String,
		required: false
	},
	icon: {
		type: String,
		required: false
	},
	size: {
		type: String,
		required: false
	},
	variant: {
		type: String,
		required: false,
		default: 'primary'
	}
});

let btnType;
switch (props.variant) {
	case 'primary':
		btnType = 'btn-primary';
		break;
	case 'invert':
		btnType = 'btn-invert';
		break;
	default:
		btnType = '';
		break;
}

let btnSize;
switch (props.size) {
	case 'small':
		btnSize = 'btn-small';
		break;
	case 'icon':
		btnSize = 'btn-icon';
		break;
	case 'fit':
		btnSize = 'btn-fit';
		break;
}
</script>

<style lang="css" scoped>
.btn {
	padding: 6px 12px;
	text-transform: uppercase;
	font-weight: bold;
	font-size: 30px;
	border-radius: 1.5rem;
	width: 25rem;
	height: 6rem;
	transition: 0.1s;
	text-align: center;
}

.btn-primary {
	color: #7d5afa;
	background-color: #15141a;
	border: 0.4rem solid #7d5afa;
}

.btn-primary:hover {
	background-color: #7d5afa;
	color: #15141a;
}

.btn-invert {
	color: #15141a;
	background-color: #7d5afa;
	border: 0.4rem solid #15141a;
}

.btn-invert:hover {
	background-color: #15141a;
	color: #7d5afa;
}

.btn-icon {
	height: 5.5rem;
	width: 6.5rem;
}

.btn-fit {
	width: 100%;
}
</style>

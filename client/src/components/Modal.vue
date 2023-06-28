<template>
	<transition name="fade" appear>
		<div
			class="modal-overlay"
			v-if="props.show"
			@click="clickOutsideClose"></div>
	</transition>
	<transition name="pop" appear>
		<div class="modal" role="dialog" v-if="props.show">
			<slot name="heading"></slot>
			<slot name="content"></slot>

			<Button
				v-if="showClose"
				@click="emit('close')"
				class="mt-5"
				text="Close"
				variant="invert" />
		</div>
	</transition>
</template>

<script lang="ts" setup>
import Button from '@/components/Button.vue';

const emit = defineEmits(['close']);

const props = defineProps({
	show: {
		type: Boolean,
		required: true
	},
	showClose: {
		type: Boolean,
		default: true
	},
	clickOutsideClose: {
		type: Boolean,
		default: true
	}
});

function clickOutsideClose() {
	if (props.clickOutsideClose) emit('close');
}
</script>

<style lang="css" scoped>
.modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	text-align: center;
	width: fit-content;
	height: fit-content;
	max-width: 45rem;
	padding: 4rem;
	border-radius: 1rem;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
	background: #7d5afa;
	z-index: 999;
	transform: none;
	color: #15141a;
}

.modal-overlay {
	content: '';
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 999;
	background: #2c2c39;
	opacity: 0.6;
	cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s linear;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
	transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
	opacity: 0;
	transform: scale(0.3) translateY(-50%);
}
</style>

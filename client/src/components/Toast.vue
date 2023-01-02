<template>
	<div class="toast" :style="toastColors">
		<div class="toast-content">
			<i v-if="props.toast.type == 'success'" class="fa-solid fa-check"></i>
			<i v-else-if="props.toast.type == 'error'" class="fa-solid fa-x"></i>
			<div class="message">
				<span class="text text-1">{{ props.toast.title }}</span>
				<span v-if="props.toast.message.length" class="text text-2">{{ props.toast.message }}</span>
			</div>
		</div>

		<i class="fa-solid fa-xmark close" @click="closeToast()"></i>
	</div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useToastStore } from '@/stores/Toast';

const toastStore = useToastStore();

let toast;
const props = defineProps({
	toast: {
		type: Object,
		required: true,
	}
});

const toastColors = computed(() => {
	return props.toast.type === 'success' ? { '--toast-color': '#40f4a0' } :
		(props.toast.type === 'error' ? ({ '--toast-color': '#f44051' }) : ({ '--toast-color': '#4070f4' }));
});

onMounted(() => {
	toast = document.querySelector('.toast');
	toast.classList.add('active');
});

function closeToast() {
	toastStore.removeToast(props.toast.title);
	toast.classList.remove("active");
}
</script>

<style lang="css" scoped>
.toast {
	position: absolute;
	top: 1.5625rem;
	right: 1.875rem;
	border-radius: 12px;
	background: var(--toast-color);
	padding: 20px 35px 20px 25px;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	transform: translateX(calc(100% + 30px));
	transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.35);
}

.toast.active {
	transform: translateX(0%);
}

.toast .toast-content {
	display: flex;
	align-items: center;
}

.toast-content .check {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 35px;
	width: 35px;
	background-color: var(--toast-color);
	color: #fff;
	font-size: 20px;
	border-radius: 50%;
}

.toast-content .message {
	display: flex;
	flex-direction: column;
	margin: 0 20px;
}

.message .text {
	font-size: 20px;
	font-weight: 400;
	;
	color: #fff;
}

.message .text.text-1 {
	font-weight: 600;
	color: #fff;
}

.toast .close {
	position: absolute;
	top: 10px;
	right: 15px;
	padding: 5px;
	cursor: pointer;
	opacity: 0.7;
}

.toast .close:hover {
	opacity: 1;
}
</style>
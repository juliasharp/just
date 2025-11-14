<script setup lang="ts">
import LogoSVG from '/src/just-logo-res.svg?component';

import type { PropType } from 'vue';
const props = defineProps({
	showForm: {
		type: Boolean,
		default: false
	},
	variant: {
		type: String as PropType<'default' | 'custom'>,
		default: 'default'
	}
});


const emit = defineEmits<{
  (e: 'update:showForm', value: boolean): void;
}>();

const isShown = computed({
  get() {
    return props.showForm;
  },
  set(value: boolean) {
    emit('update:showForm', value);
  }
});

</script>

<template>
	<div class="header flex">
		<div class="logo">
			<LogoSVG></LogoSVG>
		</div>
		<div class="header-right">
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header {
	&-right {
		position: fixed;
		right: 0px;
		z-index: 99;
	}
}

.logo {
	position: absolute;
	margin-top: 20px;
	margin-left: 20px;
	width: 125px;
	@media (min-width: 768px) {
		margin-top: 35px;
		margin-left: 35px;
		width: 160px;
	}
	//transform: translate3d(0 -50%, 0);
	mix-blend-mode: difference;
	z-index: 99;
	svg * {
		fill: currentColor;
	}
}

.mail-button {
	margin-top: 25px;
	margin-right: 25px;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: transparent;
	display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
	color: #fff;
	mix-blend-mode: difference;
	@media (max-width: 760px) {
		margin-top: 20px;
		margin-right: 20px;
	}
	svg * {
    fill: currentColor;
	}
	&:hover {
		background: black;
		mix-blend-mode: difference;
		svg {
			transform: scale(0.666);
			z-index: 1;
			path {
				fill: white;
			}
		}
	}
}
</style>
<script setup lang="ts">
import LogoSVG from '/src/logo.svg?component';
import MailSVG from '/src/mail.svg?component';

const props = defineProps({
	showForm: {
		type: Boolean,
		default: false
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

function showContact() {
  isShown.value = true;
}

</script>

<template>
	<div class="header flex">
		<div class="logo animate-in">
			<!-- <LogoSVG></LogoSVG> -->
		</div>
		<div class="header-right">
			<button class="button mail-button animate-in" shape="circle" @click="showContact">
				<MailSVG></MailSVG>
			</button>
		</div>
	</div>
</template>

<style lang="scss">
.header {
	&-right {
		position: fixed;
		right: 0px;
		z-index: 99;
	}
}

.logo {
	position: fixed;
	margin-top: 35px;
	padding: 0 20px;
	color: #fff;
	//transform: translate3d(0 -50%, 0);
	mix-blend-mode: difference;
	width: 140px;
	z-index: 99;
	svg * {
		fill: currentColor;
	}
}

.mail-button {
	margin-top: 35px;
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
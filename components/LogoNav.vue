<script setup lang="ts">
import LogoSVG from '/src/just-logo-res.svg?component';
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

</script>

<template>
	<div class="header flex">
		<div class="logo animate-in">
			<LogoSVG></LogoSVG>
		</div>
		<div class="header-right">
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header {
	position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  display: flex;
	// &-right {
	// 	position: fixed;
	// 	right: 0px;
	// 	z-index: 99;
	// }
}

.logo {
	position: sticky;
	top: 30px;
	left: 30px;
	color: #fff;
	mix-blend-mode: difference;
	width: 140px;
	width: 135px;
	z-index: 99;
	@media (min-width: 768px) {
		top: 35px;
		left: 35px;
		width: 160px;
	}
	svg * {
		fill: currentColor;
	}
}

:global(html.logo-fixed-in-hero) .logo {
  position: fixed;
  top: 30px;
  left: 30px;
  margin-top: 0;
  margin-left: 0;

  @media (min-width: 768px) {
    top: 35px;
    left: 35px;
  }
}
</style>
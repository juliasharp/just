import { onMounted, onBeforeUnmount, unref, Ref } from 'vue';

export default function useClickOutside(target: Ref, callback: () => void) {
  const listener = (e: Event) => {
    const el = unref(target);

    if (!el || e.target === el || e.composedPath().includes(el)) {
      return;
    }

    if (typeof callback === 'function') {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener('click', listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
  });

  return () => {
    window.removeEventListener('click', listener);
  };
}
// ~/composables/useLogoVisibility.ts
import { ref, watch } from 'vue'

const _isLogoHidden = ref(false)

if (process.client) {
  watch(
    _isLogoHidden,
    (v) => {
      console.log('[useLogoVisibility] isLogoHidden ->', v)
    },
    { immediate: true }
  )
}

export function useLogoVisibility() {
  console.log('[useLogoVisibility] composable used')
  return {
    isLogoHidden: _isLogoHidden,
  }
}

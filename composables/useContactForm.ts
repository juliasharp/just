export const useContactForm = () =>
  useState<boolean>('contactFormOpen', () => false)
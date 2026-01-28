// composables/useGfFormFields.ts
type GfInput = { id: string; label?: string | null }
type GfNode = {
  __typename: string
  databaseId: number
  type: string
  label?: string | null
  isRequired?: boolean | null
  inputs?: GfInput[] | null
}
export type ContactField = {
  key: string                 // local key for v-model
  label: string               // UI label
  gfKey: string               // "input_2" or "input_1.3"
  type?: 'text' | 'email' | 'tel' | 'textarea'
  required?: boolean
  autocomplete?: string
}

const GQL = /* GraphQL */ `
query GetResidentialForm($id: ID!) {
  gfForm(id: $id, idType: DATABASE_ID) {
    databaseId
    title
    formFields {
      nodes {
        __typename
        databaseId
        type

        ... on NameField {
          label
          isRequired
          inputs { id label } 
        }

        ... on EmailField {
          label
          isRequired
        }

        ... on PhoneField {
          label
          isRequired
        }

        ... on TextAreaField {
          label
          isRequired
        }
      }
    }
  }
}
`

function mapResidentialFields(nodes: GfNode[]): ContactField[] {
  const out: ContactField[] = []

  for (const f of nodes) {
    switch (f.__typename) {
      case 'NameField': {
        // Split Advanced Name into First/Last based on inputs
        const first = f.inputs?.find(i => /first/i.test(i.label || '')) || f.inputs?.[0]
        const last  = f.inputs?.find(i => /last/i.test(i.label || ''))  || f.inputs?.[1]

        if (first) {
          out.push({
            key: 'firstName',
            label: 'First name',
            gfKey: `input_${first.id}`,     // e.g., "input_1.3"
            type: 'text',
            required: !!f.isRequired,
            autocomplete: 'given-name'
          })
        }
        if (last) {
          out.push({
            key: 'lastName',
            label: 'Last name',
            gfKey: `input_${last.id}`,      // e.g., "input_1.6"
            type: 'text',
            required: !!f.isRequired,
            autocomplete: 'family-name'
          })
        }
        break
      }

      case 'EmailField':
        out.push({
          key: 'email',
          label: f.label || 'Email',
          gfKey: `input_${f.databaseId}`,
          type: 'email',
          required: !!f.isRequired,
          autocomplete: 'email'
        })
        break

      case 'PhoneField':
        out.push({
          key: 'phone',
          label: f.label || 'Phone',
          gfKey: `input_${f.databaseId}`,
          type: 'tel',
          required: !!f.isRequired,
          autocomplete: 'tel'
        })
        break

      case 'TextAreaField':
        out.push({
          key: 'message',
          label: f.label || 'Message',
          gfKey: `input_${f.databaseId}`,
          type: 'textarea',
          required: !!f.isRequired
        })
        break

      // Ignore submit buttons, etc.
      default:
        break
    }
  }

  return out
}

export function useGfFormFields(formDbId: number) {
  const { public: { wordpressUrl } } = useRuntimeConfig()

  // Fetch via WPGraphQL
  const { data, pending, error, refresh } = useFetch(wordpressUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { query: GQL, variables: { id: String(formDbId) } },
    // Return the form node only
    transform: (r: any) => r?.data?.gfForm || null
  })

  // Derived fields array suitable for ContactForm
  const fields = computed<ContactField[]>(() => {
    const nodes: GfNode[] = data.value?.formFields?.nodes || []
    return mapResidentialFields(nodes)
  })

  return { data, fields, pending, error, refresh }
}
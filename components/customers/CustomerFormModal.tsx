'use client'

import { useState, useTransition } from 'react'
import { createCustomerAction, updateCustomerAction } from '@/actions/customers'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'
import type { Customer } from '@/types/Customer'

export function CustomerFormModal({ open, onClose, customer }: {
  open: boolean; onClose: () => void; customer: Customer | null
}) {
  const isEdit = Boolean(customer)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = isEdit
        ? await updateCustomerAction(customer!.id, formData)
        : await createCustomerAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit customer' : 'Add customer'}>
      <form action={handleSubmit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <InputGroup id="customer_name" name="customer_name" label="Customer name" required defaultValue={customer?.customer_name} />
        <InputGroup id="customer_phone" name="customer_phone" label="Phone number" required defaultValue={customer?.customer_phone} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add customer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

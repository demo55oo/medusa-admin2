import { MoneyAmount, ProductVariant } from "@medusajs/medusa"
import React from "react"
import { Control, Controller, useForm } from "react-hook-form"
import Checkbox, { CheckboxProps } from "../../atoms/checkbox"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import RadioGroup from "../../organisms/radio-group"
import PriceAmount from "./price-amount"

const MODES = {
  APPLY_ALL: "all",
  SELECTED_ONLY: "selected",
}

type PriceOverridesType = {
  onClose: () => void
  prices: MoneyAmount[]
  variants: ProductVariant[]
  onSubmit: (data: any) => void
}

const PriceOverrides = ({
  onClose,
  prices,
  variants,
  onSubmit,
}: PriceOverridesType) => {
  const [mode, setMode] = React.useState(MODES.SELECTED_ONLY)
  const { handleSubmit, control } = useForm({
    defaultValues: {
      variants: [],
      prices,
    },
  })

  const onClick = handleSubmit(onSubmit)

  return (
    <>
      <Modal.Content isLargeModal={true}>
        <RadioGroup.Root
          value={mode}
          onValueChange={(value) => setMode(value)}
          className="pt-2 flex items-center"
        >
          <RadioGroup.SimpleItem
            value={MODES.SELECTED_ONLY}
            label="Apply overrides on selected variants"
          />
          <RadioGroup.SimpleItem
            value={MODES.APPLY_ALL}
            label="Apply on all variants"
          />
        </RadioGroup.Root>
        {mode === MODES.SELECTED_ONLY && (
          <div className="pt-6 flex flex-col gap-2">
            {variants.map((variant, idx) => (
              <div
                id={variant.id}
                className="py-2.5 px-3 border border-grey-20 rounded-rounded"
              >
                <ControlledCheckbox
                  control={control}
                  name="variants"
                  label={`${variant.title} (SKU: ${variant.sku})`}
                  id={variant.id}
                  index={idx}
                />
              </div>
            ))}
          </div>
        )}
        <div className="pt-8">
          <h6 className="inter-base-semibold">Prices</h6>
          <div className="pt-4">
            {prices.map((price, idx) => (
              <Controller
                control={control}
                name={`prices[${idx}]`}
                key={price.id}
                render={(field) => {
                  return (
                    <PriceAmount
                      value={field.value}
                      onChange={(amount) => {
                        field.onChange({
                          ...field.value,
                          amount,
                        })
                      }}
                    />
                  )
                }}
              />
            ))}
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer isLargeModal>
        <div className="flex w-full h-8 justify-end">
          <Button
            variant="ghost"
            className="mr-2 w-32 text-small justify-center rounded-rounded"
            size="large"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="large"
            className="text-small justify-center rounded-rounded"
            variant="primary"
            onClick={onClick}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

type ControlledCheckboxProps = {
  control: Control
  name: string
  id: string
  index: number
} & CheckboxProps

const ControlledCheckbox = ({
  control,
  name,
  id,
  index,
  ...props
}: ControlledCheckboxProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={(field) => {
        return (
          <Checkbox
            className="shrink-0 inter-small-regular"
            {...props}
            {...field}
            checked={field.value.some((value) => value === id)}
            onChange={(e) => {
              // copy field value
              const valueCopy = [...(field.value || [])]

              // update checkbox value
              valueCopy[index] = e.target.checked ? id : null

              // remove nulls from field value
              const cleanedValue = valueCopy.filter(Boolean)

              // update field value
              field.onChange(cleanedValue)
            }}
          />
        )
      }}
    />
  )
}

export default PriceOverrides

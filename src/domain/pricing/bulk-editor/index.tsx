import React, { useEffect, useState } from "react"
import clsx from "clsx"

import { useAdminRegions } from "medusa-react"
import { Product, ProductVariant, Region } from "@medusajs/medusa"

import Fade from "../../../components/atoms/fade-wrapper"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import NativeSelect from "../../../components/molecules/native-select"
import TableFieldsFilters from "../../../components/molecules/table-fileds-filter"
import TableSearch from "../../../components/molecules/table/table-search"
import { currencies } from "../../../utils/currencies"
import PriceInput from "../../../components/organisms/price-input"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"

function generateField(region: Region) {
  return {
    id: region.id,
    short: `Price: ${region.currency_code.toUpperCase()} (${region.name}) `,
    label: ({ isSelected }) => (
      <span className="text-small text-grey-50 truncate">
        <span className={clsx("text-grey-90", { "font-semibold": isSelected })}>
          {region.currency_code.toUpperCase()}:{" "}
        </span>
        ({region.name})
      </span>
    ),
  }
}

type PriceListBulkEditorHeaderProps = {
  setRegions: (a: string[]) => void
}

function PriceListBulkEditorHeader(props: PriceListBulkEditorHeaderProps) {
  const { setRegions } = props

  const { regions } = useAdminRegions()

  const fields = (regions || [])
    .sort((a, b) => a.currency_code.localeCompare(b.currency_code))
    .map((r) => generateField(r))

  return (
    <div className="flex justify-center my-[30px]">
      <div className="medium:w-8/12 w-full px-8 flex justify-between">
        <div className="flex items-start">
          <div className="flex shrink-0 items-center mt-1">
            <span className="text-small font-semibold text-grey-50">
              Price list:
            </span>

            <NativeSelect defaultValue="TODO 1">
              <NativeSelect.Item value="TODO 1">TODO 1</NativeSelect.Item>
              <NativeSelect.Item value="TODO 2">TODO 2</NativeSelect.Item>
            </NativeSelect>
          </div>

          <div className="ml-8">
            <TableFieldsFilters fields={fields} onChange={setRegions} />
          </div>
        </div>

        <div className="shrink-0">
          <TableSearch />
        </div>
      </div>
    </div>
  )
}

type TileProps = {
  className?: string
  children: React.ReactNode
}

function Tile(props: TileProps) {
  return (
    <div
      className={`
        border border-solid border-grey-20
        h-[40px]
        min-w-[314px]
        rounded-lg
        bg-grey-5
        text-gray-90
        text-small
        flex items-center
        pl-3
        ${props.className || ""}`}
    >
      {props.children}
    </div>
  )
}

type ProductSectionHeaderProps = {
  product: Product
  isFirst: boolean
  activeRegions: Region[]
  onHeaderClick: (regionId: string) => void
}

function ProductSectionHeader(props: ProductSectionHeaderProps) {
  const { activeRegions, product, isFirst, onHeaderClick } = props

  return (
    <>
      {isFirst && (
        <div className="flex mb-2 gap-2">
          <div className="min-w-[314px]">
            <span className="text-small font-semibold text-grey-50">
              Product title:
            </span>
          </div>
          <div className="min-w-[314px]">
            <span className="text-small font-semibold text-grey-50">SKU</span>
          </div>
          {activeRegions.map((r) => (
            <div className="min-w-[314px]">
              <span className="text-small font-semibold text-grey-50">
                {r.currency_code.toUpperCase()} ({r.name})
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex mb-2 gap-2">
        <div className="min-w-[314px]">
          <Tile>
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] flex items-center">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    className="w-[18px] h-[24px] object-cover rounded-soft"
                  />
                ) : (
                  <div className="flex items-center w-[18px] h-[24px] rounded-soft bg-grey-10">
                    <ImagePlaceholder size={18} />
                  </div>
                )}
              </div>
              <span className="text-small text-gray-90 ">{product.title}</span>
            </div>
          </Tile>
        </div>
        <div className="min-w-[314px]">
          <span className="text-small font-semibold text-grey-50">
            <Tile>-</Tile>
          </span>
        </div>
        {activeRegions.map((r) => (
          <div
            onClick={() => onHeaderClick(r.id)}
            className="min-w-[314px] cursor-pointer"
          >
            <span className="text-small font-semibold text-grey-50">
              <Tile>-</Tile>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

const getPriceKey = (variantId: string, regionId: string) =>
  `${variantId}-${regionId}`

type ProductSectionProps = {
  product: Product
  isFirst: boolean
  isShiftDown: boolean
  activeRegions: Region[]
}

function ProductSection(props: ProductSectionProps) {
  const { activeRegions, product, isFirst, isShiftDown } = props

  const [activeFields, setActiveFields] = useState({})
  const [priceChanges, setPriceChanges] = useState({})
  const [currentEditAmount, setCurrentEditAmount] = useState<string>()

  // const matrix = useMemo(() => {
  //   return [product.variants.map((v) => v.id), activeRegions.map((r) => r.id)]
  // }, [activeRegions, product.variants])
  //
  // const onKeyDown = () => {}
  //
  // useEffect(() => {
  //   return () => window.removeEventListener("keydown", onKeyDown)
  // }, [onKeyDown])

  const toggleActive = (cellKey: string) => {
    console.log(activeFields)
    if (activeFields[cellKey]) {
      const tmp = activeFields[cellKey]
      delete tmp[cellKey]

      setActiveFields(tmp)
    } else {
      setActiveFields({ ...activeFields, [cellKey]: true })
    }
  }

  const isActive = (variantId: string, regionId: string) =>
    activeFields[getPriceKey(variantId, regionId)]

  const getPriceChange = (variantId: string, regionId: string) =>
    priceChanges[getPriceKey(variantId, regionId)]

  /* ********** HANDLERS ********** */

  const onPriceInputClick = (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => {
    const cellKey = getPriceKey(variantId, regionId)

    if (isShiftDown) {
      e.preventDefault()
      toggleActive(cellKey)

      if (isActive(variantId, regionId)) e.target.blur()
      else e.target.focus()
    } else {
      setCurrentEditAmount(undefined)
      setActiveFields({ [cellKey]: true })
    }
  }

  const onAmountChange = (
    variantId: string,
    currency: string,
    amount: string
  ) => {
    const tmp = { ...priceChanges }

    // for each input that is currently edited set the amount
    Object.keys(activeFields).forEach((k) => (tmp[k] = amount))

    setPriceChanges(tmp)
    setCurrentEditAmount(amount)
  }

  const onHeaderClick = (regionId: string) => {
    document
      .getElementById(getPriceKey(product.variants[0].id, regionId))
      ?.focus()

    setCurrentEditAmount(undefined)

    const tmp = {}
    product.variants.forEach((v) => (tmp[getPriceKey(v.id, regionId)] = true))
    setActiveFields(tmp)
  }

  return (
    <div className="px-8 mb-4">
      <ProductSectionHeader
        isFirst={isFirst}
        product={product}
        activeRegions={activeRegions}
        onHeaderClick={onHeaderClick}
      />
      {product.variants.map((v) => (
        <ProductVariantRow
          key={v.id}
          variant={v}
          isActive={isActive}
          getPriceChange={getPriceChange}
          activeRegions={activeRegions}
          currentEditAmount={currentEditAmount}
          // HANDLERS
          onAmountChange={onAmountChange}
          onPriceInputClick={onPriceInputClick}
        />
      ))}
    </div>
  )
}

type ProductVariantRowProps = {
  variant: ProductVariant
  activeRegions: Region[]

  isActive: (variantId: string, currency: string) => boolean
  getPriceChange: (variantId: string, currency: string) => boolean

  currentEditAmount?: string
  onAmountChange: (variantId: string, currency: string, amount: string) => void
  onPriceInputClick: (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    currency: string
  ) => void
}

function ProductVariantRow(props: ProductVariantRowProps) {
  const {
    currentEditAmount,
    activeRegions,
    variant,
    onPriceInputClick,
    onAmountChange,
    getPriceChange,
    isActive,
  } = props

  return (
    <div className="flex gap-2 mb-2">
      <Tile className="pl-[42px]">{variant.title}</Tile>
      <Tile>{variant.sku}</Tile>

      {activeRegions.map((r) => {
        // TODO: filter prices by the current price list id
        const current = variant.prices.find((p) => p.region_id === r.id)

        const amount = isActive(variant.id, r.id)
          ? currentEditAmount
          : getPriceChange(variant.id, r.id) || current?.amount

        return (
          <div key={r.id} className="min-w-[314px]">
            <PriceInput
              amount={amount}
              currency={currencies[r.currency_code.toUpperCase()]}
              hasVirtualFocus={isActive(variant.id, r.id)}
              onMouseDown={(e) => onPriceInputClick(e, variant.id, r.id)}
              onAmountChange={(a) => onAmountChange(variant.id, r.id, a)}
              id={getPriceKey(variant.id, r.id)}
            />
          </div>
        )
      })}
    </div>
  )
}

type PriceListBulkEditorProps = {
  products: Product[]
}

function PriceListBulkEditor(props: PriceListBulkEditorProps) {
  const { products } = props

  const [isShiftDown, setIsShiftDown] = useState(false)
  const [activeRegions, setActiveRegions] = useState<string[]>([])

  const { regions } = useAdminRegions()

  useEffect(() => {
    const onKeyDown = (e) => setIsShiftDown(e.shiftKey)
    const onKeyUp = (e) => setIsShiftDown(e.shiftKey)

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  return (
    <Fade isVisible isFullScreen={true}>
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 w-full px-8 flex justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="small"
                variant="ghost"
                // onClick={closeForm}
                className="border rounded-rounded w-8 h-8"
              >
                <CrossIcon size={20} />
              </Button>
              <span className="font-semibold text-grey-90 text-large">
                Bulk editor
              </span>
            </div>
            <div className="gap-x-small flex">
              <Button
                // onClick={handleSubmit(submitGhost)}
                size="small"
                variant="ghost"
                className="border rounded-rounded"
              >
                Discard
              </Button>
              <Button
                size="small"
                // variant="primary"
                // onClick={handleSubmit(submitCTA)}
                className="rounded-rounded"
              >
                Save
              </Button>
            </div>
          </div>
        </FocusModal.Header>

        <FocusModal.Main>
          <PriceListBulkEditorHeader setRegions={setActiveRegions} />

          <div className="medium:w-8/12 w-full flex flex-col justify-start mx-auto overflow-x-auto-TODO">
            {regions &&
              products.map((p, ind) => (
                <ProductSection
                  key={p.id}
                  product={p}
                  isFirst={!ind}
                  isShiftDown={isShiftDown}
                  activeRegions={
                    activeRegions
                      .map((r) => regions?.find((a) => a.id === r))
                      .filter((i) => !!i)
                      .sort((a, b) =>
                        a.currency_code.localeCompare(b.currency_code)
                      ) as Region[]
                  }
                />
              ))}
          </div>
        </FocusModal.Main>
      </FocusModal>
    </Fade>
  )
}

export default PriceListBulkEditor

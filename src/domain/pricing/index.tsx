import { Router, RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import React, { useState } from "react"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import PricingTable from "./pricing-table"
import BulkEditorContainer from "./bulk-editor"

import { MockVariants } from "./bulk-editor/mock.variants"

const PricingIndex: React.FC<RouteComponentProps> = () => {
  const [show, setShow] = useState(false) // TODO: remove

  const actionables = [
    {
      label: "Add price list",
      onClick: () => setShow(true),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["Price lists"]} />}
        >
          <PricingTable />
        </BodyCard>
      </div>
      {show && <BulkEditorContainer variants={MockVariants} />}
    </div>
  )
}

const Pricing = () => {
  return (
    <Router>
      <PricingIndex path="/" />
    </Router>
  )
}

export default Pricing

"use client"

import * as React from "react"
import { Input } from "./input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"

export default function InputGroupExample() {
  const [value, setValue] = React.useState("")

  return (
    <div className="max-w-md mx-auto mt-10">
      <InputGroup>
        {/* Start addon with icon */}
        <InputGroupAddon align="inline-start">
          <Search className="h-4 w-4 text-muted-foreground" />
        </InputGroupAddon>

        {/* The main input */}
        <Input
          placeholder="Search for items..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {/* End button */}
        <InputGroupButton
          onClick={() => alert(`Searching for "${value}"`)}
          size="sm"
        >
          Search
        </InputGroupButton>
      </InputGroup>
    </div>
  )
}

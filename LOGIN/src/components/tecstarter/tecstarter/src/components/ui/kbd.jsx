"use client"

import * as React from "react"
import { Kbd, KbdGroup } from "./kbd"
import { Command, Shift, ArrowUp } from "lucide-react"

export default function KbdExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Single key */}
      <div>
        Press <Kbd>Esc</Kbd> to close the modal.
      </div>

      {/* Key combination */}
      <div>
        Save your changes:{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
        </KbdGroup>
      </div>

      {/* Multiple keys with icons */}
      <div>
        Move selection up:{" "}
        <KbdGroup>
          <Kbd>
            <ArrowUp className="h-3 w-3" />
          </Kbd>{" "}
          + <Kbd>Shift</Kbd>
        </KbdGroup>
      </div>

      {/* Complex key combination */}
      <div>
        Open command palette:{" "}
        <KbdGroup>
          <Kbd>
            <Command className="h-3 w-3" />
          </Kbd>{" "}
          + <Kbd>Shift</Kbd> + <Kbd>P</Kbd>
        </KbdGroup>
      </div>
    </div>
  )
}

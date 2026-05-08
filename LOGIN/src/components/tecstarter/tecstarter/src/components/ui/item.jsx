"use client"

import * as React from "react"
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
} from "./item"
import { Button } from "./button"
import { Avatar, AvatarImage } from "./avatar"
import { Trash, Edit } from "lucide-react"

export default function ItemListExample() {
  const items = [
    {
      id: 1,
      name: "John Doe",
      role: "Administrator",
      avatar: "/avatars/john.png",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Moderator",
      avatar: "/avatars/jane.png",
    },
    {
      id: 3,
      name: "Bob Johnson",
      role: "User",
      avatar: "/avatars/bob.png",
    },
  ]

  return (
    <ItemGroup>
      {items.map((user, index) => (
        <React.Fragment key={user.id}>
          <Item variant="outline" size="default">
            <ItemHeader>
              <ItemMedia variant="image">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{user.name}</ItemTitle>
                <ItemDescription>{user.role}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </ItemActions>
            </ItemHeader>
            <ItemFooter>
              <div className="text-xs text-muted-foreground">
                Joined: Jan 1, 2025
              </div>
            </ItemFooter>
          </Item>
          {index < items.length - 1 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}

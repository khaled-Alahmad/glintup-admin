"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ReviewActionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string) => void
  title: string
  description: string
  submitLabel: string
  placeholder: string
}

export function ReviewActionDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  submitLabel,
  placeholder,
}: ReviewActionDialogProps) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (!content.trim()) return
    onSubmit(content)
    setContent("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
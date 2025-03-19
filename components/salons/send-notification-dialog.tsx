"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell } from "lucide-react"

interface SendNotificationDialogProps {
  salonId: string
  salonName: string
}

export function SendNotificationDialog({ salonId, salonName }: SendNotificationDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSendNotification = async () => {
    if (!title || !message) return

    setIsSending(true)

    // In a real app, you would send the notification to the backend
    // await sendNotification(salonId, title, message)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSending(false)
    setOpen(false)
    setTitle("")
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bell className="h-4 w-4 ml-2" />
          إرسال إشعار
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إرسال إشعار للصالون</DialogTitle>
          <DialogDescription>سيتم إرسال هذا الإشعار إلى صالون {salonName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="notification-title">عنوان الإشعار</Label>
            <Input
              id="notification-title"
              placeholder="أدخل عنوان الإشعار"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notification-message">نص الإشعار</Label>
            <Textarea
              id="notification-message"
              placeholder="أدخل نص الإشعار"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSendNotification} disabled={isSending}>
            {isSending ? "جاري الإرسال..." : "إرسال الإشعار"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


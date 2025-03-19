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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"

interface SuspendSalonDialogProps {
  salonId: string
  salonName: string
}

export function SuspendSalonDialog({ salonId, salonName }: SuspendSalonDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("")
  const [isSuspending, setIsSuspending] = useState(false)

  const handleSuspendSalon = async () => {
    if (!reason || !duration) return

    setIsSuspending(true)

    // In a real app, you would send the suspension request to the backend
    // await suspendSalon(salonId, reason, duration)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSuspending(false)
    setOpen(false)
    setReason("")
    setDuration("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
          <AlertTriangle className="h-4 w-4 ml-2" />
          تعليق الصالون
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعليق الصالون</DialogTitle>
          <DialogDescription>هل أنت متأكد من رغبتك في تعليق صالون {salonName}؟</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="suspend-reason">سبب التعليق</Label>
            <Textarea
              id="suspend-reason"
              placeholder="أدخل سبب تعليق الصالون"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="suspend-duration">مدة التعليق</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="suspend-duration">
                <SelectValue placeholder="اختر مدة التعليق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">يوم واحد</SelectItem>
                <SelectItem value="3">3 أيام</SelectItem>
                <SelectItem value="7">أسبوع</SelectItem>
                <SelectItem value="30">شهر</SelectItem>
                <SelectItem value="indefinite">غير محدد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleSuspendSalon} disabled={isSuspending}>
            {isSuspending ? "جاري التعليق..." : "تعليق الصالون"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


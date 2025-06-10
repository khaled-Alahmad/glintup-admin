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
import { Ban } from "lucide-react"

interface BanSalonDialogProps {
  salonId: string
  salonName: string
}

export function BanSalonDialog({ salonId, salonName }: BanSalonDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isBanning, setIsBanning] = useState(false)

  const handleBanSalon = async () => {
    if (!reason) return

    setIsBanning(true)

    // In a real app, you would send the ban request to the backend
    // await banSalon(salonId, reason)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsBanning(false)
    setOpen(false)
    setReason("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          <Ban className="h-4 w-4 ml-2" />
          حظر المزود
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حظر المزود</DialogTitle>
          <DialogDescription>هل أنت متأكد من رغبتك في حظر مزود {salonName} بشكل دائم؟</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ban-reason">سبب الحظر</Label>
            <Textarea
              id="ban-reason"
              placeholder="أدخل سبب حظر المزود"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleBanSalon} disabled={isBanning}>
            {isBanning ? "جاري الحظر..." : "حظر المزود"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


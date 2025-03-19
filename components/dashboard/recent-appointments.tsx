import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarCheck2, CalendarX2, Clock } from "lucide-react"

const appointments = [
  {
    id: "1",
    customerName: "سارة أحمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون الأميرة",
    time: "10:30 صباحاً",
    date: "03/04/2024",
    service: "قص شعر وصبغة",
    status: "مؤكد",
  },
  {
    id: "2",
    customerName: "نورة محمد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون إليت",
    time: "2:15 مساءً",
    date: "03/04/2024",
    service: "مكياج",
    status: "معلق",
  },
  {
    id: "3",
    customerName: "عبير علي",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون جلام",
    time: "4:45 مساءً",
    date: "03/04/2024",
    service: "علاج بالكيراتين",
    status: "مؤكد",
  },
  {
    id: "4",
    customerName: "هند خالد",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون مس بيوتي",
    time: "11:00 صباحاً",
    date: "03/04/2024",
    service: "مانيكير وباديكير",
    status: "ملغي",
  },
  {
    id: "5",
    customerName: "ليلى عبدالله",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    salonName: "صالون روز",
    time: "3:30 مساءً",
    date: "03/04/2024",
    service: "حمام مغربي",
    status: "مؤكد",
  },
]

export function RecentAppointments() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مؤكد":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مؤكد
          </Badge>
        )
      case "معلق":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            معلق
          </Badge>
        )
      case "ملغي":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            ملغي
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center gap-4 rounded-lg border p-3 transition-all duration-200 hover:shadow-md hover:bg-muted/20"
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/10">
            <AvatarImage src={appointment.customerAvatar} alt={appointment.customerName} />
            <AvatarFallback>{appointment.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{appointment.customerName}</p>
              {getStatusBadge(appointment.status)}
            </div>
            <div className="flex gap-4">
              <p className="text-xs text-muted-foreground">{appointment.salonName}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="mr-1 h-3 w-3" /> {appointment.time}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            {appointment.status === "ملغي" ? (
              <CalendarX2 className="h-4 w-4 text-red-500" />
            ) : (
              <CalendarCheck2 className="h-4 w-4 text-green-500" />
            )}
          </Button>
        </div>
      ))}
    </div>
  )
}


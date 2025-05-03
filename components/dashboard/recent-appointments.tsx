import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarCheck2, CalendarX2, Clock } from "lucide-react"

interface Salon {
  id: number;
  name: string;
  icon: string;
  merchant_commercial_name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

interface Appointment {
  id: number;
  code: string;
  status: string;
  date: string;
  time: string;
  salon: Salon;
  user: User;
}

export function RecentAppointments({ appointments }: { appointments: Appointment[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            مؤكد
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            قيد الإنتظار
          </Badge>
        )
      case "cancelled":
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
            <AvatarImage src={appointment.user.avatar || ''} alt={`${appointment.user.first_name} ${appointment.user.last_name}`} />
            <AvatarFallback>{appointment.user.first_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {`${appointment.user.first_name} ${appointment.user.last_name}`}
              </p>
              {getStatusBadge(appointment.status)}
            </div>
            <div className="flex gap-4">
              <p className="text-xs text-muted-foreground">{appointment.salon.merchant_commercial_name}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="mr-1 h-3 w-3" /> {`${appointment.date.split('T')[0]} ${appointment.time}`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            {appointment.status === "cancelled" ? (
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

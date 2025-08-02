import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

// const salons = [
//   {
//     id: "1",
//     name: "مزود الأميرة",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "مدينة الكويت، الكويت",
//     bookingsCount: 124,
//     rating: 4.8,
//     maxBookings: 150,
//     percentage: 82,
//     color: "#4f46e5",
//   },
//   {
//     id: "2",
//     name: "مزود إليت",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "جدة، السعودية",
//     bookingsCount: 96,
//     rating: 4.5,
//     maxBookings: 150,
//     percentage: 64,
//     color: "#0ea5e9",
//   },
//   {
//     id: "3",
//     name: "مزود جلام",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "الدمام، السعودية",
//     bookingsCount: 81,
//     rating: 4.7,
//     maxBookings: 150,
//     percentage: 54,
//     color: "#8b5cf6",
//   },
//   {
//     id: "4",
//     name: "مزود مس بيوتي",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "مدينة الكويت، الكويت",
//     bookingsCount: 75,
//     rating: 4.2,
//     maxBookings: 150,
//     percentage: 50,
//     color: "#ec4899",
//   },
//   {
//     id: "5",
//     name: "مزود روز",
//     logo: "/placeholder.svg?height=40&width=40",
//     location: "جدة، السعودية",
//     bookingsCount: 68,
//     rating: 4.6,
//     maxBookings: 150,
//     percentage: 45,
//     color: "#f43f5e",
//   },
// ]

export function TopSalons({ salons }: {
  salons: Array<{
    id: string;
    name: string;
    logo: string;
    location: string;
    images: Array<{ url: string; alt: string }>;
    bookingsCount: number;
    rating: number;
    maxBookings: number;
    merchant_commercial_name: string;
    percentage: number;
    color: string;
  }>
}) {
  console.log("TopSalons component rendered with salons:", salons);


  return (
    <div className="space-y-4">
      {salons.map((salon) => (
        <div
          key={salon.id}
          className="flex flex-col gap-2 p-2 rounded-lg transition-all duration-200 hover:bg-muted/20"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border ring-2 ring-primary/10">
              {salon.images[0] && salon.images[0].url && (
                <AvatarImage src={salon.images[0].url} alt={salon.merchant_commercial_name} />
              )}
              <AvatarFallback>{salon.merchant_commercial_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{salon.merchant_commercial_name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{salon.rating}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{salon.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={salon.percentage} className="h-2" indicatorClassName={`bg-[${salon.color}]`} />
            <span className="text-xs text-muted-foreground w-16 text-left">{salon.bookingsCount} حجز</span>
          </div>
        </div>
      ))}
    </div>
  )
}


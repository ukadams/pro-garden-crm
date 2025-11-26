import { Calendar, Clock, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  // Mock data - replace with actual data from your API
  const stats = [
    { title: "Total Revenue", value: "$12,450", change: "+12.5%", icon: DollarSign },
    { title: "Active Clients", value: "124", change: "+8.2%", icon: Users },
    { title: "Appointments", value: "24", change: "+3.1%", icon: Calendar },
    { title: "Avg. Session", value: "45m", change: "+2.4%", icon: Clock },
  ]

  const recentAppointments = [
    { id: 1, client: "John Smith", service: "Lawn Mowing", time: "Today, 10:00 AM", status: "confirmed" },
    { id: 2, client: "Sarah Johnson", service: "Garden Design", time: "Today, 2:30 PM", status: "confirmed" },
    { id: 3, client: "Michael Brown", service: "Tree Trimming", time: "Tomorrow, 9:00 AM", status: "pending" },
    { id: 4, client: "Emily Davis", service: "Irrigation Check", time: "Tomorrow, 11:00 AM", status: "pending" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <Button>+ New Appointment</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

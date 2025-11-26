"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { appointmentsAPI } from "@/lib/api"

interface Appointment {
  id: number
  client_name: string
  service: string
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending'
  notes?: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll()
      setAppointments(response.data)
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
      // Use mock data for now
      setAppointments([
        { id: 1, client_name: "John Smith", service: "Lawn Mowing", date: "2024-11-19", time: "10:00 AM", status: "scheduled", notes: "Front and back yard" },
        { id: 2, client_name: "Sarah Johnson", service: "Garden Design", date: "2024-11-19", time: "2:30 PM", status: "scheduled", notes: "Initial consultation" },
        { id: 3, client_name: "Michael Brown", service: "Tree Trimming", date: "2024-11-20", time: "9:00 AM", status: "pending", notes: "Oak tree in backyard" },
        { id: 4, client_name: "Emily Davis", service: "Irrigation Check", date: "2024-11-20", time: "11:00 AM", status: "pending", notes: "Seasonal maintenance" },
        { id: 5, client_name: "Robert Wilson", service: "Lawn Mowing", date: "2024-11-18", time: "3:00 PM", status: "completed", notes: "Regular maintenance" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = appointment.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(appointment)
    return acc
  }, {} as Record<string, Appointment[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedAppointments)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, dayAppointments]) => (
            <Card key={date}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle className="text-lg">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                  <Badge variant="outline">
                    {dayAppointments.length} appointment{dayAppointments.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.client_name}</span>
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <span className="text-muted-foreground">{appointment.service}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {appointment.notes && (
                        <span className="text-sm text-muted-foreground max-w-xs truncate">
                          {appointment.notes}
                        </span>
                      )}
                      <Badge variant={getStatusVariant(appointment.status)} className="flex items-center space-x-1">
                        {getStatusIcon(appointment.status)}
                        <span>{appointment.status}</span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

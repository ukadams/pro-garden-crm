"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { clientsAPI } from "@/lib/api"

interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
  created_at: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await clientsAPI.getAll()
      setClients(response.data)
    } catch (error) {
      console.error("Failed to fetch clients:", error)
      // Use mock data for now
      setClients([
        { id: 1, name: "John Smith", email: "john@example.com", phone: "555-0101", address: "123 Main St", status: "active", created_at: "2024-01-15" },
        { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "555-0102", address: "456 Oak Ave", status: "active", created_at: "2024-01-20" },
        { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "555-0103", address: "789 Pine Rd", status: "inactive", created_at: "2024-02-01" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client database</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{client.address}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Client since {new Date(client.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

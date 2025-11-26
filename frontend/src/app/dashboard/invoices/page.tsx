"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Download, Eye, Edit, Trash2, DollarSign, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { invoicesAPI } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

interface Invoice {
  id: number
  invoice_number: string
  client_name: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  due_date: string
  created_at: string
  services: string[]
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await invoicesAPI.getAll()
      setInvoices(response.data)
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
      // Use mock data for now
      setInvoices([
        { id: 1, invoice_number: "INV-001", client_name: "John Smith", amount: 150.00, status: "paid", due_date: "2024-11-15", created_at: "2024-11-01", services: ["Lawn Mowing", "Tree Trimming"] },
        { id: 2, invoice_number: "INV-002", client_name: "Sarah Johnson", amount: 450.00, status: "pending", due_date: "2024-11-25", created_at: "2024-11-10", services: ["Garden Design", "Planting"] },
        { id: 3, invoice_number: "INV-003", client_name: "Michael Brown", amount: 200.00, status: "overdue", due_date: "2024-11-10", created_at: "2024-10-25", services: ["Irrigation System"] },
        { id: 4, invoice_number: "INV-004", client_name: "Emily Davis", amount: 75.00, status: "paid", due_date: "2024-11-20", created_at: "2024-11-05", services: ["Lawn Mowing"] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'overdue':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingRevenue = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage billing and payments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Paid invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingRevenue)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter(inv => inv.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.client_name}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                    <span>Created: {new Date(invoice.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(invoice.amount)}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {invoice.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

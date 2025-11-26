import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl">Page Not Found</h2>
      <p className="text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link href="/dashboard">
          Go to Dashboard
        </Link>
      </Button>
    </div>
  )
}

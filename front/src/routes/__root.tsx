import { createRootRoute, Outlet } from '@tanstack/react-router'
import { SyncStatusHeader } from '@/components/SyncStatusHeader'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <SyncStatusHeader />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  ),
})
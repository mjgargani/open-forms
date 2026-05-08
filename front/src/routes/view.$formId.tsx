import { createFileRoute } from '@tanstack/react-router'
import { ExamExecutor } from '@/features/exam-executor/components/ExamExecutor'

export const Route = createFileRoute('/view/$formId')({
  component: ViewExamPage,
})

function ViewExamPage() {
  const { formId } = Route.useParams()

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <ExamExecutor formId={formId} />
    </div>
  )
}
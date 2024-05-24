import { PageRoutes } from "./_components/page-routes"


function PagesLayout({ children }) {
  return (
    <div className="grid h-full grid-cols-[180px_1fr]">
      <div className="border-r">
        <PageRoutes />
      </div>
      { children }
    </div>
  )
}
export default PagesLayout
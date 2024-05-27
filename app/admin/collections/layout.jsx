import { CollectionRoutes } from "./_components/collection-routes"


function CollectionsLayout({ children }) {
  return (
    <div className="grid h-full grid-cols-[180px_1fr]">
      <div className="border-r">
        <CollectionRoutes />
      </div>
      { children }
    </div>
  )
}
export default CollectionsLayout
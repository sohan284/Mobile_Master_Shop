import { Skeleton } from './skeleton';

export default function DataTableSkeleton({ 
  columns = [], 
  rows = 5,
  showHeader = true,
  showSearch = true,
  showPagination = true,
  height = "80vh"
}) {
  return (
    <div className="bg-white/10 rounded-lg border flex flex-col" style={{ height: height }}>
      {/* Header Skeleton */}
      {showHeader && (
        <div className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            {showSearch && (
              <Skeleton className="h-9 w-80" />
            )}
          </div>
        </div>
      )}

      {/* Table Skeleton with fixed height */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((_, index) => (
                  <th key={index} className="px-6 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {column.accessor === 'logo' ? (
                        <Skeleton className="h-8 w-8 rounded" />
                      ) : column.accessor === 'status' ? (
                        <Skeleton className="h-6 w-16 rounded-full" />
                      ) : (
                        <Skeleton className="h-4 w-24" />
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="px-6 py-4 border-t flex-shrink-0">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

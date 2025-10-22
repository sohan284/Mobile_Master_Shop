import { Skeleton } from './skeleton';

export default function DataTableSkeleton({ 
  columns = [], 
  rows = 5,
  showHeader = true,
  showSearch = true,
  showPagination = true 
}) {
  return (
    <div className="bg-white rounded-lg border">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      )}

      {/* Search Skeleton */}
      {showSearch && (
        <div className="px-6 py-4 border-b">
          <Skeleton className="h-10 w-80" />
        </div>
      )}

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
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

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="px-6 py-4 border-t">
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

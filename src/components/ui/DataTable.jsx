'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Database
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, CustomButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DataTableSkeleton from "./DataTableSkeleton";

export default function DataTable({ 
  data = [], 
  columns = [], 
  title = "Data Table",
  onAdd,
  onEdit,
  onDelete,
  onView,
  onRowClick,
  onMoveUp,
  onMoveDown,
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
  className = "",
  loading = false,
  height = "80vh",
  orderTypeFilter, // JSX component
  statusFilter, // JSX component
  movingItems = {}, // Track which items are being moved
  // Server-side pagination props
  totalCount = null,
  totalPages = null,
  currentPage = null,
  onPageChange = null
}) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  const dataRef = useRef(safeData);
  
  // Determine if using server-side pagination
  const isServerSidePagination = totalCount !== null && totalPages !== null && currentPage !== null && onPageChange !== null;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  // Use server-side or client-side pagination
  const effectiveCurrentPage = isServerSidePagination ? currentPage : clientCurrentPage;
  const effectiveTotalPages = isServerSidePagination ? totalPages : null;
  const effectiveTotalCount = isServerSidePagination ? totalCount : null;

  // Reset pagination and search when data changes (only for client-side)
  useEffect(() => {
    if (!isServerSidePagination && dataRef.current !== safeData) {
      setClientCurrentPage(1);
      setSearchTerm('');
      setSortField('');
      setSortDirection('asc');
      dataRef.current = safeData;
    }
  }, [safeData, isServerSidePagination]);

  // Filter data based on search term (status filtering is handled by API)
  const filteredData = safeData.filter(item => {
    // Apply search term filter
    if (!searchTerm) return true;
    return columns.some(column => {
      const value = column.accessor ? item[column.accessor] : '';
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination - server-side or client-side
  let paginatedData, validCurrentPage, startIndex, endIndex, calculatedTotalPages;
  
  if (isServerSidePagination) {
    // Server-side pagination: data is already paginated from API
    paginatedData = sortedData;
    validCurrentPage = Math.min(Math.max(1, effectiveCurrentPage), effectiveTotalPages);
    startIndex = (validCurrentPage - 1) * itemsPerPage;
    endIndex = Math.min(startIndex + paginatedData.length, effectiveTotalCount);
    calculatedTotalPages = effectiveTotalPages;
  } else {
    // Client-side pagination: paginate the data locally
    calculatedTotalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
    validCurrentPage = Math.min(Math.max(1, effectiveCurrentPage), calculatedTotalPages);
    startIndex = (validCurrentPage - 1) * itemsPerPage;
    endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);
    paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page) => {
    if (isServerSidePagination) {
      onPageChange(page);
    } else {
      setClientCurrentPage(page);
    }
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    
    if (column.accessor) {
      const value = item[column.accessor];
      return value || '-';
    }
    
    return '-';
  };

  // Check if any actions are provided
  const hasActions = !!(onView || onEdit || onDelete);
  const hasMoveActions = !!(onMoveUp || onMoveDown);

  // Show skeleton loader when loading
  if (loading) {
    return (
      <DataTableSkeleton 
        columns={columns}
        rows={itemsPerPage}
        showHeader={true}
        showSearch={searchable}
        showPagination={pagination}
      />
    );
  }

  return (
    <div className={`bg-white/10 rounded-lg border flex flex-col ${className}`} style={{ height: height }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">{title}</p>
          </div>
          <div className="flex items-center space-x-2">
            {orderTypeFilter && orderTypeFilter}
            {statusFilter && statusFilter}
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
           
            {onAdd && (
              <Button onClick={onAdd} className="gap-2 text-secondary cursor-pointer">
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table with fixed height and scrollable body */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <Table>
          <TableHeader className="sticky top-0 bg-gray-50 z-10">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => column.sortable && !column.filterable && handleSort(column.accessor)}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          {sortField === column.accessor ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                    {column.filterable && column.filterComponent && (
                      <div onClick={(e) => e.stopPropagation()} className="mt-1">
                        {column.filterComponent}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
              {hasActions && <TableHead>Actions</TableHead>}
              {hasMoveActions && <TableHead className="w-2"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (hasActions ? 1 : 0) + (hasMoveActions ? 1 : 0)} 
                  className="h-full p-0"
                >
                  <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] px-4">
                    <div className="rounded-full p-4 mb-4">
                      <Database className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No data found</h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm">
                      {searchTerm 
                        ? `No results match your search "${searchTerm}". Try adjusting your search terms.`
                        : 'There are no items to display at the moment.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => {
                // Calculate actual index in the full dataset (before pagination)
                const actualIndex = startIndex + index;
                const isMoving = movingItems[item.id];
                const isHovered = hoveredRowIndex === actualIndex;
                
                // Generate unique key based on item properties to prevent duplicates
                const uniqueKey = item.id 
                  ? `${item.id}-${item.orderNumber || item.order_number || ''}-${startIndex + index}`
                  : `${item.orderNumber || item.order_number || index}-${startIndex + index}`;
                
                return (
                <TableRow 
                  key={uniqueKey}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  onMouseEnter={() => setHoveredRowIndex(actualIndex)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                  className={`relative ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${isMoving ? 'opacity-50' : ''}`}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {renderCell(item, column)}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell>
                      <div className="flex items-center space-x-2 cursor-pointer">
                       {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onView(item); }}
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 cursor-pointer" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {hasMoveActions && (
                    <TableCell className="relative">
                      <div className={`flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        {onMoveUp && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onMoveUp(item, actualIndex); 
                            }}
                            disabled={actualIndex === 0 || isMoving}
                            className="h-8 w-8 p-0 cursor-pointer"
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {onMoveDown && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onMoveDown(item, actualIndex); 
                            }}
                            disabled={actualIndex === sortedData.length - 1 || isMoving}
                            className="h-8 w-8 p-0 cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Pagination - Always show when pagination is enabled */}
      {pagination && (
        <div className="px-6 py-4 border-t flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isServerSidePagination ? (
                effectiveTotalCount > 0 ? (
                  `Showing ${startIndex + 1} to ${endIndex} of ${effectiveTotalCount} ${effectiveTotalCount === 1 ? 'result' : 'results'}`
                ) : (
                  'No results'
                )
              ) : (
                sortedData.length > 0 ? (
                  `Showing ${startIndex + 1} to ${endIndex} of ${sortedData.length} ${sortedData.length === 1 ? 'result' : 'results'}`
                ) : (
                  'No results'
                )
              )}
            </div>
            {calculatedTotalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: calculatedTotalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={validCurrentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={validCurrentPage === page ? "h-8 w-8 p-0 cursor-pointer bg-primary text-white" : "h-8 w-8 p-0 cursor-pointer"}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === calculatedTotalPages}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

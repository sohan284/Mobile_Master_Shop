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
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
  className = "",
  loading = false,
  height = "76vh"
}) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  const dataRef = useRef(safeData);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Reset pagination and search when data changes
  useEffect(() => {
    if (dataRef.current !== safeData) {
      setCurrentPage(1);
      setSearchTerm('');
      setSortField('');
      setSortDirection('asc');
      dataRef.current = safeData;
    }
  }, [safeData]);

  // Filter data based on search term
  const filteredData = safeData.filter(item => {
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

  // Pagination - ensure we always show exactly itemsPerPage items
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);
  const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  // Sync currentPage with validCurrentPage if they differ
  useEffect(() => {
    if (currentPage !== validCurrentPage) {
      setCurrentPage(validCurrentPage);
    }
  }, [currentPage, validCurrentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                  onClick={() => column.sortable && handleSort(column.accessor)}
                >
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
                </TableHead>
              ))}
              {hasActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (hasActions ? 1 : 0)} 
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
                // Generate unique key based on item properties to prevent duplicates
                const uniqueKey = item.id 
                  ? `${item.id}-${item.orderNumber || item.order_number || ''}-${startIndex + index}`
                  : `${item.orderNumber || item.order_number || index}-${startIndex + index}`;
                
                return (
                <TableRow 
                  key={uniqueKey}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
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
              {sortedData.length > 0 ? (
                `Showing ${startIndex + 1} to ${endIndex} of ${sortedData.length} ${sortedData.length === 1 ? 'result' : 'results'}`
              ) : (
                'No results'
              )}
            </div>
            {totalPages > 1 && (
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
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  disabled={validCurrentPage === totalPages}
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

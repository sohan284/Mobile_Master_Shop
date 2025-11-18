'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
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
  Database,
  GripVertical
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
  onDragDrop, // Callback for drag and drop: (draggedItem, targetItem) => void
  searchable = true,
  pagination = true,
  showMore = false, // Show "Show More" button instead of pagination
  itemsPerPage = 10,
  className = "",
  loading = false,
  height = "80vh",
  orderTypeFilter, // JSX component
  statusFilter, // JSX component
  movingItems = {}, // Track which items are being moved
  rowClassName, // function(item): string - optional per-row classes
  // Server-side pagination props
  totalCount = null,
  totalPages = null,
  currentPage = null,
  onPageChange = null
}) {
  const t = useTranslations('dashboard.dataTable');

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
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);

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
      // Reset showAllItems when data changes in showMore mode
      if (showMore) {
        setShowAllItems(false);
      }
      dataRef.current = safeData;
    }
  }, [safeData, isServerSidePagination, showMore]);

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

  // Pagination - server-side or client-side or showMore
  let paginatedData, validCurrentPage, startIndex, endIndex, calculatedTotalPages;
  
  if (showMore) {
    // Show More mode: show 10 items initially, then all when showAllItems is true
    const initialLimit = itemsPerPage;
    paginatedData = showAllItems ? sortedData : sortedData.slice(0, initialLimit);
    startIndex = 0;
    endIndex = paginatedData.length;
    validCurrentPage = 1;
    calculatedTotalPages = 1;
  } else if (isServerSidePagination) {
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

  const renderCell = (item, column, index) => {
    if (column.render) {
      return column.render(item, index);
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
  const hasDragDrop = !!onDragDrop;

  // Drag and drop handlers
  const handleDragStart = (e, item, index) => {
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ id: item.id, index }));
    // Find the row element and make it semi-transparent
    const row = e.currentTarget.closest('tr');
    if (row) {
      row.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e) => {
    const row = e.currentTarget.closest('tr');
    if (row) {
      row.style.opacity = '1';
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem && draggedItem.index !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetItem, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem && draggedItem.item.id !== targetItem.id && onDragDrop) {
      onDragDrop(draggedItem.item, targetItem, draggedItem.index, targetIndex);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

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
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
           
            {onAdd && (
                <Button onClick={onAdd} className="gap-2 text-primary bg-black hover:bg-black/90 cursor-pointer">
                <Plus className="h-4 w-4 text-white" />
                  {t('addNew')}
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
            {hasDragDrop && <TableHead className="w-2"></TableHead>}
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={column.sortable ? 'cursor-pointer hover:bg-blue-50' : ''}
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
              {hasActions && <TableHead>{t('actions')}</TableHead>}
              {hasMoveActions && <TableHead className="w-2"></TableHead>}
             
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (hasActions ? 1 : 0) + (hasMoveActions ? 1 : 0) + (hasDragDrop ? 1 : 0)} 
                  className="h-full p-0"
                >
                  <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] px-4">
                    <div className="rounded-full p-4 mb-4">
                      <Database className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noDataTitle')}</h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm">
                      {searchTerm
                        ? t('noSearchResults', { term: searchTerm })
                        : t('noDataDescription')}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => {
                // Calculate actual index in the full dataset (before pagination/showMore)
                // For showMore mode, we need to find the item's index in sortedData
                let actualIndex;
                if (showMore) {
                  actualIndex = sortedData.findIndex(d => d.id === item.id);
                  if (actualIndex === -1) actualIndex = startIndex + index;
                } else {
                  actualIndex = startIndex + index;
                }
                const isMoving = movingItems[item.id];
                const isHovered = hoveredRowIndex === actualIndex;
                
                // Generate unique key based on item properties to prevent duplicates
                const uniqueKey = item.id 
                  ? `${item.id}-${item.orderNumber || item.order_number || ''}-${startIndex + index}`
                  : `${item.orderNumber || item.order_number || index}-${startIndex + index}`;
                
                const isDragged = draggedItem && draggedItem.item.id === item.id;
                const isDragOver = dragOverIndex === actualIndex;
                
                return (
                <TableRow 
                  key={uniqueKey}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  onMouseEnter={() => setHoveredRowIndex(actualIndex)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                  onDragOver={hasDragDrop ? (e) => handleDragOver(e, actualIndex) : undefined}
                  onDragLeave={hasDragDrop ? handleDragLeave : undefined}
                  onDrop={hasDragDrop ? (e) => handleDrop(e, item, actualIndex) : undefined}
                  className={`relative ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${isMoving ? 'opacity-50' : ''} ${isDragged ? 'opacity-50' : ''} ${isDragOver ? 'bg-blue-100 border-t-2 border-blue-500' : ''} ${rowClassName ? rowClassName(item) : ''}`}
                >
                   {hasDragDrop && (
                    <TableCell 
                      className="relative w-8 cursor-move"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, item, actualIndex)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-center justify-center">
                        <GripVertical 
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" 
                          draggable={false}
                        />
                      </div>
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {renderCell(item, column, actualIndex)}
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
                            className="h-8 w-8 p-0 rounded-full cursor-pointer hover:bg-gray-200"
                          >
                            <Eye className="h-4 w-4 cursor-pointer" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                            className="h-8 w-8 p-0 rounded-full cursor-pointer hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                            className="h-8 w-8 p-0 text-destructive rounded-full hover:text-destructive cursor-pointer hover:bg-gray-200"
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
                            className="h-8 w-8 p-0 rounded-full cursor-pointer hover:bg-gray-200"
                            title={t('moveUp')}
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
                            className="h-8 w-8 p-0 rounded-full cursor-pointer hover:bg-gray-200"
                            title={t('moveDown')}
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

      {/* Show More Button - Show when showMore is enabled */}
      {showMore && sortedData.length > itemsPerPage && (
        <div className="px-6 py-4 border-t flex-shrink-0">
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllItems(!showAllItems)}
              className="cursor-pointer hover:bg-black/20"
            >
              {showAllItems ? t('showLess') : t('showAll', { count: sortedData.length })}
            </Button>
          </div>
        </div>
      )}

      {/* Pagination - Always show when pagination is enabled and showMore is false */}
      {pagination && !showMore && (
        <div className="px-6 py-4 border-t flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isServerSidePagination ? (
                effectiveTotalCount > 0 ? (
                  t('showingRange', {
                    start: startIndex + 1,
                    end: endIndex,
                    total: effectiveTotalCount,
                    resultLabel: effectiveTotalCount === 1 ? t('result') : t('results'),
                  })
                ) : (
                  t('noResults')
                )
              ) : sortedData.length > 0 ? (
                t('showingRange', {
                  start: startIndex + 1,
                  end: endIndex,
                  total: sortedData.length,
                  resultLabel: sortedData.length === 1 ? t('result') : t('results'),
                })
              ) : (
                t('noResults')
              )}
            </div>
            {calculatedTotalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-black/20" 
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: calculatedTotalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={validCurrentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={validCurrentPage === page ? "h-8 w-8 p-0 cursor-pointer bg-black hover:bg-black/90 text-white" : "h-8 w-8 p-0 hover:bg-black/20 cursor-pointer"}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === calculatedTotalPages}
                  className="h-8 w-8 p-0 cursor-pointer hover:bg-black/20"
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

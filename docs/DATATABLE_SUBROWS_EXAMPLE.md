# DataTable Sub-Rows Example

This example demonstrates how to use the enhanced DataTable component with expandable sub-rows functionality.

## Basic Setup

```tsx
import { DataTable, createExpandButton, hasChildren, getSubRows } from '@/components/layouts/DataTable';
import { ColumnDef } from '@tanstack/react-table';

// Define your data types
interface MainRowData {
  id: string;
  name: string;
  status: string;
  children?: SubRowData[]; // Optional sub-rows
}

interface SubRowData {
  id: string;
  subName: string;
  details: string;
}

// Sample data with hierarchical structure
const sampleData: MainRowData[] = [
  {
    id: '1',
    name: 'Project Alpha',
    status: 'Active',
    children: [
      { id: '1-1', subName: 'Task 1', details: 'Implementation' },
      { id: '1-2', subName: 'Task 2', details: 'Testing' }
    ]
  },
  {
    id: '2',
    name: 'Project Beta',
    status: 'Pending',
    children: [
      { id: '2-1', subName: 'Research', details: 'Market Analysis' }
    ]
  },
  {
    id: '3',
    name: 'Project Gamma',
    status: 'Completed'
    // No children - this row won't be expandable
  }
];

// Define columns with expansion support
const columns: ColumnDef<MainRowData>[] = [
  {
    id: 'expander',
    header: '',
    cell: ({ row }) => {
      if (!hasChildren(row.original)) return null;
      return createExpandButton(row);
    },
    size: 40
  },
  {
    accessorKey: 'name',
    header: 'Project Name'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <span className={`px-2 py-1 rounded text-xs ${
          status === 'Active' ? 'bg-green-100 text-green-800' :
          status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      );
    }
  }
];

// Sub-row columns (for the expanded content)
const subColumns: ColumnDef<SubRowData>[] = [
  {
    id: 'spacer',
    header: '',
    size: 40 // Match the expander column width
  },
  {
    accessorKey: 'subName',
    header: 'Task Name'
  },
  {
    accessorKey: 'details',
    header: 'Details'
  }
];

// Component implementation
export function ProjectsTable() {
  return (
    <DataTable
      data={sampleData}
      columns={columns}
      // Enable expansion functionality
      enableExpanding={true}
      getSubRows={getSubRows} // Use the utility function
      // Render sub-rows as a nested table
      renderSubComponent={({ row }) => {
        const subRows = row.original.children || [];
        return (
          <div className="p-4 bg-gray-50">
            <DataTable
              data={subRows}
              columns={subColumns}
              showPagination={false}
              showSearch={false}
              className="border-none shadow-none"
            />
          </div>
        );
      }}
      // Optional: Custom expanded row class
      getRowClassName={(row) => 
        row.getIsExpanded() ? 'bg-blue-50' : ''
      }
    />
  );
}
```

## Advanced Example with Custom Sub-Row Rendering

```tsx
// More complex sub-row rendering with custom layout
export function AdvancedProjectsTable() {
  return (
    <DataTable
      data={sampleData}
      columns={columns}
      enableExpanding={true}
      getSubRows={getSubRows}
      renderSubComponent={({ row }) => {
        const project = row.original;
        const tasks = project.children || [];
        
        return (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400">
            <h4 className="font-semibold text-lg mb-4 text-blue-900">
              {project.name} - Task Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <h5 className="font-medium text-gray-900 mb-2">{task.subName}</h5>
                  <p className="text-gray-600 text-sm">{task.details}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {tasks.length === 0 && (
              <p className="text-gray-500 italic">No tasks available for this project.</p>
            )}
          </div>
        );
      }}
    />
  );
}
```

## Key Features

### 1. Expansion Control
- Use `createExpandButton(row)` to create the expand/collapse button
- Use `hasChildren(row.original)` to check if a row should be expandable
- The button automatically handles the expand/collapse state

### 2. Data Structure
- Main rows can have an optional `children` property containing sub-row data
- Sub-rows can be any data structure - they don't need to match the main row type
- Use `getSubRows` utility to extract children from your data

### 3. Sub-Row Rendering
- `renderSubComponent` prop receives the expanded row and renders custom content
- You can render another DataTable, custom layouts, or any React components
- Sub-content is automatically shown/hidden based on expansion state

### 4. Styling Options
- Use `getRowClassName` to apply custom styles to expanded rows
- Sub-components can have their own styling and layout
- The expansion area supports full CSS customization

### 5. Nested Tables
- You can render DataTables inside sub-rows for complex hierarchical data
- Disable pagination and search on nested tables with `showPagination={false}` and `showSearch={false}`
- Use `className` prop to customize nested table appearance

## Real-World Usage

This pattern is perfect for:
- **Project Management**: Projects with tasks/subtasks
- **Order Management**: Orders with line items
- **Evaluation Systems**: Evaluations with evaluation groups (as implemented)
- **File Systems**: Folders with files
- **Organization Charts**: Departments with employees
- **Product Catalogs**: Categories with products

## Migration from Existing Tables

To add sub-row support to existing DataTable usage:

1. Add the expander column as the first column
2. Ensure your data has a `children` property (or customize `getSubRows`)
3. Add `enableExpanding={true}` and `getSubRows={getSubRows}` props
4. Implement `renderSubComponent` for your sub-row content
5. Existing tables without `children` data will work unchanged

The enhancement is fully backward compatible - existing DataTable implementations will continue to work without any modifications.
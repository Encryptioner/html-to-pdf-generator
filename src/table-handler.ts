/**
 * PDF Generator Library - Table Handler
 *
 * Advanced table processing for proper PDF pagination
 */

export interface TableProcessingOptions {
  /** Allow table rows to split across pages */
  allowRowSplit?: boolean;
  /** Repeat table headers on each page */
  repeatHeaders?: boolean;
  /** Minimum rows per page before splitting */
  minRowsPerPage?: number;
  /** Add borders to tables in PDF */
  enforceBorders?: boolean;
}

export interface TableInfo {
  element: HTMLTableElement;
  hasHeader: boolean;
  headerHeight: number;
  rowHeights: number[];
  totalHeight: number;
}

/**
 * Analyze table structure and dimensions
 */
export function analyzeTable(table: HTMLTableElement): TableInfo {
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : Array.from(table.querySelectorAll('tr'));

  const hasHeader = !!thead;
  const headerHeight = thead ? thead.getBoundingClientRect().height : 0;

  const rowHeights = rows.map((row) => row.getBoundingClientRect().height);
  const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0) + headerHeight;

  return {
    element: table,
    hasHeader,
    headerHeight,
    rowHeights,
    totalHeight,
  };
}

/**
 * Prepare table for PDF rendering with page breaks
 */
export function prepareTableForPDF(
  table: HTMLTableElement,
  options: TableProcessingOptions = {}
): void {
  const {
    allowRowSplit = false,
    repeatHeaders = true,
    enforceBorders = true,
  } = options;

  // Add page break prevention to rows if not allowing splits
  if (!allowRowSplit) {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      (row as HTMLElement).style.pageBreakInside = 'avoid';
      (row as HTMLElement).style.breakInside = 'avoid';
    });
  }

  // Ensure table headers repeat on each page
  if (repeatHeaders) {
    const thead = table.querySelector('thead');
    if (thead) {
      (thead as HTMLElement).style.display = 'table-header-group';
    }
  }

  // Enforce borders for better visibility in PDF
  if (enforceBorders) {
    table.style.borderCollapse = 'collapse';

    const cells = table.querySelectorAll('th, td');
    cells.forEach((cell) => {
      const el = cell as HTMLElement;
      if (!el.style.border && !window.getComputedStyle(el).border) {
        el.style.border = '1px solid #d1d5db';
      }
    });
  }

  // Prevent orphaned header rows
  const thead = table.querySelector('thead');
  if (thead) {
    (thead as HTMLElement).style.pageBreakAfter = 'avoid';
  }
}

/**
 * Split large table into multiple tables for pagination
 */
export function splitTableForPagination(
  table: HTMLTableElement,
  maxHeight: number,
  options: TableProcessingOptions = {}
): HTMLTableElement[] {
  const { repeatHeaders = true, minRowsPerPage = 3 } = options;

  const tableInfo = analyzeTable(table);

  // If table fits in one page, return as is
  if (tableInfo.totalHeight <= maxHeight) {
    return [table];
  }

  const tables: HTMLTableElement[] = [];
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody') || table;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  let currentTable = table.cloneNode(false) as HTMLTableElement;
  let currentTbody = document.createElement('tbody');
  let currentHeight = repeatHeaders && thead ? tableInfo.headerHeight : 0;

  // Add header to first table
  if (thead && repeatHeaders) {
    const clonedHeader = thead.cloneNode(true) as HTMLTableSectionElement;
    currentTable.appendChild(clonedHeader);
  }

  rows.forEach((row, index) => {
    const rowHeight = tableInfo.rowHeights[index];

    // Check if adding this row would exceed max height
    if (currentHeight + rowHeight > maxHeight && currentTbody.children.length >= minRowsPerPage) {
      // Finalize current table
      currentTable.appendChild(currentTbody);
      tables.push(currentTable);

      // Start new table
      currentTable = table.cloneNode(false) as HTMLTableElement;
      currentTbody = document.createElement('tbody');
      currentHeight = 0;

      // Add header to new table if repeating
      if (thead && repeatHeaders) {
        const clonedHeader = thead.cloneNode(true) as HTMLTableSectionElement;
        currentTable.appendChild(clonedHeader);
        currentHeight = tableInfo.headerHeight;
      }
    }

    // Add row to current table
    const clonedRow = row.cloneNode(true) as HTMLTableRowElement;
    currentTbody.appendChild(clonedRow);
    currentHeight += rowHeight;
  });

  // Add the last table if it has any rows
  if (currentTbody.children.length > 0) {
    currentTable.appendChild(currentTbody);
    tables.push(currentTable);
  }

  return tables;
}

/**
 * Process all tables in element for PDF rendering
 */
export function processTablesForPDF(
  element: HTMLElement,
  options: TableProcessingOptions = {}
): void {
  const tables = Array.from(element.querySelectorAll('table'));

  tables.forEach((table) => {
    prepareTableForPDF(table, options);
  });
}

/**
 * Add zebra striping to table rows
 */
export function addTableZebraStriping(
  table: HTMLTableElement,
  evenColor: string = '#f9fafb',
  oddColor: string = '#ffffff'
): void {
  const tbody = table.querySelector('tbody') || table;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.forEach((row, index) => {
    (row as HTMLElement).style.backgroundColor = index % 2 === 0 ? evenColor : oddColor;
  });
}

/**
 * Fix table column widths for consistent rendering
 */
export function fixTableColumnWidths(table: HTMLTableElement): void {
  const firstRow = table.querySelector('tr');
  if (!firstRow) return;

  const cells = Array.from(firstRow.querySelectorAll('th, td'));

  cells.forEach((cell) => {
    const width = cell.getBoundingClientRect().width;
    (cell as HTMLElement).style.width = `${width}px`;
    (cell as HTMLElement).style.minWidth = `${width}px`;
    (cell as HTMLElement).style.maxWidth = `${width}px`;
  });

  // Set table layout to fixed for consistent rendering
  table.style.tableLayout = 'fixed';
}

/**
 * Ensure minimum column widths
 */
export function enforceMinimumColumnWidths(
  table: HTMLTableElement,
  minWidth: number = 50
): void {
  const firstRow = table.querySelector('tr');
  if (!firstRow) return;

  const cells = Array.from(firstRow.querySelectorAll('th, td'));

  cells.forEach((cell) => {
    const el = cell as HTMLElement;
    el.style.minWidth = `${minWidth}px`;
  });
}

/**
 * Wrap long text in table cells
 */
export function wrapTableCellText(table: HTMLTableElement): void {
  const cells = table.querySelectorAll('th, td');

  cells.forEach((cell) => {
    const el = cell as HTMLElement;
    el.style.wordWrap = 'break-word';
    el.style.wordBreak = 'break-word';
    el.style.overflowWrap = 'break-word';
    el.style.whiteSpace = 'normal';
  });
}

/**
 * Convert table to a more PDF-friendly structure
 */
export function optimizeTableForPDF(table: HTMLTableElement): void {
  // Fix column widths
  fixTableColumnWidths(table);

  // Wrap text in cells
  wrapTableCellText(table);

  // Ensure borders are visible
  table.style.borderCollapse = 'collapse';

  // Set consistent padding
  const cells = table.querySelectorAll('th, td');
  cells.forEach((cell) => {
    const el = cell as HTMLElement;
    if (!el.style.padding) {
      el.style.padding = '8px';
    }
  });
}

/**
 * Calculate optimal table split points
 */
export function calculateTableSplitPoints(
  tableInfo: TableInfo,
  maxHeight: number,
  options: TableProcessingOptions = {}
): number[] {
  const { minRowsPerPage = 3 } = options;
  const splitPoints: number[] = [];

  let currentHeight = tableInfo.headerHeight;
  let currentRowCount = 0;

  tableInfo.rowHeights.forEach((rowHeight, index) => {
    if (
      currentHeight + rowHeight > maxHeight &&
      currentRowCount >= minRowsPerPage
    ) {
      splitPoints.push(index);
      currentHeight = tableInfo.headerHeight + rowHeight;
      currentRowCount = 1;
    } else {
      currentHeight += rowHeight;
      currentRowCount++;
    }
  });

  return splitPoints;
}

/**
 * Add table summary/totals row that sticks to bottom
 */
export function addTableFooter(
  table: HTMLTableElement,
  footerContent: string[],
  className: string = 'table-footer'
): void {
  let tfoot = table.querySelector('tfoot');

  if (!tfoot) {
    tfoot = document.createElement('tfoot');
    table.appendChild(tfoot);
  }

  const row = document.createElement('tr');
  row.className = className;

  footerContent.forEach((content) => {
    const cell = document.createElement('td');
    cell.textContent = content;
    row.appendChild(cell);
  });

  tfoot.appendChild(row);

  // Style footer
  (tfoot as HTMLElement).style.fontWeight = 'bold';
  (tfoot as HTMLElement).style.backgroundColor = '#f3f4f6';
}

// @flow

export type ColumnCell = {
  // 列格式
  prop: string,
  label?: string | number,
  width?: number,
  minWidth?: number,
  fixed?: boolean,
  subColumns?: Array<ColumnCell>,
}

export type _ColumnCell = {
  // 列单元格式
  prop: string,
  colSpan: number,
  rowSpan: number,
  isLeaf: boolean,
  label?: string,
  width?: number,
  minWidth?: number,
  subColumns?: Array<ColumnCell>,
}

export type _rawDataCell = {
  // 原生数据单元格式
  label: string | number,
  colSpan: number,
  rowSpan: number,
}

export type _rawRowData = Array<_rawDataCell>

export type _serialCell = {
  label: string,
  colSpan: number,
  rowSpan: number,
}

export type Props = {
  columns: Array<ColumnCell>,
  data: Array<Object>,
  showHeader?: boolean, // 是否显示表头
  showBody?: boolean, // 是否显示table body
  tableClass?: string, // 设置 table class
  rawTableData?: Array<_rawRowData>,
  maxHeight?: number,
}

export type State = {
  _columns: Array<_ColumnCell>,
  _leafColumns: Array<ColumnCell>,
}

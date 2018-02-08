// @flow
import React, {Component, Fragment}  from 'react'
import classNames from 'classnames'
import './css/style.css'
import type {ColumnCell, _ColumnCell, _rawDataCell, _rawRowData, _serialCell, Props, State} from './Types'

// Todo : 表单折叠 -> 左右固定 -> 列排序
// 可扩展: 列样式 -> colgroup, col
export default class FlexTable extends Component<Props, State>{
  static defaultProps = {
    showHeader: true,
    showBody: true,
    data: [],
  }

  constructor(props: Props) {
    super(props)

    const {columns, _leafColumns} = this.enhanceColumns(this.props.columns)
    this.state = {
      _columns: columns || [],
      _leafColumns: _leafColumns || [],
    }
  }

  enhanceColumns(columns: Array<ColumnCell>): Object{
    let _leafColumns = []
    let max_level = 1
    let sumLeaf = (col: ColumnCell) => {
      if(col.hasOwnProperty('subColumns')) {
        return (col.subColumns || []).reduce((sum, val) => {
          return sum + sumLeaf(val);
        }, 0)
      } else {
        return 1
      }
    }
    let RecursiveColumns = (cols: Array<Object>, level: number)=> {
      if(level > max_level) {
        max_level += 1
      }
      cols.forEach(x => {
        if(x.hasOwnProperty('subColumns')) {
          x.isLeaf = false
          x.rowSpan = 1
          x.colSpan = sumLeaf(x)
          RecursiveColumns(x.subColumns, level + 1)
        } else {
            x.rowSpan = level
            x.colSpan = 1
            x.isLeaf = true
            _leafColumns.push(x)
            return 1;
        }
      })
    }
    RecursiveColumns(columns, 1)

    let RecursiveLeafColumns = ((cols: Array<Object>) => {
      cols.forEach(x => {
        if(x.isLeaf) {
          x.rowSpan = max_level - x.rowSpan + 1
        } else {
          RecursiveLeafColumns(x.subColumns)
        }
      })
    })
    RecursiveLeafColumns(columns)
    return {columns, _leafColumns};
  }

  serializeColumns(_columns: Array<_ColumnCell>): Array<Array<_serialCell>> {
    let sColumns = []
    let RecursiveColumns = (cols, level) => {
      let nextArray = []
      sColumns[level] = cols.map(x => {
        if(x.hasOwnProperty('subColumns')) {
          nextArray = nextArray.concat(x.subColumns)
        }
        return {
          label: x.label,
          colSpan: x.colSpan,
          rowSpan: x.rowSpan,
        }
      })
      if(!!nextArray.length) {
        RecursiveColumns(nextArray, level + 1)
      }
    }
    RecursiveColumns(_columns, 0)

    return sColumns;
  }

  renderHeaderColumns() {
    const {_columns, _leafColumns} = this.state;
    return (
      <Fragment>
        <colgroup>
          {
            _leafColumns.map((x, idx) => {
              return (
                <col
                  key={idx + 1}
                  style={{width: x.width || x.minWidth || 'none'}}
                />
              )
            })
          }
        </colgroup>
        <thead>
        {
          this.serializeColumns(_columns).map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {
                  row.map((x,idx) => {
                    return (
                      <td key={idx} colSpan={x.colSpan} rowSpan={x.rowSpan}>
                        {x.label}
                      </td>
                    )
                  })
                }
              </tr>
            )
          })
        }
        </thead>
      </Fragment>
    )
  }

  renderBodyData() {
    const {rawTableData, data} = this.props;
    return (
      <tbody>
      {
        !!rawTableData ? (
          rawTableData.map((row, rowIndex) => {
            return (
              <tr
                key={rowIndex}
              >
                {
                  row.map((item, idx) => {
                    return (
                      <td key={idx} colSpan={item.colSpan} rowSpan={item.rowSpan}>{item.label}</td>
                    )
                  })
                }
              </tr>
            )
          })
        ) : (
          data.map((row: Object, rowIndex) => {

            return (
              <tr key={rowIndex}>
                {
                  this.state._leafColumns.map((col, idx) => {
                    return (
                      <td key={idx}>{row[col.prop]}</td>
                    )
                  })
                }
              </tr>
            )
          })
        )
      }
      </tbody>
    )
  }

  render() {
    const {showHeader, showBody, maxHeight, columns, tableClass} = this.props;
    return (
      <div
        className={'mw-flexTable'}
        style={{
            maxHeight: maxHeight || 'none',
          }}
        onScroll={console.log('scroll')}
      >
        <table className={tableClass}>
        {
          showHeader && (
            this.renderHeaderColumns()
          )
        }
        {
          showBody && (
            this.renderBodyData()
          )
        }
        </table>
      </div>
    )
  }
}

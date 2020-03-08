import React, {  useReducer } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import { Table, Button, ConfigProvider } from 'antd';
import './App.scss';
import { ByteInput } from './ByteInput';
import { StringInput } from './StringInput';
import { DownloadItem, progress, remainTime } from './download-item';
import { reducer } from './store';
import prettyMs from 'pretty-ms'
import bytes from 'bytes';


const App: React.FC = () => {
  
  const [ items, dispatch ] = useReducer(reducer, []);

  const makeColumn = (title: string, key: keyof DownloadItem, EditCompnent: any) => ({
    title, dataIndex: key, render (val: any, item: DownloadItem, idx: number) {
      if (item.edit) {
        return (
          <EditCompnent
            value={ item.edit[key] }
            onChange={(value: any) => dispatch({ type: 'update-edit', idx, key, value })} />
        )
      } else {
        return val;
      }
    }
  })

  const columns = [
    ...[
      { title: '名称', dataIndex: 'name', component: StringInput},
      { title: '文件大小', dataIndex: 'size', component: ByteInput },
      { title: '已下载', dataIndex: 'download', component: ByteInput },
      { title: '下载速度', dataIndex: 'speed', component: ByteInput },
    ].map(c => makeColumn(c.title, c.dataIndex as keyof DownloadItem, c.component, )),
    { title: '进度', dataIndex: 'progress', width: 90, render: (val: any, item: DownloadItem) => progress(item.edit || item).toFixed(2) + '%' },
    { title: '剩余时间', dataIndex: 'remainTime', width: 120, render: (val: any, item: DownloadItem) => {
      const remain = remainTime(item.edit || item)
      return (
        <>
        { prettyMs(remain * 1000) }
        </>
      )
    } },
    { title: '操作', dataIndex: 'action', width: 150, render (val: any, item: DownloadItem, idx: number)  {
      if (item.edit) {
        return (<>
          <Button size="small" type="primary" style={{marginRight: 15}}
            onClick={() => dispatch({ type:'update', idx }) }>保存</Button>
          <Button size="small"
            onClick={() => dispatch({ type: 'edit', idx, edit: false })}>取消</Button>
        </>)
      }
      return (
        <>
          <Button size="small" type="default" style={{marginRight: 15}}
            onClick={() => dispatch({ type: 'edit',  idx, edit: true, })}>
              编辑
          </Button>
          <Button size="small" type="danger"
            onClick={() => dispatch({ type: 'remove', idx })}>
            删除
          </Button>
        </>
      )
    }}
  ]

  return (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <div className="table-wrapper">
          <div className="table-header">
            <Button type="primary" onClick={() => dispatch({ type: 'new' })}>
              添加
            </Button>
          </div>
          <Table columns={columns} dataSource={items}
            rowKey="name"
            bordered
            pagination={false}
            summary={(data: DownloadItem[]) => {
              if (data.length === 0) {
                return null
              }

              const total = (key: 'download' | 'size' | 'speed') => data.map(t => t.edit || t)
              .reduce((total, item) => total + bytes.parse(item[key]), 0)
              const totalSize = total('size')
              const totalDownload = total('download')
              const totalSpeed = total('speed')
              const progress = totalDownload / totalSize * 100
              const totalRemain = Math.max(...data.map(t => t.edit || t)
                .map(item => remainTime(item)))

              return (
                <tr>
                  <td>总计</td>
                  <td>{bytes.format(totalSize) }</td>
                  <td>{ bytes.format(totalDownload) }</td>
                  <td>{ bytes.format(totalSpeed) }</td>
                  <td>{ `${progress.toFixed(2)}%` }</td>
                  <td>{ prettyMs(totalRemain * 1000) }</td>
                  <td>
                    <Button size="small" onClick={() => {
                      dispatch({ type: 'clear' })
                    }}>清空</Button>
                  </td>
                </tr>
              )
            }}>
          </Table>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;

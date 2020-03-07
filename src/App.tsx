import React from 'react';
import {  useLocalStore, useObserver } from 'mobx-react';
import zhCN from 'antd/es/locale/zh_CN';
import { Table, Button, ConfigProvider } from 'antd';
import './App.scss';
import { ByteInput } from './ByteInput';
import { StringInput } from './StringInput';

interface DownloadItem {
  name: string,
  size: string,
  download: string,
  speed: string,
  edit: DownloadItem | null,
}


function makeDownalodItem(): DownloadItem {
  const item: DownloadItem = {
    name: '',
    size: '0MB',
    download: '0MB',
    speed: '0KB',
    edit: null,
  }

  item.edit = { ...item }

  return item;
}

const App: React.FC = () => {
  
  const store = useLocalStore<{ items: DownloadItem[] }>(() => ({ items: [] }))

  const makeColumn = (title: string, key: keyof DownloadItem, EditCompnent: any) => ({
    title, dataIndex: key, render (val: any, item: DownloadItem, idx: number) {
      if (item.edit) {
        return (
          <EditCompnent
            value={ item.edit[key] }
            onChange={(value: any) => {
              item.edit = { ...item.edit, [key]: value } as DownloadItem  
            }} />
        )
      } else {
        return val;
      }
    }
  })

  const onAddItem = () => {
    const item = makeDownalodItem();
    store.items = [item, ...store.items]
  }

  const columns = [
    ...[
      { title: '名称', dataIndex: 'name', component: StringInput},
      { title: '文件大小', dataIndex: 'size', component: ByteInput },
      { title: '已下载', dataIndex: 'download', component: ByteInput },
    ].map(c => makeColumn(c.title, c.dataIndex as keyof DownloadItem, c.component, )),
    { title: '进度', dataIndex: 'progress' },
    { title: '剩余时间', dataIndex: 'remainTime' },
    { title: '操作', dataIndex: 'action', width: 150, render (val: any, item: DownloadItem, idx: number)  {
      if (item.edit) {
        return (<>
          <Button size="small" type="primary" onClick={() => store.items[idx] = { ...item.edit } as DownloadItem }>保存</Button>
          <Button size="small" onClick={() => store.items[idx].edit = null}>取消</Button>
        </>)
      }
      return <Button size="small" type="default" onClick={() => item.edit = { ...item }}>编辑</Button>
    }}
  ]

  return useObserver(() => (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <div className="table-wrapper">
          <div className="table-header">
            <Button type="primary" onClick={onAddItem}>
              添加
            </Button>
          </div>
          <Table columns={columns} dataSource={store.items}
            rowKey="name"
            bordered
            pagination={false}>
          </Table>
        </div>
      </div>
    </ConfigProvider>
  ));
}

export default App;

import * as React from 'react'
import './byte-input.scss'
import { Select, InputNumber, } from 'antd'

const { Option } = Select;

type Props = { value: string, onChange: (val: string) => void}

export const ByteInput: React.FC<Props> = ({ value, onChange }) => {
  const units = [ 'KB', 'MB', 'GB', 'Kb', 'Mb' ]
  const [_, number , unit] = /^([\d.]*)(\w*)$/.exec(value) as any

  const onInputChange = (n: number = number, u: string = unit) => {
    return onChange(`${n}${u}`)
  }

  return (
    <div className="byte-input">
      <InputNumber value={number} className="byte-number-input"
        onChange={(val) => onInputChange(parseFloat(val as any) || number)}></InputNumber>
      <Select value={unit} className="byte-unit-input"
        onChange={(val) => onInputChange(undefined, val)}>
        {
          units
            .map(value => <Option key={value} value={value}>{ value }</Option>)
        }
      </Select>
    </div>
  )
}

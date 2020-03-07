import * as React from 'react'
import { Input } from 'antd'

type InputProps = Input['props']

interface Props extends Omit<InputProps, 'onChange'> {
  onChange: (value: string) => void
}

export const StringInput: React.FC<Props> = (props) => {
  return <Input {...props} onChange ={(e) => {
    props.onChange && props.onChange(e.target.value)
  }
  }></Input>
}

// @jsx h
import { h } from 'rui'
import { Element } from 'rui/src/html'

export default function buildWithString(Tag, props, ...children) {
  return typeof Tag === 'string'
    ? <Element tag={Tag} {...props}>{...children}</Element>
    : <Tag {...props}>{...children}</Tag>
}

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

import Vue from 'vue'
import Element from 'element-ui'
Vue.use(Element)

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

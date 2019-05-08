import React, { Component } from 'react';

export const handleChangeFunction = function <S>(self: Component) {
  return function <T extends keyof S>(value: any, target: T) {
    self.setState({ [target]: value } as { [P in T]: S[P]; })
  }
}

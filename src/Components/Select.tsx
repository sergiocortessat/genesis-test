/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import React from 'react'

interface IProps {
    handleInputChange: (value: string) => void
    handleToSelect: (value: string) => void
    handleFromSelect: (value: string) => void
    currencies: {
    currency_name: string
    is_obsolete: boolean
    iso: string
    flag?: string
    }[]
}

const Select = ({ handleInputChange, handleToSelect, handleFromSelect, currencies }:IProps) => {
  console.log(currencies)
  return (
    <form>
    <input type="number" placeholder=" Amount" min="1" step="any" onChange={(e) => handleInputChange(e.target.value)} />
    <select onChange={(e) => handleToSelect(e.target.value)} disabled={(currencies.length < 1)}>
      {currencies && currencies.map((currency: any) => <option key={currency.iso} selected={currency.iso === 'USD'} value={[currency.iso, currency.currency_name]}>{`  ${currency.flag}  ${currency.iso} - ${currency.currency_name}`}</option>)}
    </select>
    <select onChange={(e) => handleFromSelect(e.target.value)} disabled={(currencies.length < 1)}>
      {currencies && currencies.map((currency: any) => <option key={currency.iso} selected={currency.iso === 'EUR'} value={[currency.iso, currency.currency_name]}>{`  ${currency.flag}  ${currency.iso} - ${currency.currency_name}`}</option>)}
    </select>
  </form>
  )
}

export default Select

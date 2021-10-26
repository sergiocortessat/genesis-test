/* eslint-disable no-use-before-define */
import React from 'react'
import Spinner from '../Modules/Spinner'

interface CurrencyToAndFrom {
    'name': string
    'curr': string
}

interface Rate {
    'quotecurrency': string
    'mid': Number
}

interface IProps {
    rate: Rate
    loading: boolean
    amount: number
    currFrom: CurrencyToAndFrom
    currTo: CurrencyToAndFrom
}

const rateSection = ({ loading, amount, currFrom, currTo, rate }: IProps) => {
  return (
      <>
    {!loading
      ? (
        <>
          <p>
            {amount.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            <span>{`${currFrom.name} = `}</span>
          </p>
          {' '}
          <p>
            {rate.mid.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            <span>{`${currTo.name}`}</span>
          </p>
        </>
        )
      : (
        <Spinner />
        )}
          </>
  )
}

export default rateSection

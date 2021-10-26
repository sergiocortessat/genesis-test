/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../Styles/Convertor.scss'
import Spinner from '../Modules/Spinner'
import Select from './Select'
import RateSection from './rateSection'

interface Currency {
    currency_name: string
    is_obsolete: boolean
    iso: string
    flag?: string
}

interface Rate {
    'quotecurrency': string
    'mid': Number
}

interface CurrencyToAndFrom {
    'name': string
    'curr': string
}

interface Currencies {
    'currencies': Currency[]
}

interface respponse {
    'currencies' : {
        [key: string]: {
            'currency_name': string
        }
    },
    'flag' : string

}

// Interface for axios.get respective

function Convertor () {
  const [currencies, setCurrencies] = useState<Currency[] | []>([])
  const [currFrom, setCurrFrom] = useState<CurrencyToAndFrom>({ name: 'United states dollar', curr: 'USD' })
  const [currTo, setCurrTo] = useState<CurrencyToAndFrom>({ name: 'Euro', curr: 'EUR' })
  const [amount, setAmount] = useState(Number)
  const [rate, setRate] = useState<Rate>({ quotecurrency: '', mid: 0 })
  const [loading, setLoading] = useState(false)

  const { REACT_APP_API_KEY_USER } = process.env
  const { REACT_APP_API_KEY_PASSWORD } = process.env

  useEffect(() => {
    axios.get<Currencies>('https://xecdapi.xe.com/v1/currencies', {
      auth: {
        username: `${REACT_APP_API_KEY_USER}`,
        password: `${REACT_APP_API_KEY_PASSWORD}`
      }
    })
      .then((resp) => {
        const currencies = resp.data.currencies
        axios.get<respponse[]>('https://restcountries.com/v3.1/all')
          .then((res) => {
            const countries = res.data

            // Map over the currencies, and match their respective ISO
            // code eslint to the country ISO in the REST Countries API,
            // then return the currency object along with the flag image url.
            // No flag means a placeholder is added.
            const currenciesWithFlags : any = currencies.map((obj: Currency) => {
              const flagFound = countries.find((country: { currencies: {} }) => {
                if (country.currencies) return Object.keys(country.currencies)[0] === obj.iso
                return null
              })

              if (obj.currency_name === 'US Dollar') return { ...obj, flag: countries[108].flag }
              if (obj.currency_name === 'Euro') return { ...obj, flag: countries[97].flag }
              if (flagFound) return { ...obj, flag: flagFound.flag }
              if (!flagFound) return { ...obj, flag: '🇺🇳' }
            })

            // Set the currency list for the populated filtered countries with flags
            setCurrencies(currenciesWithFlags)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleConvert = (e: any) => {
    // Once the button is clicked, a convertor API call is triggered with To and From currencyes with amount
    e.preventDefault()
    setLoading(true)
    axios.get(`https://xecdapi.xe.com/v1/convert_from.json/?from=${currFrom.curr}&to=${currTo.curr}&amount=${amount}&decimal_places=4`, {
      auth: {
        username: `${REACT_APP_API_KEY_USER}`,
        password: `${REACT_APP_API_KEY_PASSWORD}`
      }
    }).then((resp: any) => {
      setRate(resp.data.to[0])
    }).catch((err) => {
      console.log(err)
    })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleToSelect = (e: any) => {
    const [curr, name] = e.split(',')
    setCurrFrom({ name, curr })
    setRate({ quotecurrency: '', mid: 0 })
  }

  const handleFromSelect = (e: any) => {
    const [curr, name] = e.split(',')
    setCurrTo({ name, curr })
    setRate({ quotecurrency: '', mid: 0 })
  }

  const handleInputChange = (e: any) => {
    setAmount(Number(e))
    setRate({ quotecurrency: '', mid: 0 })
  }

  return (
    <div className="convertor">
      <div className="convertor-form">
        <Select handleToSelect={handleToSelect} handleInputChange={handleInputChange} handleFromSelect={handleFromSelect} currencies ={currencies} />
        {/* <form>
          <input type="number" placeholder=" Amount" min="1" step="any" onChange={(e) => handleInputChange(e.target.value)} />
          <select onChange={(e) => handleToSelect(e.target.value)} disabled={(currencies.length < 1)}>
            {currencies.map((currency: any) => <option key={currency.iso} selected={currency.iso === 'USD'} value={[currency.iso, currency.currency_name]}>{`  ${currency.flag}  ${currency.iso} - ${currency.currency_name}`}</option>)}
          </select>
          <select onChange={(e) => handleFromSelect(e.target.value)} disabled={(currencies.length < 1)}>
            {currencies.map((currency: any) => <option key={currency.iso} selected={currency.iso === 'EUR'} value={[currency.iso, currency.currency_name]}>{`  ${currency.flag}  ${currency.iso} - ${currency.currency_name}`}</option>)}
          </select>
        </form> */}
      </div>
      <div className="convertor-section">
        <button type="button" onClick={(e) => handleConvert(e)} disabled={!(amount > 0)}>{amount ? 'Convert' : '...'}</button>
        <div className="convertor-section-rate">
          {/* {!loading
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
              )} */}
            <RateSection amount={amount} rate={rate} loading={loading} currTo={currTo} currFrom={currFrom}/>
        </div>
      {currencies.length < 1 && (
        <div className="Loading">
            <Spinner />
        </div>
      )}

      </div>
    </div>
  )
}

export default Convertor

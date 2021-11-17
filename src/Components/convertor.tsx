/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Convertor.scss';
// import { ChangeEvent } from 'react-transition-group/node_modules/@types/react';
import Spinner from '../Modules/Spinner';
import Select from './Select';
import RateSection from './rateSection';
import { usaFlag, eurFlag, neutralFlag } from '../countryData';

interface Currency {
  currency_name: string
  is_obsolete: boolean
  iso: string
  flag?: string
}

interface Rate {
  'quotecurrency': string
  'mid': number
}

interface CurrencyToAndFrom {
  'name': string
  'curr': string
}

interface Currencies {
  'currencies': Currency[]
}

interface respponse {
  'currencies': {
    [key: string]: {
      'currency_name': string
    }
  },
  'flag': string

}

// interface for

// set interface XE exchange convertor response
interface XEresponse {
  'to' : Array<{
    quotecurrency: string
    mid: number
  }>
}

// Interface for axios.get respective

function Convertor() {
  const [currencies, setCurrencies] = useState<Currency[] | []>([]);
  const [currFrom, setCurrFrom] = useState<CurrencyToAndFrom>({ name: 'United states dollar', curr: 'USD' });
  const [currTo, setCurrTo] = useState<CurrencyToAndFrom>({ name: 'Euro', curr: 'EUR' });
  const [amount, setAmount] = useState(Number);
  const [rate, setRate] = useState<Rate>({ quotecurrency: '', mid: 0 });
  const [loading, setLoading] = useState(false);

  const { REACT_APP_API_KEY_USER } = process.env;
  const { REACT_APP_API_KEY_PASSWORD } = process.env;

  useEffect(() => {
    axios.get<Currencies>('https://xecdapi.xe.com/v1/currencies', {
      auth: {
        username: 'freelancer21981605',
        password: 'tl6tq02poabhq75a3rgsk6mo2v',
      },
    })
      .then((resp) => {
        const { currenciess }:any = resp.data;
        axios.get<respponse[]>('https://restcountries.com/v3.1/all')
          .then((res) => {
            const countries = res.data;

            // Map over the currencies, and match their respective ISO
            // code eslint to the country ISO in the REST Countries API,
            // then return the currency object along with the flag image url.
            // No flag means a placeholder is added.
            const currenciesWithFlags = currenciess.map((obj: Currency) => {
              const flagFound = countries.find((country: { currencies: {} }) => {
                if (country.currencies) return Object.keys(country.currencies)[0] === obj.iso;
              });

              if (obj.currency_name === 'US Dollar') return { ...obj, flag: usaFlag };
              if (obj.currency_name === 'Euro') return { ...obj, flag: eurFlag };
              return flagFound ? { ...obj, flag: flagFound.flag } : { ...obj, flag: neutralFlag };
            });

            // Set the currency list for the populated filtered countries with flags
            setCurrencies(currenciesWithFlags);
          })
          .catch(() => {
            const currencyNoFlags = currencies.map((obj: Currency) => {
              if (obj.currency_name === 'US Dollar') return { ...obj, flag: usaFlag };
              if (obj.currency_name === 'Euro') return { ...obj, flag: eurFlag };
              return { ...obj, flag: neutralFlag };
            });
            setCurrencies(currencyNoFlags);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleConvert = (e: any) => {
    // Once the button is clicked, a convertor API call is triggered with To and From currencyes with amount
    e.preventDefault();
    setLoading(true);
    axios.get<XEresponse>(`https://xecdapi.xe.com/v1/convert_from.json/?from=${currFrom.curr}&to=${currTo.curr}&amount=${amount}&decimal_places=4`, {
      auth: {
        username: `${REACT_APP_API_KEY_USER}`,
        password: `${REACT_APP_API_KEY_PASSWORD}`,
      },
    }).then((resp) => {
      console.log(resp);
      const { to } = resp.data;
      setRate(to[0]);
    }).catch((err) => {
      console.log(err);
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleToSelect = (e: string) => {
    const [curr, name] = e.split(',');
    setCurrFrom({ name, curr });
    setRate({ quotecurrency: '', mid: 0 });
  };

  const handleFromSelect = (e: string) => {
    const [curr, name] = e.split(',');
    setCurrTo({ name, curr });
    setRate({ quotecurrency: '', mid: 0 });
  };

  const handleInputChange = (e:string) => {
    setAmount(Number(e));
    setRate({ quotecurrency: '', mid: 0 });
  };

  return (
    <div className="convertor">
      <div className="convertor-form">
        <Select handleToSelect={handleToSelect} handleInputChange={handleInputChange} handleFromSelect={handleFromSelect} currencies={currencies} />
      </div>
      <div className="convertor-section">
        <button type="button" onClick={(e) => handleConvert(e)} disabled={!(amount > 0)}>{amount ? 'Convert' : '...'}</button>
        <div className="convertor-section-rate">
          {rate.mid > 0
            && <RateSection amount={amount} rate={rate} loading={loading} currTo={currTo} currFrom={currFrom} />}
        </div>
        {currencies.length < 1 && (
          <div className="Loading">
            <Spinner />
          </div>
        )}

      </div>
    </div>
  );
}

export default Convertor;

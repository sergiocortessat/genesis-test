import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Convertor.scss'
import Spinner from '../Modules/Spinner'

interface Currency {
    currency_name: string
    is_obsolete: boolean
    iso: string
    flag: string
}

interface Rate {
    'quotecurrency': string
    'mid': Number
}

interface CurrencyToAndFrom {
    "name": string
    "curr": string
}


function Convertor() {
    const [currencies, setCurrencies] = useState<Currency[] | []>([]);
    const [currFrom, setCurrFrom] = useState<CurrencyToAndFrom>({ "name": "United states dollar", "curr": "USD" })
    const [currTo, setCurrTo] = useState<CurrencyToAndFrom>({ 'name': 'Euro', 'curr': 'EUR' })
    const [amount, setAmount] = useState(Number)
    const [rate, setRate] = useState<Rate>({ "quotecurrency": '', "mid": 0 })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get('https://xecdapi.xe.com/v1/currencies', {
            auth: {
                username: "freelancer21981605",
                password: 'tl6tq02poabhq75a3rgsk6mo2v'
            }
        })
            .then((resp: any) => {
                const currencies = resp.data.currencies;
                axios.get('https://restcountries.com/v3.1/all')
                    .then((resp) => {
                        const countries: any = resp.data

                        // Map over the currencies, and match their respective ISO code to the country ISO in the REST Countries API,
                        // then return the currency object along with the flag image url. No flag means a placeholder is added.
                        let currenciesWithFlags: any = currencies.map((obj: Currency) => {

                            let flagFound = countries.find((country: { currencies: {} }) => {
                                if (country.currencies) return Object.keys(country.currencies)[0] === obj.iso
                                return ""
                            })

                            if (obj.currency_name === 'US Dollar') return { ...obj, flag: countries[108].flag }
                            if (obj.currency_name === 'Euro') return { ...obj, flag: countries[97].flag }
                            else if (!flagFound) return { ...obj, flag: '🇺🇳' }
                            else if (flagFound) return { ...obj, flag: flagFound.flag }
                            return currenciesWithFlags
                        })


                        // Set the currency list for the populated filtered countries with flags
                        setCurrencies(currenciesWithFlags)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleConvert = (e: any) => {
        e.preventDefault()
        setLoading(true)
        axios.get(`https://xecdapi.xe.com/v1/convert_from.json/?from=${currFrom.curr}&to=${currTo.curr}&amount=${amount}&decimal_places=4`, {
            auth: {
                username: "freelancer21981605",
                password: 'tl6tq02poabhq75a3rgsk6mo2v'
            }
        }).then((resp: any) => {
            setRate(resp.data.to[0]);
        }).catch(err => {
            console.log(err);
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }

    const handleToSelect = (e: any) => {
        const [curr, name] = e.split(',');
        setCurrFrom({ "name": name, 'curr': curr })
        setRate({ "quotecurrency": '', "mid": 0 })

    }

    const handleFromSelect = (e: any) => {
        const [curr, name] = e.split(',');
        setCurrTo({ "name": name, 'curr': curr })
        setRate({ "quotecurrency": '', "mid": 0 })

    }

    const handleInputChange = (e: any) => {
        setAmount(Number(e))
        setRate({ "quotecurrency": '', "mid": 0 })
    }
    return (
        <div className="convertor">
            <div className="convertor-form">
                <form>
                    <input type="number" placeholder=" Amount" min="1" step="any" onChange={(e) => handleInputChange(e.target.value)} />
                    <select onChange={(e) => handleToSelect(e.target.value)}>
                        {currencies.map((currency: any) => {
                            return <option key={currency.iso} selected={currency.iso === "USD" ? true : false} value={[currency.iso, currency.currency_name]}>{`  ${currency.flag}  ${currency.iso} - ${currency['currency_name']}`}</option>
                        })}
                    </select>
                    <select onChange={(e) => handleFromSelect(e.target.value)}>
                        {currencies.map((currency: any) => {
                            return <option key={currency.iso} selected={currency.iso === "EUR" ? true : false} value={[currency.iso, currency.currency_name]}>{`  ${currency.flag}  ${currency.iso} - ${currency['currency_name']}`}</option>
                        })}
                    </select>
                </form>
            </div>
            <div className="convertor-section">
                <button type='button' onClick={(e) => handleConvert(e)} disabled={amount > 0 ? false : true}>{amount ? "Convert" : "..."}</button>
                <div className="convertor-section-rate">
                    {!loading ? (
                        <>
                            <p>{amount.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')}<span>{`${currFrom.name} = `}</span></p>
                            {" "}
                            <p>{rate.mid.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')}<span>{`${currTo.name}`}</span></p>
                        </>
                    ) : (
                        <Spinner />
                    )
                    }
                </div>
            </div>
        </div>
    );
}

export default Convertor;

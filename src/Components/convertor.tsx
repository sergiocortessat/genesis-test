import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Convertor() {
    const [currencies, setCurrencies] = useState([]);
    const [currFrom, setCurrFrom] = useState({ "name": "United states dollar", "curr": "USD" })
    const [currTo, setCurrTo] = useState({ 'name': 'Euro', 'curr': 'EUR' })
    const [amount, setAmount] = useState(Number)
    const [rate, setRate] = useState({ "quotecurrency": String, "mid": Number })

    useEffect(() => {
        axios.get('https://xecdapi.xe.com/v1/currencies', {
            auth: {
                username: "freelancer21981605",
                password: 'tl6tq02poabhq75a3rgsk6mo2v'
            }
        })
            .then((resp: any) => {
                let currencies: [] = resp.data.currencies
                axios.get('https://restcountries.com/v3.1/all')
                    .then((resp) => {
                        const countries: any = resp.data

                        // Map over the currencies, and match their respective ISO code to the country ISO in the REST Countries API,
                        // then return the currency object along with the flag image url. No flag means a placeholder is added.
                        let currenciesWithFlags: any = currencies.map((obj: any) => {

                            let flagFound: any = countries.find((country: any) => {
                                if (country.currencies) return Object.keys(country.currencies)[0] === obj.iso
                                return ""
                            })

                            if (obj.currency_name === 'US Dollar') return { ...obj, flag: countries[108].flag }
                            if (obj.currency_name === 'Euro') return { ...obj, flag: countries[97].flag }
                            else if (!flagFound) return { ...obj, flag: '' }
                            else if (flagFound) return { ...obj, flag: flagFound.flag }
                        })


                        // Set the currency list for the user to chose from
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
        // console.log("rate");
        axios.get(`https://xecdapi.xe.com/v1/convert_from.json/?from=${currFrom.curr}&to=${currTo.curr}&amount=${amount}`, {
            auth: {
                username: "freelancer21981605",
                password: 'tl6tq02poabhq75a3rgsk6mo2v'
            }
        }).then((resp: any) => {
            // setRate(res.data.to)
            setRate(resp.data.to[0]);
        }).catch(err => {
            console.log(err);
        })
    }
    console.log(currencies);
    // console.log(currFrom);
    // console.log(currTo);
    // console.log(amount);
    // console.log(rate);

    const handleToSelect = (e: any) => {
        const [curr, name] = e.split(',');
        setCurrFrom({ "name": name, 'curr': curr })

    }

    const handleFromSelect = (e: any) => {
        const [curr, name] = e.split(',');
        setCurrTo({ "name": name, 'curr': curr })

    }
    return (
        <div className="convertor">
            <div>
                <form>
                    <input type="number" placeholder="amount" onChange={(e) => setAmount(Number(e.target.value))} />
                    <select onChange={(e) => handleToSelect(e.target.value)}>
                        {currencies.map((currency: any) => {
                            return <option selected={currency.iso === "USD" ? true : false} value={[currency.iso, currency.currency_name]}>{`${currency.flag}  ${currency.iso} - ${currency['currency_name']}`}</option>
                        })}
                    </select>
                    <select defaultValue="Select an option" onChange={(e) => handleFromSelect(e.target.value)}>
                        {currencies.map((currency: any) => {
                            return <option selected={currency.iso === "EUR" ? true : false} value={[currency.iso, currency.currency_name]}>{`${currency.flag}  ${currency.iso} - ${currency['currency_name']}`}</option>
                        })}
                    </select>
                </form>
            </div>
            <div>
                <button type='button' onClick={(e) => handleConvert(e)} disabled={amount > 0 ? false : true}>Convert</button>
                <div>
                    {rate && (
                        <>
                            <p>{amount}<span>{`${currFrom.name} = `}</span></p>
                            {" "}
                            <p>{rate.mid}<span>{`${currTo.name}`}</span></p>
                        </>
                    )
                    }
                </div>
            </div>
        </div>
    );
}

export default Convertor;

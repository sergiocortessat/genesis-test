import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';


function App() {
  const [currencies, setCurrencies] = useState([]);
  const [currFrom, setCurrFrom] = useState('')
  const [currTo, setCurrTo] = useState('')
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

        // Fetch flags for each country from REST countries API (not all flags are available)
        axios.get('https://restcountries.com/v3.1/all')
          .then((resp:any) => {
            // console.log(resp.data)
            let countries: any = resp.data

            // Map over the currencies, and match their respective ISO code to the country ISO in the REST Countries API,
            // then return the currency object along with the flag image url. No flag means a placeholder is added.
            let currenciesWithFlags: any = currencies.map((obj:any) => {
          
              let flagFound: any = countries.find((country: any) => country.cioc === obj.iso) 
              // return flagFound !== undefined ? { ...obj, flag: flagFound.flag } : { ...obj, flag: 'https://via.placeholder.com/150' }           

              if (obj.currency_name === 'US Dollar') return { ...obj, flag: 'https://restcountries.eu/data/usa.svg' }
              else if (!flagFound) return { ...obj, flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Blue_question_mark_icon.svg/1200px-Blue_question_mark_icon.svg.png' }
              else if (flagFound) return { ...obj, flag: flagFound.flag }
            })
            // Set the initial pair of currencies, I've chosen USD and PLN
            setCurrencies(currenciesWithFlags)
            // Set the currency list for the user to chose from
          })
          .catch((err) => {
            console.log(err)
          })
          // setCurrencies(resp.data.currencies)
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  const handleConvert = (e: any) => {
    e.preventDefault()
    // console.log("rate");
    axios.get(`https://xecdapi.xe.com/v1/convert_from.json/?from=${currFrom}&to=${currTo}&amount=${amount}`, {
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
  return (
    <div className="App">
      {/* form to receive amount, from and to */}
      <form>
        <input type="number" placeholder="amount" onChange={(e) => setAmount(Number(e.target.value))} />
        <select onChange={(e) => setCurrFrom(e.target.value)}>
          {currencies.map((currency: any) => {
            return <option selected={currency.iso === "USD" ? true : false} value={currency.iso}>{currency.iso + " - " + currency['currency_name']}</option>
          })}
        </select>
        <select defaultValue="Select an option" onChange={(e) => setCurrTo(e.target.value)}>
          {currencies.map((currency: any) => {
            return <option selected={currency.iso === "EUR" ? true : false} value={currency.iso}>{currency.iso + " - " + currency['currency_name']}</option>
          })}
        </select>
        <button type='button' onClick={(e) => handleConvert(e)} disabled={amount > 0 ? false : true}>Convert</button>
      </form>
      <section>
        {rate && rate.mid}
      </section>
    </div>
  );
}

export default App;

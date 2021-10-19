import axios from "axios"

export const XECall = () => {
    let currencies:[] = []
    axios.get('https://xecdapi.xe.com/v1/currencies', {
      auth: {
        username: "freelancer21981605",
        password: 'tl6tq02poabhq75a3rgsk6mo2v'
      }
    })
      .then((resp: any) => {
        currencies = resp.data.currencies
      })
        .catch((err:Error) => {
            console.log(err)
            })
    return currencies
}
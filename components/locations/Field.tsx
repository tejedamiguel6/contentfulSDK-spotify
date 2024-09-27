import React, { useEffect, useState } from 'react'
import {
  Paragraph,
  TextInput,
  Note,
  EntityList,
  EntryCard,
  Button,
  IconButton,
} from '@contentful/f36-components'
import { PlusIcon, DoneIcon } from '@contentful/f36-icons'

import { FieldAppSDK } from '@contentful/app-sdk'
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit'
import { graphql } from 'graphql' // ES6

import { exchangeCodeForToken, getAuthCode } from '../../api/login'

const Field = () => {
  const sdk = useSDK<FieldAppSDK>()
  const [value, setValue] = useState(sdk.field.getValue() || '')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const [urlCode, setUrlCode] = useState('code')

  useAutoResizer()

  const handleChange = (e) => {
    const newValue = e.target.value

    console.log('changing value')
    setValue(newValue)
    sdk.field.setValue(newValue)
  }

  const handleSelectedTrack = (trackId: string) => {
    console.log('you clicked on', trackId)
    sdk.field.setValue(trackId)
    setSelected(trackId)
  }

  // console.log(sdk.parameters, 'sdk parameters')

  useEffect(() => {
    const fetchToken = async () => {
      const code = sdk.parameters
      // console.log('code', code)
      const urlCode = window.location.href
      console.log('urlCode---->', urlCode)
      // const token = await exchangeCodeForToken(code)
      // console.log('token', token)
    }

    fetchToken()
  }, [])

  return (
    <div>
      {/* {JSON.stringify(data)} */}
      <Button onClick={getAuthCode}>Connect to Spotify</Button>

      {loading && <Paragraph>LOADINNNNGGG...</Paragraph>}

      {/* {data ? (
        data.items.map((item) => {
          console.log(item, 'get the image')
          const image = item.album.images[0].url
          return (
            <div key={item.id}>
              <EntryCard
                title={item.name}
                description={item.id}
                style={selected === item.id ? { border: '2px solid red' } : {}}
                thumbnailElement={<img alt='album image' src={image} />}
                onClick={() => handleSelectedTrack(item.id)}
              />
            </div>
          )
        })
      ) : (
        <Paragraph>NO DATA</Paragraph>
      )} */}
      {/* <Note>This is my note</Note> */}
      {/* <Paragraph>Hello Entry Field Component (AppId: {sdk.ids.app})</Paragraph> */}
      {/* <TextInput value={value} onChange={handleChange} /> */}
    </div>
  )
}

export default Field

//https://app.contentful.com/spaces/49q7jc3xpc1z/entries/3Wq5RiSSZHDBrhMi7ZUayw?focusedField=spotifyTrackId&code=AQDlk2vaxs4d7qkvPHWYWZOfgrbDqAQTg3v-Si0eolYKFa1qFYTuyyMJVxm6jvGmV97QqPcQUTJxdOvPqUhUqP5L07S5iWo9rRN0SZbRBcjIByjRd_C3PpXUM2Si-eKPOFTvY3NPGqWybe-nBK2wH4EgbptOtbBYvz8FCIM7e7v54iZNJLGboJC7jX7j0i3Oxe85M7jYqDeNvckM42EC7w6qVMLF9OgZLybH9y3zafLT7IoFirfRAAZvwjuI-cuqsH1twrXJIEFky0Xvl-Iz4gzKOoDeacD4FPMcZxrrI52bLXbJ2YstMPSlb6dUz8Dv14r4Zo5iUeoXYJJImVJhEz6OrKZ4lneDvlkVM7oPacgMJwrqzOrJUyI4wGk3B8y6ZS9mOw

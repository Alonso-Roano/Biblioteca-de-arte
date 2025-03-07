export const genericRequest = async (url: string, method: string, body?: any) => {
  try {
    const res = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('haber que hay')
    console.log(res)
    return await res.json()
  } catch (e) {
    console.log(e)
  }
}

export const genericRequestAuthenticated = async (
  url: string,
  method: string,
  query: string,
  header: object,
) => {
  const res = await fetch(url, {
    method: method,
    headers: {
      ...header,
      'Content-Type': 'application/json',
    },
  })
  return await res.json()
}

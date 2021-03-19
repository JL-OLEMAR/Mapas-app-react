import { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { v4 } from 'uuid'

mapboxgl.accessToken = 'pk.eyJ1Ijoib2xlbWFyMTk5NiIsImEiOiJja201a21senIwZjd5MnBydGUxMm03bTJoIn0.gkSIEUCMnuLi2FRdQh66WA'

export const useMapbox = (puntoInicial) => {
  // Referencia al DIV del mapa
  const mapaDiv = useRef()
  const setRef = useCallback((node) => {
    mapaDiv.current = node
  }, [])

  // Referecia los marcadores
  const marcadores = useRef({})

  // Mapa y coords
  const mapa = useRef()
  const [coords, setCoords] = useState(puntoInicial)

  // funcion para agregar marcadores
  const agregarMarcador = useCallback((ev) => {
    const { lng, lat } = ev.lngLat
    const marker = new mapboxgl.Marker()
    marker.id = v4() // TODO: si el marcador ya tiene ID
    marker
      .setLngLat([lng, lat])
      .addTo(mapa.current)
      .setDraggable(true)

    // Asignamos al objeto de marcadores
    marcadores.current[marker.id] = marker

    // escuchar movimientos del marcador
    marker.on('drag', ({ target }) => {
      const { id } = target
      const { lng, lat } = target.getLngLat()

      // TODO: emitir los cambios del marcador
    })
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom
    })

    mapa.current = map
  }, [puntoInicial])

  // Cuando se mueva el mapa
  useEffect(() => {
    mapa.current?.on('move', () => {
      const { lng, lat } = mapa.current.getCenter()
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2)
      })
    })
  }, [])

  // Agregar marcadores cuando hago click
  useEffect(() => {
    mapa.current?.on('click', agregarMarcador)
  }, [agregarMarcador])

  return {
    agregarMarcador,
    coords,
    marcadores,
    setRef
  }
}
